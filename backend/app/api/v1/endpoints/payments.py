from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from uuid import UUID
import logging

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.ticket import Ticket, PaymentStatus, TicketStatus
from app.models.user import User
from app.services.payment import PaymentService
from app.schemas.ticket import TicketPayment

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/create-payment-intent/{ticket_id}")
def create_payment_intent(
    ticket_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Create a Stripe payment intent for a ticket."""
    
    # Get the ticket
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Check if user owns the ticket
    if ticket.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to pay for this ticket"
        )
    
    # Check if ticket is still pending
    if ticket.status != TicketStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket payment has already been processed"
        )
    
    try:
        # Create payment intent with Stripe
        payment_intent = PaymentService.create_payment_intent(
            amount=ticket.total_price,
            currency=ticket.currency,
            metadata={
                "ticket_id": str(ticket.id),
                "ticket_number": ticket.ticket_number,
                "event_id": str(ticket.event_id),
                "user_id": str(ticket.user_id)
            }
        )
        
        # Store payment intent ID in ticket
        ticket.payment_intent_id = payment_intent["payment_intent_id"]
        db.commit()
        
        return {
            "client_secret": payment_intent["client_secret"],
            "payment_intent_id": payment_intent["payment_intent_id"],
            "amount": payment_intent["amount"],
            "currency": payment_intent["currency"]
        }
        
    except Exception as e:
        logger.error(f"Payment intent creation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create payment intent"
        )

@router.post("/confirm-payment/{ticket_id}")
def confirm_payment(
    ticket_id: UUID,
    payment_data: TicketPayment,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Confirm payment for a ticket."""
    
    # Get the ticket
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Check if user owns the ticket
    if ticket.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to confirm payment for this ticket"
        )
    
    try:
        # Confirm payment with Stripe
        payment_confirmation = PaymentService.confirm_payment(
            payment_data.payment_intent_id
        )
        
        if payment_confirmation["status"] == "succeeded":
            # Update ticket status
            ticket.payment_status = PaymentStatus.COMPLETED
            ticket.status = TicketStatus.CONFIRMED
            ticket.payment_method = payment_data.payment_method
            ticket.payment_intent_id = payment_confirmation["payment_intent_id"]
            
            db.commit()
            
            return {
                "status": "success",
                "message": "Payment confirmed successfully",
                "ticket_id": str(ticket.id),
                "payment_intent_id": payment_confirmation["payment_intent_id"]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Payment not successful: {payment_confirmation['status']}"
            )
            
    except Exception as e:
        logger.error(f"Payment confirmation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to confirm payment"
        )

@router.post("/refund/{ticket_id}")
def create_refund(
    ticket_id: UUID,
    refund_amount: float = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Create a refund for a ticket (admin/organizer only)."""
    
    # Get the ticket
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Check permissions (admin, moderator, or event organizer)
    if current_user.role.value not in ["admin", "moderator"]:
        # Check if user is event organizer
        if ticket.event.created_by != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to refund this ticket"
            )
    
    # Check if ticket has a successful payment
    if ticket.payment_status != PaymentStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket payment was not completed"
        )
    
    if not ticket.payment_intent_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No payment intent found for this ticket"
        )
    
    try:
        # Create refund with Stripe
        refund = PaymentService.create_refund(
            payment_intent_id=ticket.payment_intent_id,
            amount=refund_amount or ticket.total_price
        )
        
        if refund["status"] == "succeeded":
            # Update ticket status
            ticket.payment_status = PaymentStatus.REFUNDED
            ticket.status = TicketStatus.REFUNDED
            
            db.commit()
            
            return {
                "status": "success",
                "message": "Refund processed successfully",
                "refund_id": refund["refund_id"],
                "amount": refund["amount"],
                "currency": refund["currency"]
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Refund processing failed: {refund['status']}"
            )
            
    except Exception as e:
        logger.error(f"Refund creation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process refund"
        )

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhooks."""
    
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    if not sig_header:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing stripe-signature header"
        )
    
    try:
        # Verify webhook signature
        event = PaymentService.verify_webhook_signature(payload, sig_header)
        
        # Handle different event types
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            
            # Find the ticket by payment intent ID
            ticket = db.query(Ticket).filter(
                Ticket.payment_intent_id == payment_intent["id"]
            ).first()
            
            if ticket:
                ticket.payment_status = PaymentStatus.COMPLETED
                ticket.status = TicketStatus.CONFIRMED
                db.commit()
                logger.info(f"Payment confirmed for ticket {ticket.id}")
        
        elif event["type"] == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            
            # Find the ticket by payment intent ID
            ticket = db.query(Ticket).filter(
                Ticket.payment_intent_id == payment_intent["id"]
            ).first()
            
            if ticket:
                ticket.payment_status = PaymentStatus.FAILED
                db.commit()
                logger.info(f"Payment failed for ticket {ticket.id}")
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Webhook processing failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Webhook processing failed"
        )

@router.get("/config")
def get_payment_config(
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get payment configuration for the frontend."""
    
    from app.core.config import settings
    
    return {
        "stripe_public_key": settings.STRIPE_PUBLIC_KEY,
        "supported_currencies": ["USD", "EUR", "GBP"],
        "payment_methods": ["card"],
        "test_mode": settings.ENVIRONMENT != "production"
    } 