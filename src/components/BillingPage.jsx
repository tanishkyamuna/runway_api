import React from 'react';
import { CreditCard, AlertCircle, Download, Plus, Clock, CheckCircle } from 'lucide-react';

const BillingPage = () => {
  // Mock data - would come from your backend
  const subscriptionData = {
    plan: "Professional",
    status: "active",
    nextBilling: "2025-02-20",
    amount: 199,
    creditsLeft: 23,
    paymentMethod: {
      type: "Credit Card",
      last4: "4242",
      expiry: "12/25"
    }
  };

  const billingHistory = [
    {
      id: 1,
      date: "2025-01-20",
      description: "Professional Plan - Monthly",
      amount: 199,
      status: "paid",
      invoice: "INV-2025-001"
    },
    {
      id: 2,
      date: "2024-12-20",
      description: "Professional Plan - Monthly",
      amount: 199,
      status: "paid",
      invoice: "INV-2024-012"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

        {/* Current Plan */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-2">Current Plan: {subscriptionData.plan}</h2>
                <p className="text-gray-600">Next billing date: {subscriptionData.nextBilling}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Active
              </span>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Monthly Price</div>
              <div className="text-2xl font-bold">${subscriptionData.amount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Credits Remaining</div>
              <div className="text-2xl font-bold">{subscriptionData.creditsLeft}</div>
            </div>
            <div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Payment Method</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="font-medium">
                    {subscriptionData.paymentMethod.type} ending in {subscriptionData.paymentMethod.last4}
                  </div>
                  <div className="text-sm text-gray-500">
                    Expires {subscriptionData.paymentMethod.expiry}
                  </div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Credit Usage */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Credit Usage</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Credits Used This Month</span>
                  <span className="font-medium">27</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '54%' }}></div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                View Detailed Usage
              </button>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Billing History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Description</th>
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-4">{item.date}</td>
                      <td className="py-4">{item.description}</td>
                      <td className="py-4">${item.amount}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-blue-600" />
            <div>
              <h3 className="font-bold">Need help with billing?</h3>
              <p className="text-gray-600">Our support team is available 24/7 to assist you.</p>
            </div>
            <button className="ml-auto text-blue-600 hover:text-blue-700">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;