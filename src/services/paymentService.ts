import { apiClient as api } from './apiClient';

export interface PaymentProvider {
  name: string;
  description: string;
  supports_cards: boolean;
  supports_digital_wallets: boolean;
}

export interface PaymentConfig {
  available_providers: string[];
  supported_currencies: string[];
  test_mode: boolean;
  provider_config: {
    square?: {
      app_id: string;
      environment: string;
    };
    paypal?: {
      client_id: string;
      environment: string;
    };
  };
}

export interface PaymentRequest {
  provider: string;
  source_id?: string;
  verification_token?: string;
  verification_code?: string;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentResult {
  success: boolean;
  payment_id: string;
  provider: string;
  status?: string;
  amount: number;
  currency: string;
  approval_url?: string;
  receipt_number?: string;
  verification_code?: string;
}

export interface PaymentConfirmation {
  payment_id: string;
  provider: string;
  payer_id?: string;
}

export class PaymentService {
  private static instance: PaymentService;
  private config: PaymentConfig | null = null;
  private squareApplicationId: string | null = null;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Initialize payment service and load configuration
  async initialize(): Promise<PaymentConfig> {
    if (!this.config) {
      this.config = await this.getPaymentConfig();
    }
    return this.config;
  }

  // Get payment configuration from backend
  async getPaymentConfig(): Promise<PaymentConfig> {
    const response = await api.get('/payments/config');
    this.config = response.data;
    
    // Store Square app ID for Web Payments SDK
    if (this.config?.provider_config?.square?.app_id) {
      this.squareApplicationId = this.config.provider_config.square.app_id;
    }
    
    return this.config;
  }

  // Get available payment providers with details
  async getPaymentProviders(): Promise<Record<string, PaymentProvider>> {
    const response = await api.get('/payments/providers');
    return response.data.details;
  }

  // Create a payment
  async createPayment(ticketId: string, paymentRequest: PaymentRequest): Promise<PaymentResult> {
    const response = await api.post(`/payments/create-payment/${ticketId}`, paymentRequest);
    return response.data;
  }

  // Confirm payment (mainly for PayPal)
  async confirmPayment(ticketId: string, confirmation: PaymentConfirmation): Promise<any> {
    const response = await api.post(`/payments/confirm-payment/${ticketId}`, confirmation);
    return response.data;
  }

  // Get payment status
  async getPaymentStatus(ticketId: string): Promise<any> {
    const response = await api.get(`/payments/status/${ticketId}`);
    return response.data;
  }

  // Square Web Payments SDK integration
  async initializeSquarePayments(): Promise<any> {
    if (!this.squareApplicationId) {
      throw new Error('Square application ID not configured');
    }

    // Load Square Web Payments SDK
    await this.loadSquareSDK();

    const payments = window.Square.payments(this.squareApplicationId, this.config?.provider_config?.square?.environment || 'sandbox');
    return payments;
  }

  // Load Square Web Payments SDK script
  private loadSquareSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Square) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sandbox.web.squarecdn.com/v1/square.js'; // Use production URL for production
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Square SDK'));
      document.head.appendChild(script);
    });
  }

  // Create Square card payment token
  async createSquareCardToken(card: any): Promise<{ token: string; verificationToken?: string }> {
    const tokenResult = await card.tokenize();
    
    if (tokenResult.status === 'OK') {
      return {
        token: tokenResult.token,
        verificationToken: tokenResult.details?.cvv
      };
    } else {
      throw new Error(`Card tokenization failed: ${tokenResult.errors?.[0]?.message || 'Unknown error'}`);
    }
  }

  // PayPal integration
  async createPayPalPayment(ticketId: string, returnUrl?: string, cancelUrl?: string): Promise<PaymentResult> {
    const paymentRequest: PaymentRequest = {
      provider: 'paypal',
      return_url: returnUrl || `${window.location.origin}/checkout/paypal-return`,
      cancel_url: cancelUrl || `${window.location.origin}/checkout/paypal-cancel`
    };

    return this.createPayment(ticketId, paymentRequest);
  }

  // Cash payment
  async createCashPayment(ticketId: string, verificationCode: string): Promise<PaymentResult> {
    const paymentRequest: PaymentRequest = {
      provider: 'cash',
      verification_code: verificationCode
    };

    return this.createPayment(ticketId, paymentRequest);
  }

  // Refund payment (admin/organizer only)
  async refundPayment(ticketId: string, amount?: number, reason?: string): Promise<any> {
    const response = await api.post(`/payments/refund/${ticketId}`, {
      refund_amount: amount,
      reason: reason || 'Customer refund request'
    });
    return response.data;
  }

  // Helper to format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Check if provider is available
  isProviderAvailable(provider: string): boolean {
    return this.config?.available_providers?.includes(provider) || false;
  }

  // Get provider display name
  getProviderDisplayName(provider: string): string {
    const providerMap: Record<string, string> = {
      'square': 'Square / Cash App',
      'paypal': 'PayPal',
      'cash': 'Cash Payment'
    };
    return providerMap[provider] || provider;
  }
}

// Global payment service instance
export const paymentService = PaymentService.getInstance();

// Square Web Payments SDK types
declare global {
  interface Window {
    Square: any;
  }
} 