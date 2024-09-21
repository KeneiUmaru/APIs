const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Make sure to install node-fetch

const app = express();
const PORT = process.env.PORT || 3000;


const PAYPAL_CLIENT_ID = 'AcBstylFgnC0aUlze8pLqJTfO1wYXAdr3GKj93KC8kXdyyexcJ-GBg1aAF5a9S0qom8H1nSqt_6ki9yu';
const PAYPAL_SECRET = 'EI_hngfItyT4Vbf8ybPrTuDSX5vat7qYFlq979eFP6fpVmEZTrtMnl58pmPTBjr-rzB44RLvZVeLjyxm';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Use live API in production

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const event = req.body;

    // Handle the event
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const paymentDetails = event.resource;
        const orderId = paymentDetails.id;
        const amount = paymentDetails.amount.value;
        const currency = paymentDetails.amount.currency_code;

        // Verify the payment
        const isVerified = await verifyPayment(orderId);
        if (isVerified) {
            console.log(`Payment verified: ${orderId} for ${amount} ${currency}`);
            await updatePaymentStatus(orderId, 'COMPLETED', amount, currency);
            return res.status(200).json({
                status: 'success',
                message: `Payment verified: ${orderId}`,
                details: {
                    amount,
                    currency
                }
            });
        } else {
            console.error(`Payment verification failed for order: ${orderId}`);
            await updatePaymentStatus(orderId, 'FAILED', amount, currency);
            return res.status(400).json({
                status: 'error',
                message: `Payment verification failed for order: ${orderId}`
            });
        }
    }

    // For other event types
    return res.status(400).json({
        status: 'error',
        message: 'Unhandled event type'
    });
});

// Function to verify payment
async function verifyPayment(orderId) {
    try {
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await getAccessToken()}`,
                'Content-Type': 'application/json'
            }
        });

        const orderDetails = await response.json();
        return orderDetails.status === 'COMPLETED';
    } catch (error) {
        console.error('Error verifying payment:', error);
        return false;
    }
}

// Function to get access token
async function getAccessToken() {
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || 'Failed to get access token');
    return data.access_token;
}

// Function to update payment status in your database
async function updatePaymentStatus(orderId, status, amount, currency) {
    console.log(`Updating payment ${orderId} to status: ${status}`);
    // Implement your logic to update the payment status in your database
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
