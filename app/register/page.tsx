'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Register User
      await axios.post('/api/register', formData);

      // 2. Auto-Login
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // 3. Redirect to Stripe Checkout with Selected Plan
      const { data } = await axios.post('/api/checkout', { plan: selectedPlan });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-2xl space-y-8 bg-white p-8 shadow-xl rounded-2xl border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Start your 7-day free trial
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Choose the plan that works best for you.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Plan Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div 
              onClick={() => setSelectedPlan('monthly')}
              className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center text-center transition-all ${
                selectedPlan === 'monthly' 
                  ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50' 
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <h3 className="font-bold text-slate-900">Monthly</h3>
              <p className="text-sm text-slate-500 mt-1">$20/mo</p>
            </div>

            <div 
              onClick={() => setSelectedPlan('six_month')}
              className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center text-center transition-all ${
                selectedPlan === 'six_month' 
                  ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50' 
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <h3 className="font-bold text-slate-900">6 Months</h3>
              <p className="text-sm text-slate-500 mt-1">$100/6mo</p>
              <span className="text-xs text-green-600 font-medium mt-1">Save 17%</span>
            </div>

            <div 
              onClick={() => setSelectedPlan('yearly')}
              className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center text-center transition-all ${
                selectedPlan === 'yearly' 
                  ? 'border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50' 
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <h3 className="font-bold text-slate-900">Yearly</h3>
              <p className="text-sm text-slate-500 mt-1">$180/yr</p>
              <span className="text-xs text-green-600 font-medium mt-1">Save 25%</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading 
                ? 'Processing...' 
                : `Proceed to Payment (${selectedPlan === 'monthly' ? 'Monthly' : selectedPlan === 'six_month' ? '6 Months' : 'Yearly'})`
              }
            </button>
          </div>
          
          <div className="text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
