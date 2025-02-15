import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { icountService } from '../lib/icount';
import { CreditCard, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const IsraeliPayment = ({ packageData, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('יש להתחבר כדי לבצע רכישה');
        navigate('/login');
        return;
      }

      // יצירת קישור תשלום ב-iCount
      const paymentUrl = await icountService.createPaymentLink(
        packageData.priceILS, // מחיר בשקלים
        `חבילת ${packageData.name} - ${packageData.credits} קרדיטים`,
        email || user.email
      );

      // שמירת פרטי העסקה בסופאבייס
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: user.id,
          package_id: packageData.id,
          amount: packageData.priceILS,
          currency: 'ILS',
          status: 'pending',
          provider: 'icount'
        });

      if (transactionError) throw transactionError;

      // מעבר לדף התשלום
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('שגיאה בעיבוד התשלום');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">תשלום בשקלים</h2>
          <p className="text-gray-600">חבילת {packageData.name}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <AlertCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>מחיר:</span>
          <span className="font-bold">₪{packageData.priceILS}</span>
        </div>
        <div className="flex justify-between">
          <span>קרדיטים:</span>
          <span className="font-bold">{packageData.credits}</span>
        </div>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            אימייל לקבלת חשבונית
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="your@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          {isLoading ? 'מעבד...' : 'המשך לתשלום'}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-500 flex items-center gap-2">
        <Package className="w-4 h-4" />
        <span>התשלום מאובטח באמצעות iCount</span>
      </div>
    </div>
  );
};

export default IsraeliPayment;