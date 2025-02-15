import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (priceId) => {
  try {
    const stripe = await stripePromise;
    
    // Create checkout session on your backend
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
      }),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createPortalSession = async () => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
    });
    
    const session = await response.json();
    
    // Redirect to customer portal
    window.location.href = session.url;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};