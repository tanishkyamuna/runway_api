import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const CreditCardForm = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [currentField, setCurrentField] = useState('cardNumber');

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardNumber.replace(/\s/g, '').match(/^[0-9]{16}$/)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!formData.cardName) {
      newErrors.cardName = 'Please enter the cardholder name';
    }

    if (!formData.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!formData.cvv.match(/^[0-9]{3,4}$/)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle submission
      console.log('Form submitted:', formData);
    }
  };

  // Determine which field to show next
  const handleFieldComplete = (currentField) => {
    const fields = ['cardNumber', 'cardName', 'expiry', 'cvv', 'email'];
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      setCurrentField(fields[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Enter Payment Details</h1>
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-sm text-blue-100">
              Your payment information is encrypted and secure
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Card Number Field */}
            <div className={`transition-opacity ${currentField === 'cardNumber' ? 'opacity-100' : 'opacity-50'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  onBlur={() => handleFieldComplete('cardNumber')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                <CreditCard className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              </div>
              {errors.cardNumber && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cardNumber}
                </div>
              )}
            </div>

            {/* Cardholder Name */}
            <div className={`transition-opacity ${currentField === 'cardName' ? 'opacity-100' : 'opacity-50'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                onBlur={() => handleFieldComplete('cardName')}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cardName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Smith"
              />
              {errors.cardName && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cardName}
                </div>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`transition-opacity ${currentField === 'expiry' ? 'opacity-100' : 'opacity-50'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  onBlur={() => handleFieldComplete('expiry')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiry && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.expiry}
                  </div>
                )}
              </div>

              <div className={`transition-opacity ${currentField === 'cvv' ? 'opacity-100' : 'opacity-50'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  onBlur={() => handleFieldComplete('cvv')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvv && (
                  <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.cvv}
                  </div>
                )}
              </div>
            </div>

            {/* Email Receipt */}
            <div className={`transition-opacity ${currentField === 'email' ? 'opacity-100' : 'opacity-50'}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email for Receipt
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              Complete Payment
            </button>
          </form>

          {/* Security Notice */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;