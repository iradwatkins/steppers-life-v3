from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from uuid import UUID
from pydantic import BaseModel
import logging

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.ticket import Ticket, PaymentStatus, TicketStatus
from app.models.user import User
from app.services.payment_service import payment_service, PaymentProvider, PaymentError

router = APIRouter()
logger = logging.getLogger(__name__)

class PaymentRequest(BaseModel):
    provider: str  # square, paypal, cash
    source_id: Optional[str] = None  # Square payment token
    verification_token: Optional[str] = None  # Square CVV verification
    verification_code: Optional[str] = None  # Cash payment verification code
    return_url: Optional[str] = None  # PayPal return URL
    cancel_url: Optional[str] = None  # PayPal cancel URL

class PaymentConfirmation(BaseModel):
    payment_id: str
    provider: str
    payer_id: Optional[str] = None  # PayPal payer ID

@router.get("/providers")
def get_payment_providers(
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get available payment providers."""
    
    providers = payment_service.get_available_providers()
    
    return {
        "providers": providers,
        "details": {
            PaymentProvider.SQUARE: {
                "name": "Square / Cash App",
                "description": "Pay with credit/debit card or Cash App",
                "supports_cards": True,
                "supports_digital_wallets": True
            },
            PaymentProvider.PAYPAL: {
                "name": "PayPal",
                "description": "Pay with your PayPal account",
                "supports_cards": False,
                "supports_digital_wallets": True
            },
            PaymentProvider.CASH: {
                "name": "Cash Payment",
                "description": "Pay with cash at the event location",
                "supports_cards": False,
                "supports_digital_wallets": False
            }
        }
    }

@router.post("/create-payment/{ticket_id}")
async def create_payment(
    ticket_id: UUID,
    payment_request: PaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Create a payment for a ticket."""
    
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
        # Convert price to cents for Square
        amount_cents = int(ticket.total_price * 100)
        
        # Process payment based on provider
        if payment_request.provider == PaymentProvider.SQUARE:
            payment_result = await payment_service.create_square_payment(
                amount_cents=amount_cents,
                currency=ticket.currency,
                source_id=payment_request.source_id,
                verification_token=payment_request.verification_token,
                order_id=str(ticket.id)
            )
            
        elif payment_request.provider == PaymentProvider.PAYPAL:
            payment_result = await payment_service.create_paypal_payment(
                amount=ticket.total_price,
                currency=ticket.currency,
                description=f"SteppersLife Event Ticket - {ticket.ticket_number}",
                return_url=payment_request.return_url,
                cancel_url=payment_request.cancel_url
            )
            
        elif payment_request.provider == PaymentProvider.CASH:
            payment_result = await payment_service.process_cash_payment(
                amount=ticket.total_price,
                currency=ticket.currency,
                verification_code=payment_request.verification_code
            )
            
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported payment provider: {payment_request.provider}"
            )
        
        # Store payment information in ticket
        ticket.payment_intent_id = payment_result['payment_id']
        ticket.payment_method = payment_request.provider
        
        # For Square and Cash payments, mark as completed immediately
        # For PayPal, wait for user to complete the flow
        if payment_request.provider in [PaymentProvider.SQUARE, PaymentProvider.CASH]:
            if payment_result.get('status') in ['COMPLETED', 'completed']:
                ticket.payment_status = PaymentStatus.COMPLETED
                ticket.status = TicketStatus.CONFIRMED
        
        db.commit()
        
        response = {
            "success": payment_result['success'],
            "payment_id": payment_result['payment_id'],
            "provider": payment_result['provider'],
            "status": payment_result.get('status'),
            "amount": ticket.total_price,
            "currency": ticket.currency
        }
        
        # Add provider-specific data
        if payment_request.provider == PaymentProvider.PAYPAL:
            response["approval_url"] = payment_result.get('approval_url')
        elif payment_request.provider == PaymentProvider.SQUARE:
            response["receipt_number"] = payment_result.get('receipt_number')
        elif payment_request.provider == PaymentProvider.CASH:
            response["verification_code"] = payment_result.get('verification_code')
        
        return response
        
    except PaymentError as e:
        logger.error(f"Payment creation failed: {e.message}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment processing failed: {e.message}"
        )
    except Exception as e:
        logger.error(f"Payment creation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create payment"
        )

@router.post("/confirm-payment/{ticket_id}")
async def confirm_payment(
    ticket_id: UUID,
    payment_confirmation: PaymentConfirmation,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Confirm payment for a ticket (mainly for PayPal)."""
    
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
        # Execute payment based on provider
        if payment_confirmation.provider == PaymentProvider.PAYPAL:
            if not payment_confirmation.payer_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="PayPal payer ID is required"
                )
            
            payment_result = await payment_service.execute_paypal_payment(
                payment_id=payment_confirmation.payment_id,
                payer_id=payment_confirmation.payer_id
            )
            
            if payment_result['success'] and payment_result.get('status') in ['approved', 'completed']:
                ticket.payment_status = PaymentStatus.COMPLETED
                ticket.status = TicketStatus.CONFIRMED
                db.commit()
                
                return {
                    "status": "success",
                    "message": "Payment confirmed successfully",
                    "ticket_id": str(ticket.id),
                    "payment_id": payment_result['payment_id'],
                    "transaction_id": payment_result.get('transaction_id')
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Payment execution failed"
                )
        
        else:
            # For Square and Cash, payment should already be confirmed
            return {
                "status": "success",
                "message": "Payment already confirmed",
                "ticket_id": str(ticket.id),
                "payment_id": payment_confirmation.payment_id
            }
            
    except PaymentError as e:
        logger.error(f"Payment confirmation failed: {e.message}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment confirmation failed: {e.message}"
        )
    except Exception as e:
        logger.error(f"Payment confirmation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to confirm payment"
        )

@router.post("/refund/{ticket_id}")
async def create_refund(
    ticket_id: UUID,
    refund_amount: Optional[float] = None,
    reason: str = "Customer refund request",
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
            detail="No payment ID found for this ticket"
        )
    
    try:
        # Calculate refund amount in cents
        refund_amount_to_process = refund_amount or ticket.total_price
        refund_amount_cents = int(refund_amount_to_process * 100)
        
        # Create refund
        refund_result = await payment_service.refund_payment(
            payment_id=ticket.payment_intent_id,
            provider=ticket.payment_method,
            amount_cents=refund_amount_cents,
            reason=reason
        )
        
        if refund_result['success']:
            # Update ticket status
            ticket.payment_status = PaymentStatus.REFUNDED
            ticket.status = TicketStatus.REFUNDED
            
            db.commit()
            
            return {
                "status": "success",
                "message": "Refund processed successfully",
                "refund_id": refund_result['refund_id'],
                "amount": refund_amount_to_process,
                "currency": ticket.currency,
                "provider": refund_result['provider']
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Refund processing failed"
            )
            
    except PaymentError as e:
        logger.error(f"Refund creation failed: {e.message}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Refund processing failed: {e.message}"
        )
    except Exception as e:
        logger.error(f"Refund creation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process refund"
        )

@router.get("/status/{ticket_id}")
async def get_payment_status(
    ticket_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get payment status for a ticket."""
    
    # Get the ticket
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Check if user owns the ticket or is admin
    if ticket.user_id != current_user.id and current_user.role.value not in ["admin", "moderator"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view payment status for this ticket"
        )
    
    try:
        if ticket.payment_intent_id and ticket.payment_method:
            # Get status from payment provider
            status_result = await payment_service.get_payment_status(
                payment_id=ticket.payment_intent_id,
                provider=ticket.payment_method
            )
            
            return {
                "ticket_id": str(ticket.id),
                "payment_status": ticket.payment_status.value,
                "ticket_status": ticket.status.value,
                "provider_status": status_result.get('status'),
                "provider": status_result.get('provider'),
                "payment_id": status_result.get('payment_id'),
                "amount": ticket.total_price,
                "currency": ticket.currency
            }
        else:
            return {
                "ticket_id": str(ticket.id),
                "payment_status": ticket.payment_status.value,
                "ticket_status": ticket.status.value,
                "amount": ticket.total_price,
                "currency": ticket.currency
            }
            
    except Exception as e:
        logger.error(f"Payment status check failed: {str(e)}")
        return {
            "ticket_id": str(ticket.id),
            "payment_status": ticket.payment_status.value,
            "ticket_status": ticket.status.value,
            "amount": ticket.total_price,
            "currency": ticket.currency,
            "error": "Could not retrieve provider status"
        }

@router.get("/config")
def get_payment_config(
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get payment configuration for the frontend."""
    
    from app.core.config import settings
    
    # Get available payment providers
    providers = payment_service.get_available_providers()
    
    config = {
        "available_providers": providers,
        "supported_currencies": ["USD"],
        "test_mode": getattr(settings, 'ENVIRONMENT', 'development') != "production",
        "provider_config": {}
    }
    
    # Add provider-specific configuration
    if PaymentProvider.SQUARE in providers:
        config["provider_config"]["square"] = {
            "app_id": getattr(settings, 'SQUARE_APPLICATION_ID', None),
            "environment": getattr(settings, 'SQUARE_ENVIRONMENT', 'sandbox')
        }
    
    if PaymentProvider.PAYPAL in providers:
        config["provider_config"]["paypal"] = {
            "client_id": getattr(settings, 'PAYPAL_CLIENT_ID', None),
            "environment": getattr(settings, 'PAYPAL_MODE', 'sandbox')
        }
    
    return config 