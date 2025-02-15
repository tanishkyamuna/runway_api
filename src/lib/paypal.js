import { loadScript } from "@paypal/paypal-js";
import { supabase } from './supabase';
import toast from 'react-hot-toast';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

class PayPalService {
  constructor() {
    this.paypal = null;
    this.scriptPromise = null;
  }

  async init() {
    try {
      if (!PAYPAL_CLIENT_ID) {
        throw new Error('PayPal Client ID is not configured');
      }

      if (this.paypal?.Buttons) {
        return this.paypal;
      }

      if (!this.scriptPromise) {
        this.scriptPromise = loadScript({
          "client-id": PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "capture",
          "disable-funding": "credit,card",
          "enable-funding": "paypal",
          "data-namespace": "paypal_sdk",
        }).catch(err => {
          this.scriptPromise = null;
          throw err;
        });
      }

      this.paypal = await this.scriptPromise;

      if (!this.paypal?.Buttons) {
        throw new Error('PayPal SDK failed to load correctly');
      }

      return this.paypal;
    } catch (error) {
      this.paypal = null;
      this.scriptPromise = null;
      console.error("Failed to initialize PayPal:", error);
      throw error;
    }
  }

  async createOrder(packageData) {
    if (!packageData?.id || !packageData?.price || !packageData?.credits) {
      throw new Error('Invalid package data');
    }

    try {
      const paypal = await this.init();

      const buttons = paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay'
        },
        
        createOrder: async (data, actions) => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              toast.error('Please log in to make a purchase');
              throw new Error('User not authenticated');
            }

            return actions.order.create({
              purchase_units: [{
                description: `${packageData.name} - ${packageData.credits} Video Credits`,
                amount: {
                  currency_code: "USD",
                  value: packageData.price.toString()
                }
              }],
              application_context: {
                shipping_preference: 'NO_SHIPPING'
              }
            });
          } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to create order');
            throw error;
          }
        },

        onApprove: async (data, actions) => {
          try {
            const order = await actions.order.capture();
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              throw new Error('User not authenticated');
            }

            // Add credits to user account
            const { error: creditsError } = await supabase.rpc('add_video_credits', {
              user_id: user.id,
              credits_to_add: packageData.credits
            });

            if (creditsError) throw creditsError;

            // Record purchase
            const { error: purchaseError } = await supabase
              .from('payment_transactions')
              .insert({
                user_id: user.id,
                package_id: packageData.id,
                amount: packageData.price,
                currency: 'USD',
                status: 'completed',
                provider: 'paypal',
                payment_id: order.id,
                metadata: {
                  order_id: order.id,
                  credits: packageData.credits,
                  package_name: packageData.name
                }
              });

            if (purchaseError) throw purchaseError;

            toast.success('Payment successful! Credits added to your account.');
            window.location.href = '/dashboard';
            return order;
          } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Failed to process payment');
            throw error;
          }
        },

        onCancel: () => {
          toast.error('Payment cancelled');
        },

        onError: (err) => {
          console.error('PayPal error:', err);
          toast.error('Payment failed. Please try again.');
        }
      });

      if (!buttons.isEligible()) {
        throw new Error('PayPal Buttons are not eligible');
      }

      return buttons;
    } catch (error) {
      console.error("PayPal payment error:", error);
      throw error;
    }
  }
}

export const paypalService = new PayPalService();