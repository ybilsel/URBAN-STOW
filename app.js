const stripe = Stripe('your-public-key');  // Replace with your actual Stripe public key
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element');

// Store cart items
let cart = [];

// Handle Add to Cart
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const item = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
    };
    cart.push(item);
    updateCartDisplay();
  });
});

// Update cart display
function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    cartItems.appendChild(li);
    total += item.price;
  });
  document.getElementById('total').textContent = total.toFixed(2);
}

// Handle Checkout
const checkoutButton = document.getElementById('checkout-button');
checkoutButton.addEventListener('click', () => {
  // Show payment form
  document.getElementById('payment-form').style.display = 'block';
});

// Handle Payment
const paymentForm = document.getElementById('payment-form');
paymentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Create a PaymentIntent on the server (see step 4)
  const response = await fetch('/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cart }),
  });
  const { clientSecret } = await response.json();

  // Confirm the payment on the client side
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
    },
  });

  if (error) {
    alert('Payment failed: ' + error.message);
  } else if (paymentIntent.status === 'succeeded') {
    alert('Payment successful!');
    cart = [];
    updateCartDisplay();
    document.getElementById('payment-form').style.display = 'none';
  }
});
