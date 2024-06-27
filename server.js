const express = require('express');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();
app.use(bodyParser.json());

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://ele-max-delivery-default-rtdb.firebaseio.com"
});

app.post('/create-payment-session', async (req, res) => {
    const { userId, paymentMethod } = req.body;

    try {
        const userRef = admin.database().ref(`users/${userId}`);
        const userSnapshot = await userRef.once('value');
        const user = userSnapshot.val();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (paymentMethod === 'stripe') {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Sample Product',
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'https://yourdomain.com/success',
                cancel_url: 'https://yourdomain.com/cancel',
                customer_email: user.email,
            });
            res.json({ sessionId: session.id });
        } else if (paymentMethod === 'paypal') {
            // Implement PayPal transaction creation logic
            // Refer to PayPal SDK documentation for server-side integration
        } else {
            res.status(400).json({ error: 'Invalid payment method' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
