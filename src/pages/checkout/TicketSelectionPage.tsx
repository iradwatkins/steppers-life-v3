import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // For quantity
import { Separator } from "@/components/ui/separator";
import { Ticket, ShoppingCart, CalendarDays, MapPin, MinusCircle, PlusCircle, Percent, Tag } from 'lucide-react';

// Mock event data including ticket types
interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
  availableQuantity?: number; // Optional: for showing limited tickets
}

interface MockEventWithTickets {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketTypes: TicketType[];
}

const mockEventData: MockEventWithTickets = {
  id: 'evt987',
  name: 'Grand Steppers Ball 2025',
  date: 'Saturday, October 25, 2025',
  location: 'The Elegant Ballroom, Downtown',
  ticketTypes: [
    { id: 'tt001', name: 'General Admission', price: 50, description: 'Access to main event area.', availableQuantity: 200 },
    { id: 'tt002', name: 'VIP Ticket', price: 120, description: 'Includes priority entry, VIP lounge access, and a complimentary drink.', availableQuantity: 50 },
    { id: 'tt003', name: 'Early Bird Special', price: 40, description: 'Limited time offer for general admission.', availableQuantity: 30 },
    { id: 'tt004', name: 'Table Reservation (Party of 8)', price: 450, description: 'Reserve a dedicated table for your group.' },
  ],
};

interface CartItem {
  ticketTypeId: string;
  ticketTypeName: string;
  quantity: number;
  pricePerTicket: number;
}

const TicketSelectionPage = () => {
  const { eventId: routeEventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const eventId = routeEventId || mockEventData.id; // Use route param or default mock
  const eventDetails = mockEventData; // In a real app, fetch based on eventId

  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoDetails, setAppliedPromoDetails] = useState<{ code: string; discountAmount: number; message: string } | null>(null);

  const handleQuantityChange = (ticketTypeId: string, ticketTypeName: string, pricePerTicket: number, quantity: number) => {
    const existingItemIndex = cart.findIndex(item => item.ticketTypeId === ticketTypeId);
    const newQuantity = Math.max(0, quantity); // Ensure quantity is not negative

    if (newQuantity === 0) {
      setCart(cart.filter(item => item.ticketTypeId !== ticketTypeId));
      return;
    }

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity = newQuantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ticketTypeId, ticketTypeName, quantity: newQuantity, pricePerTicket }]);
    }
  };

  const getTicketQuantityInCart = (ticketTypeId: string): number => {
    return cart.find(item => item.ticketTypeId === ticketTypeId)?.quantity || 0;
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.quantity * item.pricePerTicket), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    if (appliedPromoDetails) {
      return Math.max(0, subtotal - appliedPromoDetails.discountAmount);
    }
    return subtotal;
  };

  const handleApplyPromoCode = () => {
    // Mock promo code validation
    const currentSubtotal = calculateSubtotal();
    if (promoCode.toUpperCase() === "SAVE10") {
        const discountValue = currentSubtotal * 0.10;
      setAppliedPromoDetails({ code: promoCode, discountAmount: discountValue, message: `10% discount applied: -$${discountValue.toFixed(2)}` });
    } else if (promoCode.toUpperCase() === "FLAT20" && currentSubtotal >= 20) {
      setAppliedPromoDetails({ code: promoCode, discountAmount: 20, message: `Flat $20 discount applied: -$20.00` });
    } else if (promoCode.toUpperCase() === "FLAT20" && currentSubtotal < 20) {
      setAppliedPromoDetails(null); // Clear previous if any
      alert("Subtotal must be at least $20 to apply FLAT20 code.");
    }
    else {
      setAppliedPromoDetails(null); // Clear previous if any
      alert("Invalid promo code.");
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
        alert("Please select at least one ticket to proceed.");
        return;
    }
    // In a real app, you'd pass the cart data to the next step
    // For now, just navigate to a placeholder checkout page (to be created)
    console.log('Proceeding to checkout with cart:', cart, 'Promo:', appliedPromoDetails);
    navigate(`/checkout/${eventId}/details`, { state: { cart, appliedPromoDetails, subtotal: calculateSubtotal(), total: calculateTotal() } }); // Pass cart and promo via route state
  };

  return (
    <div className="min-h-screen bg-background-main py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-surface-card mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-text-primary">{eventDetails.name}</CardTitle>
            <CardDescription className="text-text-secondary">
              <div className="flex items-center mt-1"><CalendarDays className="h-4 w-4 mr-2 text-text-tertiary" />{eventDetails.date}</div>
              <div className="flex items-center mt-1"><MapPin className="h-4 w-4 mr-2 text-text-tertiary" />{eventDetails.location}</div>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-surface-card">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-text-primary flex items-center">
              <Ticket className="mr-2 h-5 w-5 text-brand-primary" /> Select Your Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {eventDetails.ticketTypes.map((ticketType) => (
              <div key={ticketType.id} className="p-4 border border-border-default rounded-lg bg-background-main flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex-grow mb-3 sm:mb-0">
                  <h4 className="font-semibold text-text-primary">{ticketType.name} (${ticketType.price.toFixed(2)})</h4>
                  {ticketType.description && <p className="text-sm text-text-secondary mt-1">{ticketType.description}</p>}
                  {ticketType.availableQuantity !== undefined && <p className="text-xs text-brand-primary mt-1">Only {ticketType.availableQuantity - getTicketQuantityInCart(ticketType.id)} left!</p>}
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(ticketType.id, ticketType.name, ticketType.price, getTicketQuantityInCart(ticketType.id) - 1)} disabled={getTicketQuantityInCart(ticketType.id) === 0}>
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <Input 
                    type="number"
                    value={getTicketQuantityInCart(ticketType.id)}
                    onChange={(e) => handleQuantityChange(ticketType.id, ticketType.name, ticketType.price, parseInt(e.target.value, 10) || 0)}
                    className="w-16 text-center hide-arrows" 
                    min="0"
                    max={ticketType.availableQuantity}
                  />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(ticketType.id, ticketType.name, ticketType.price, getTicketQuantityInCart(ticketType.id) + 1)} disabled={ticketType.availableQuantity !== undefined && getTicketQuantityInCart(ticketType.id) >= ticketType.availableQuantity}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <Separator className="my-4" />
          <CardFooter className="flex flex-col items-start p-6 space-y-4">
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="text-lg font-semibold text-text-secondary mb-2 sm:mb-0">Subtotal:</div>
              <div className="text-lg font-semibold text-text-primary">${calculateSubtotal().toFixed(2)}</div>
            </div>

            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Input 
                type="text"
                placeholder="Enter Promo Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-grow"
                disabled={!!appliedPromoDetails} // Disable if a code is already applied
              />
              <Button 
                onClick={handleApplyPromoCode} 
                variant="outline" 
                className="w-full sm:w-auto whitespace-nowrap"
                disabled={!promoCode || !!appliedPromoDetails} // Disable if no code entered or one is applied
              >
                <Tag className="mr-2 h-4 w-4" /> Apply Code
              </Button>
            </div>

            {appliedPromoDetails && (
              <div className="w-full text-sm text-green-600 dark:text-green-400 flex justify-between items-center">
                <span>{appliedPromoDetails.message}</span>
                <Button variant="link" size="sm" onClick={() => { setAppliedPromoDetails(null); setPromoCode(""); }} className="text-red-500 hover:text-red-700">
                  Remove
                </Button>
              </div>
            )}
            
            <Separator className="w-full"/>

            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
              <div className="text-xl font-bold text-text-primary mb-2 sm:mb-0">Total:</div>
              <div className="text-xl font-bold text-text-primary">${calculateTotal().toFixed(2)}</div>
            </div>

            <Button onClick={handleProceedToCheckout} size="lg" className="bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary w-full mt-4" disabled={cart.length === 0}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
      <style jsx global>{`
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-arrows[type=number] {
          -moz-appearance: textfield; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default TicketSelectionPage; 