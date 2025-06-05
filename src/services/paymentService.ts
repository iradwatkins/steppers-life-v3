import { apiClient } from './apiClient';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  created: number;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResponse {
  success: boolean;
  payment_intent?: PaymentIntent;
  error?: string;
  message?: string;
}

export interface RefundResponse {
  success: boolean;
  refund_id?: string;
  amount?: number;
  error?: string;
  message?: string;
}

class PaymentService {
  private static instance: PaymentService;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Create payment intent for ticket purchase
  async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: Record<string, string>): Promise<PaymentResponse> {
    try {
      const response = await apiClient.createPaymentIntent(amount, currency);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return {
        success: true,
        payment_intent: response.data,
        message: 'Payment intent created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment intent'
      };
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId: string): Promise<PaymentResponse> {
    try {
      const response = await apiClient.confirmPayment(paymentIntentId);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return {
        success: true,
        payment_intent: response.data,
        message: 'Payment confirmed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to confirm payment'
      };
    }
  }

  // Process refund
  async refundPayment(paymentIntentId: string, amount?: number): Promise<RefundResponse> {
    try {
      const response = await apiClient.refundPayment(paymentIntentId, amount);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return {
        success: true,
        refund_id: response.data?.refund_id,
        amount: response.data?.amount,
        message: 'Refund processed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process refund'
      };
    }
  }

  // Calculate payment processing fee
  calculateProcessingFee(amount: number): number {
    // Stripe's standard fee: 2.9% + 30¢
    return Math.round(amount * 0.029 + 30);
  }

  // Calculate total amount including fees
  calculateTotalWithFees(baseAmount: number, includeFeeInTotal: boolean = false): {
    baseAmount: number;
    processingFee: number;
    totalAmount: number;
  } {
    const processingFee = this.calculateProcessingFee(baseAmount);
    const totalAmount = includeFeeInTotal ? baseAmount : baseAmount + processingFee;

    return {
      baseAmount,
      processingFee,
      totalAmount
    };
  }

  // Format amount for display
  formatAmount(amount: number, currency: string = 'USD'): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });

    return formatter.format(amount / 100); // Convert cents to dollars
  }

  // Convert dollars to cents for Stripe
  dollarsToCents(dollars: number): number {
    return Math.round(dollars * 100);
  }

  // Convert cents to dollars
  centsToDollars(cents: number): number {
    return cents / 100;
  }

  // Validate payment amount
  validatePaymentAmount(amount: number, currency: string = 'usd'): {
    valid: boolean;
    error?: string;
  } {
    // Stripe minimum charge amounts
    const minimums: Record<string, number> = {
      usd: 50, // 50 cents
      eur: 50,
      gbp: 30,
      cad: 50,
      aud: 50
    };

    const minimum = minimums[currency.toLowerCase()] || 50;

    if (amount < minimum) {
      return {
        valid: false,
        error: `Minimum charge amount is ${this.formatAmount(minimum, currency)}`
      };
    }

    // Maximum charge amount (Stripe limit is around $999,999.99)
    const maximum = 99999999; // $999,999.99 in cents
    if (amount > maximum) {
      return {
        valid: false,
        error: `Maximum charge amount is ${this.formatAmount(maximum, currency)}`
      };
    }

    return { valid: true };
  }

  // Get payment status display text
  getPaymentStatusDisplay(status: string): {
    text: string;
    color: 'success' | 'warning' | 'error' | 'info';
  } {
    switch (status) {
      case 'succeeded':
        return { text: 'Payment Successful', color: 'success' };
      case 'processing':
        return { text: 'Processing Payment', color: 'info' };
      case 'requires_payment_method':
        return { text: 'Awaiting Payment Method', color: 'warning' };
      case 'requires_confirmation':
        return { text: 'Requires Confirmation', color: 'warning' };
      case 'requires_action':
        return { text: 'Action Required', color: 'warning' };
      case 'canceled':
        return { text: 'Payment Canceled', color: 'error' };
      case 'failed':
        return { text: 'Payment Failed', color: 'error' };
      default:
        return { text: 'Unknown Status', color: 'error' };
    }
  }

  // Create Stripe payment element configuration
  getStripeElementsOptions(clientSecret: string, theme: 'light' | 'dark' = 'light') {
    return {
      clientSecret,
      appearance: {
        theme,
        variables: {
          colorPrimary: '#0570de',
          colorBackground: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          colorText: theme === 'dark' ? '#ffffff' : '#000000',
          colorDanger: '#df1b41',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
      },
    };
  }

  // Handle payment errors
  handlePaymentError(error: any): string {
    if (error.type === 'card_error' || error.type === 'validation_error') {
      return error.message;
    }
    
    switch (error.code) {
      case 'card_declined':
        return 'Your card was declined. Please try a different payment method.';
      case 'expired_card':
        return 'Your card has expired. Please use a different card.';
      case 'incorrect_cvc':
        return 'Your card\'s security code is incorrect.';
      case 'insufficient_funds':
        return 'Your card has insufficient funds.';
      case 'processing_error':
        return 'An error occurred while processing your card. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Generate payment receipt data
  generateReceiptData(paymentIntent: PaymentIntent, customerData?: any) {
    return {
      paymentId: paymentIntent.id,
      amount: this.formatAmount(paymentIntent.amount, paymentIntent.currency),
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      date: new Date(paymentIntent.created * 1000).toLocaleDateString(),
      time: new Date(paymentIntent.created * 1000).toLocaleTimeString(),
      description: paymentIntent.description || 'Event Ticket Purchase',
      metadata: paymentIntent.metadata || {},
      customer: customerData
    };
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();
export default paymentService; 