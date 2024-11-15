const express = require('express');
const stripe = require('stripe')('your-secret-key'); // Replace with your actual Stripe secret key
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (like index.html, css, js)

app.post('/create-payment-intent', async (req, res) => {
  const cart = req.body.cart;
  let totalAmount = 0;

  cart.forEach(item => {
    totalAmount += item.price * 100; // Stripe works in cents
  });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
