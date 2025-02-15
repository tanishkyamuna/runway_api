import toast from 'react-hot-toast';

class ICountService {
  constructor() {
    this.apiKey = import.meta.env.VITE_ICOUNT_API_KEY;
    this.companyId = import.meta.env.VITE_ICOUNT_COMPANY_ID;
    this.apiUrl = 'https://api.icount.co.il/api/v3.php';
  }

  async createPaymentLink(amount, description, customerEmail) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid: this.companyId,
          user: this.apiKey,
          cmd: 'PaymentLink',
          amount,
          currency: 'ILS',
          description,
          email: customerEmail,
          success_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
          installments: 1, // אפשר לשנות ל-true כדי לאפשר תשלומים
          language: 'he'
        })
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to create payment link');
      }

      return data.data.url;
    } catch (error) {
      console.error('iCount payment error:', error);
      toast.error('שגיאה ביצירת קישור לתשלום');
      throw error;
    }
  }

  async verifyPayment(token) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid: this.companyId,
          user: this.apiKey,
          cmd: 'ValidatePayment',
          token
        })
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to verify payment');
      }

      return data.data;
    } catch (error) {
      console.error('iCount verification error:', error);
      toast.error('שגיאה באימות התשלום');
      throw error;
    }
  }
}

export const icountService = new ICountService();