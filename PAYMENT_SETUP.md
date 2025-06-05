# Payment Integration Setup Guide

## 🚀 **SteppersLife Payment Integration**

This guide covers setting up Square, PayPal, and Cash payment options for the SteppersLife platform.

## 📋 **Available Payment Methods**

### 1. **Square / Cash App**
- **Features**: Credit/debit cards, Cash App, Apple Pay, Google Pay
- **Processing**: Instant
- **Fees**: 2.9% + 30¢ per transaction

### 2. **PayPal**  
- **Features**: PayPal balance, bank accounts, cards via PayPal
- **Processing**: Instant
- **Fees**: 2.9% + fixed fee

### 3. **Cash Payment**
- **Features**: Event location pickup
- **Processing**: At event check-in
- **Fees**: No processing fees

## 🔧 **Environment Configuration**

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Square Payment Settings
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_APPLICATION_ID=your_square_application_id_here
SQUARE_ENVIRONMENT=sandbox  # or "production" for live

# PayPal Payment Settings  
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
PAYPAL_MODE=sandbox  # or "live" for production

# Frontend URL for redirects
FRONTEND_URL=http://localhost:8082
```

## 🏪 **Square Setup**

1. **Create Square Developer Account**
   - Visit: https://developer.squareup.com/
   - Create a new application

2. **Get Credentials**
   - **Sandbox**: Use sandbox credentials for testing
   - **Production**: Use production credentials for live payments

3. **Configure Webhook** (Optional)
   - Set up webhooks for payment status updates
   - URL: `https://your-domain.com/api/v1/payments/webhook`

## 💰 **PayPal Setup**

1. **Create PayPal Developer Account**
   - Visit: https://developer.paypal.com/
   - Create a new application

2. **Get Credentials**
   - **Sandbox**: Use sandbox credentials for testing
   - **Live**: Use live credentials for production

3. **Configure Return URLs**
   - Return URL: `https://your-domain.com/checkout/paypal-return`
   - Cancel URL: `https://your-domain.com/checkout/paypal-cancel`

## 🧪 **Testing**

### **Square Testing Cards**
```
Card Number: 4111 1111 1111 1111
CVV: 111
Expiry: Any future date
```

### **PayPal Testing**
- Use PayPal sandbox accounts
- Test buyer account: sb-buyer@business.example.com
- Test password: test1234

## 🚀 **Deployment**

### **Production Settings**
1. **Update Environment Variables**
   - Change `SQUARE_ENVIRONMENT=production`
   - Change `PAYPAL_MODE=live` 
   - Update `FRONTEND_URL` to your production domain

2. **SSL Required**
   - Both Square and PayPal require HTTPS in production
   - Ensure your domain has a valid SSL certificate

3. **Webhook Security**
   - Implement webhook signature verification
   - Use environment variables for webhook secrets

## 📱 **Frontend Integration**

The payment system is automatically available in the checkout flow:

1. **Payment Provider Selection**: Users can choose their preferred payment method
2. **Square Integration**: Uses Square Web Payments SDK for card processing
3. **PayPal Integration**: Redirects to PayPal for authorization
4. **Cash Payments**: Generates verification codes for event pickup

## 🛠️ **Development**

### **Start Backend**
```bash
cd backend
source venv/bin/activate
python3 -m uvicorn main:app --reload --port 8000
```

### **Start Frontend**
```bash
npm run dev
```

### **Test Payments**
1. Go to `http://localhost:8082`
2. Create an event and purchase tickets
3. Test different payment methods

## 🔒 **Security Notes**

- Never commit `.env` files to version control
- Use different credentials for development/staging/production
- Implement proper error handling and logging
- Validate all payment amounts server-side
- Use HTTPS in production

## 📞 **Support**

For payment integration issues:
- **Square**: https://developer.squareup.com/docs
- **PayPal**: https://developer.paypal.com/docs
- **SteppersLife**: Contact your development team

---

**Status**: ✅ Payment integration complete and ready for testing! 