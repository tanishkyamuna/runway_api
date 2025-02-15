import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paypalService } from '../lib/paypal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const PayPalButton = ({ packageData }) => {
  const paypalButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const initializePayPalButton = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('Please log in to make a purchase');
          navigate('/login');
          return;
        }

        if (!paypalButtonRef.current || !mounted) return;

        // Clear any existing buttons
        paypalButtonRef.current.innerHTML = '';

        const buttons = await paypalService.createOrder(packageData);
        
        if (!buttons || !mounted) {
          throw new Error('Failed to create PayPal buttons');
        }

        await buttons.render(paypalButtonRef.current);
      } catch (err) {
        console.error('PayPal initialization error:', err);
        if (mounted) {
          setError(err.message);
          toast.error('Failed to initialize payment system');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializePayPalButton();

    return () => {
      mounted = false;
    };
  }, [packageData, navigate]);

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 text-red-600 rounded-lg text-center">
        Failed to load payment options. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-[40px] bg-gray-100 rounded animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Loading payment options...</span>
      </div>
    );
  }

  return (
    <div 
      ref={paypalButtonRef}
      className="w-full min-h-[40px]"
    />
  );
};

export default PayPalButton;