import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Ticket, Home, Percent } from 'lucide-react';

interface CartItem {
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  pricePerTicket: number;
}

interface AppliedPromoDetails {
  code: string;
  discountAmount: number;
  message: string;
}

interface OrderDetails {
  cart: CartItem[];
  attendeeName: string;
  attendeeEmail: string;
  subtotalAmount: number | null;
  appliedPromoDetails: AppliedPromoDetails | null;
  totalAmount: number | null;
}

interface ConfirmationState {
  orderDetails: OrderDetails;
  mockOrderId: string;
}

const CheckoutConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [confirmationData, setConfirmationData] = useState<ConfirmationState | null>(null);

  useEffect(() => {
    if (location.state && location.state.orderDetails && location.state.mockOrderId) {
      const state = location.state as ConfirmationState;
      setConfirmationData({
        ...state,
        orderDetails: {
          ...state.orderDetails,
          subtotalAmount: typeof state.orderDetails.subtotalAmount === 'number' ? state.orderDetails.subtotalAmount : null,
          appliedPromoDetails: state.orderDetails.appliedPromoDetails || null,
          totalAmount: typeof state.orderDetails.totalAmount === 'number' ? state.orderDetails.totalAmount : null,
        }
      });
    } else {
      console.warn('No confirmation data found. Redirecting to explore...');
      navigate('/explore');
    }
  }, [location.state, navigate]);

  if (!confirmationData) {
    return <div className="min-h-screen bg-background-main flex items-center justify-center"><p>Loading confirmation...</p></div>;
  }

  const { orderDetails, mockOrderId } = confirmationData;

  return (
    <div className="min-h-screen bg-background-main py-8 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-surface-card shadow-xl">
          <CardHeader className="text-center bg-green-500 text-white py-8 rounded-t-lg">
            <CheckCircle className="mx-auto h-16 w-16 mb-4" />
            <CardTitle className="text-3xl font-bold">Thank You For Your Order!</CardTitle>
            <CardDescription className="text-green-100 text-lg mt-2">
              Your tickets have been (mock) confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center">
              <p className="text-text-secondary">Your Order ID is:</p>
              <p className="text-2xl font-semibold text-brand-primary my-1">{mockOrderId}</p>
              <p className="text-text-secondary text-sm">A confirmation email has been (mock) sent to {orderDetails.attendeeEmail}.</p>
            </div>
            
            <Separator />

            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-3">Order Summary:</h4>
              <div className="p-4 bg-background-main rounded-md border border-border-default space-y-2">
                <p className="text-text-secondary"><strong className="text-text-primary">Name:</strong> {orderDetails.attendeeName}</p>
                <p className="text-text-secondary"><strong className="text-text-primary">Email:</strong> {orderDetails.attendeeEmail}</p>
                <Separator className="my-2" />
                {orderDetails.cart.map(item => (
                  <div key={item.ticketTypeId} className="flex justify-between items-center text-sm">
                    <span>{item.ticketTypeName} (x{item.quantity})</span>
                    <span>${(item.quantity * item.pricePerTicket).toFixed(2)}</span>
                  </div>
                ))}
                
                {orderDetails.subtotalAmount !== null && orderDetails.totalAmount !== null && orderDetails.subtotalAmount !== orderDetails.totalAmount && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center text-sm text-text-secondary">
                        <span>Subtotal:</span>
                        <span>${orderDetails.subtotalAmount.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {orderDetails.appliedPromoDetails && orderDetails.appliedPromoDetails.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400">
                        <span className="flex items-center">
                            <Percent className="mr-1 h-3 w-3" />
                            Discount ({orderDetails.appliedPromoDetails.code}):
                        </span>
                        <span>-${orderDetails.appliedPromoDetails.discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg text-text-primary pt-1">
                  <p>Total Amount Paid:</p>
                  <p>${orderDetails.totalAmount !== null ? orderDetails.totalAmount.toFixed(2) : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/profile"> {/* Placeholder - link to user's tickets section in profile */}
                  <Ticket className="mr-2 h-4 w-4" /> View My Tickets (Placeholder)
                </Link>
              </Button>
              <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary">
                <Link to="/explore">
                  <Home className="mr-2 h-4 w-4" /> Explore More Events
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutConfirmationPage; 