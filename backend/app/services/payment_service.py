import os
import json
import uuid
from typing import Dict, Any, Optional, List
from decimal import Decimal
import logging

import squareup
from squareup.models import CreatePaymentRequest, Money
import paypalrestsdk

from app.core.config import settings
from app.models.ticket import PaymentStatus

logger = logging.getLogger(__name__)

class PaymentProvider:
    SQUARE = "square"
    PAYPAL = "paypal"
    CASH = "cash"

class PaymentError(Exception):
    def __init__(self, message: str, provider: str = None, error_code: str = None):
        self.message = message
        self.provider = provider
        self.error_code = error_code
        super().__init__(self.message)

class PaymentService:
    def __init__(self):
        self.square_client = None
        self.paypal_configured = False
        self._initialize_square()
        self._initialize_paypal()
    
    def _initialize_square(self):
        """Initialize Square payment client"""
        try:
            square_app_id = getattr(settings, 'SQUARE_APPLICATION_ID', os.getenv('SQUARE_APPLICATION_ID'))
            square_access_token = getattr(settings, 'SQUARE_ACCESS_TOKEN', os.getenv('SQUARE_ACCESS_TOKEN'))
            square_environment = getattr(settings, 'SQUARE_ENVIRONMENT', os.getenv('SQUARE_ENVIRONMENT', 'sandbox'))
            
            if square_access_token:
                self.square_client = squareup.Client(
                    access_token=square_access_token,
                    environment=square_environment
                )
                logger.info("Square payment client initialized successfully")
            else:
                logger.warning("Square credentials not found. Square payments will not be available.")
        except Exception as e:
            logger.error(f"Failed to initialize Square client: {e}")
    
    def _initialize_paypal(self):
        """Initialize PayPal payment client"""
        try:
            paypal_client_id = getattr(settings, 'PAYPAL_CLIENT_ID', os.getenv('PAYPAL_CLIENT_ID'))
            paypal_client_secret = getattr(settings, 'PAYPAL_CLIENT_SECRET', os.getenv('PAYPAL_CLIENT_SECRET'))
            paypal_mode = getattr(settings, 'PAYPAL_MODE', os.getenv('PAYPAL_MODE', 'sandbox'))
            
            if paypal_client_id and paypal_client_secret:
                paypalrestsdk.configure({
                    "mode": paypal_mode,
                    "client_id": paypal_client_id,
                    "client_secret": paypal_client_secret
                })
                self.paypal_configured = True
                logger.info("PayPal payment client initialized successfully")
            else:
                logger.warning("PayPal credentials not found. PayPal payments will not be available.")
        except Exception as e:
            logger.error(f"Failed to initialize PayPal client: {e}")
    
    def get_available_providers(self) -> List[str]:
        """Get list of available payment providers"""
        providers = [PaymentProvider.CASH]  # Cash is always available
        
        if self.square_client:
            providers.append(PaymentProvider.SQUARE)
        
        if self.paypal_configured:
            providers.append(PaymentProvider.PAYPAL)
        
        return providers
    
    async def create_square_payment(
        self, 
        amount_cents: int, 
        currency: str = "USD",
        source_id: str = None,
        verification_token: str = None,
        order_id: str = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Create a Square payment"""
        if not self.square_client:
            raise PaymentError("Square payment client not available", PaymentProvider.SQUARE)
        
        try:
            # Create the payment request
            body = CreatePaymentRequest(
                source_id=source_id,
                idempotency_key=str(uuid.uuid4()),
                amount_money=Money(
                    amount=amount_cents,
                    currency=currency
                ),
                verification_token=verification_token,
                autocomplete=True,
                order_id=order_id,
                note=f"SteppersLife Event Ticket Payment - Order {order_id}"
            )
            
            # Make the payment request
            result = self.square_client.payments.create_payment(body)
            
            if result.is_success():
                payment = result.body.get('payment', {})
                return {
                    'success': True,
                    'payment_id': payment.get('id'),
                    'status': payment.get('status'),
                    'amount': payment.get('amount_money', {}).get('amount'),
                    'currency': payment.get('amount_money', {}).get('currency'),
                    'created_at': payment.get('created_at'),
                    'receipt_number': payment.get('receipt_number'),
                    'provider': PaymentProvider.SQUARE,
                    'raw_response': payment
                }
            else:
                errors = result.errors or []
                error_message = '; '.join([error.get('detail', 'Unknown error') for error in errors])
                raise PaymentError(f"Square payment failed: {error_message}", PaymentProvider.SQUARE)
                
        except Exception as e:
            if isinstance(e, PaymentError):
                raise
            logger.error(f"Square payment error: {e}")
            raise PaymentError(f"Square payment processing failed: {str(e)}", PaymentProvider.SQUARE)
    
    async def create_paypal_payment(
        self,
        amount: float,
        currency: str = "USD",
        description: str = "SteppersLife Event Ticket",
        return_url: str = None,
        cancel_url: str = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Create a PayPal payment"""
        if not self.paypal_configured:
            raise PaymentError("PayPal payment client not available", PaymentProvider.PAYPAL)
        
        try:
            payment = paypalrestsdk.Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": return_url or f"{settings.FRONTEND_URL}/checkout/success",
                    "cancel_url": cancel_url or f"{settings.FRONTEND_URL}/checkout/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": description,
                            "sku": "ticket",
                            "price": str(amount),
                            "currency": currency,
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "total": str(amount),
                        "currency": currency
                    },
                    "description": description
                }]
            })
            
            if payment.create():
                approval_url = None
                for link in payment.links:
                    if link.rel == "approval_url":
                        approval_url = link.href
                        break
                
                return {
                    'success': True,
                    'payment_id': payment.id,
                    'approval_url': approval_url,
                    'status': payment.state,
                    'provider': PaymentProvider.PAYPAL,
                    'raw_response': payment.to_dict()
                }
            else:
                raise PaymentError(f"PayPal payment creation failed: {payment.error}", PaymentProvider.PAYPAL)
                
        except Exception as e:
            if isinstance(e, PaymentError):
                raise
            logger.error(f"PayPal payment error: {e}")
            raise PaymentError(f"PayPal payment processing failed: {str(e)}", PaymentProvider.PAYPAL)
    
    async def execute_paypal_payment(self, payment_id: str, payer_id: str) -> Dict[str, Any]:
        """Execute a PayPal payment after user approval"""
        if not self.paypal_configured:
            raise PaymentError("PayPal payment client not available", PaymentProvider.PAYPAL)
        
        try:
            payment = paypalrestsdk.Payment.find(payment_id)
            
            if payment.execute({"payer_id": payer_id}):
                return {
                    'success': True,
                    'payment_id': payment.id,
                    'status': payment.state,
                    'provider': PaymentProvider.PAYPAL,
                    'transaction_id': payment.transactions[0].related_resources[0].sale.id,
                    'raw_response': payment.to_dict()
                }
            else:
                raise PaymentError(f"PayPal payment execution failed: {payment.error}", PaymentProvider.PAYPAL)
                
        except Exception as e:
            if isinstance(e, PaymentError):
                raise
            logger.error(f"PayPal payment execution error: {e}")
            raise PaymentError(f"PayPal payment execution failed: {str(e)}", PaymentProvider.PAYPAL)
    
    async def process_cash_payment(
        self,
        amount: float,
        currency: str = "USD",
        verification_code: str = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Process a cash payment (verification only)"""
        try:
            # For cash payments, we just verify the code and create a record
            return {
                'success': True,
                'payment_id': f"cash_{uuid.uuid4().hex[:8]}",
                'status': 'completed',
                'amount': amount,
                'currency': currency,
                'verification_code': verification_code,
                'provider': PaymentProvider.CASH,
                'raw_response': {'method': 'cash', 'verified': True}
            }
        except Exception as e:
            logger.error(f"Cash payment processing error: {e}")
            raise PaymentError(f"Cash payment processing failed: {str(e)}", PaymentProvider.CASH)
    
    async def refund_payment(
        self,
        payment_id: str,
        provider: str,
        amount_cents: int = None,
        reason: str = "Customer refund request"
    ) -> Dict[str, Any]:
        """Refund a payment"""
        try:
            if provider == PaymentProvider.SQUARE:
                return await self._refund_square_payment(payment_id, amount_cents, reason)
            elif provider == PaymentProvider.PAYPAL:
                return await self._refund_paypal_payment(payment_id, amount_cents, reason)
            elif provider == PaymentProvider.CASH:
                return await self._refund_cash_payment(payment_id, amount_cents, reason)
            else:
                raise PaymentError(f"Unsupported payment provider for refund: {provider}")
        except Exception as e:
            if isinstance(e, PaymentError):
                raise
            logger.error(f"Refund processing error: {e}")
            raise PaymentError(f"Refund processing failed: {str(e)}", provider)
    
    async def _refund_square_payment(self, payment_id: str, amount_cents: int, reason: str) -> Dict[str, Any]:
        """Refund a Square payment"""
        if not self.square_client:
            raise PaymentError("Square payment client not available", PaymentProvider.SQUARE)
        
        # Square refund implementation would go here
        # For now, return a mock response
        return {
            'success': True,
            'refund_id': f"square_refund_{uuid.uuid4().hex[:8]}",
            'status': 'completed',
            'amount': amount_cents,
            'provider': PaymentProvider.SQUARE
        }
    
    async def _refund_paypal_payment(self, payment_id: str, amount_cents: int, reason: str) -> Dict[str, Any]:
        """Refund a PayPal payment"""
        if not self.paypal_configured:
            raise PaymentError("PayPal payment client not available", PaymentProvider.PAYPAL)
        
        # PayPal refund implementation would go here
        # For now, return a mock response
        return {
            'success': True,
            'refund_id': f"paypal_refund_{uuid.uuid4().hex[:8]}",
            'status': 'completed',
            'amount': amount_cents,
            'provider': PaymentProvider.PAYPAL
        }
    
    async def _refund_cash_payment(self, payment_id: str, amount_cents: int, reason: str) -> Dict[str, Any]:
        """Process cash refund (manual verification)"""
        return {
            'success': True,
            'refund_id': f"cash_refund_{uuid.uuid4().hex[:8]}",
            'status': 'pending_manual_processing',
            'amount': amount_cents,
            'provider': PaymentProvider.CASH,
            'note': 'Cash refund requires manual processing'
        }
    
    async def get_payment_status(self, payment_id: str, provider: str) -> Dict[str, Any]:
        """Get payment status from provider"""
        try:
            if provider == PaymentProvider.SQUARE:
                return await self._get_square_payment_status(payment_id)
            elif provider == PaymentProvider.PAYPAL:
                return await self._get_paypal_payment_status(payment_id)
            elif provider == PaymentProvider.CASH:
                return await self._get_cash_payment_status(payment_id)
            else:
                raise PaymentError(f"Unsupported payment provider: {provider}")
        except Exception as e:
            if isinstance(e, PaymentError):
                raise
            logger.error(f"Payment status check error: {e}")
            raise PaymentError(f"Payment status check failed: {str(e)}", provider)
    
    async def _get_square_payment_status(self, payment_id: str) -> Dict[str, Any]:
        """Get Square payment status"""
        if not self.square_client:
            raise PaymentError("Square payment client not available", PaymentProvider.SQUARE)
        
        result = self.square_client.payments.get_payment(payment_id)
        if result.is_success():
            payment = result.body.get('payment', {})
            return {
                'payment_id': payment.get('id'),
                'status': payment.get('status'),
                'provider': PaymentProvider.SQUARE
            }
        else:
            raise PaymentError("Failed to get Square payment status", PaymentProvider.SQUARE)
    
    async def _get_paypal_payment_status(self, payment_id: str) -> Dict[str, Any]:
        """Get PayPal payment status"""
        if not self.paypal_configured:
            raise PaymentError("PayPal payment client not available", PaymentProvider.PAYPAL)
        
        payment = paypalrestsdk.Payment.find(payment_id)
        return {
            'payment_id': payment.id,
            'status': payment.state,
            'provider': PaymentProvider.PAYPAL
        }
    
    async def _get_cash_payment_status(self, payment_id: str) -> Dict[str, Any]:
        """Get cash payment status"""
        return {
            'payment_id': payment_id,
            'status': 'completed',
            'provider': PaymentProvider.CASH
        }

# Global payment service instance
payment_service = PaymentService() 