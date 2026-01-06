'use client';

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentGateway from './PaymentGateway'; 


const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface WrapperProps {
  planId: string;
  planName: string;
  price: number;
}

export default function PaymentWrapper({ planId, planName, price }: WrapperProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!stripeKey) {
      setError('Error: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing in .env file');
      return;
    }

    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError('Failed to initiate payment.');
        }
      })
      .catch((err) => setError('Network error initializing payment.'));
  }, [planId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-red-400 bg-red-900/20 border border-red-500/50 p-6 rounded-lg text-center">
          <p className="font-mono font-bold text-lg mb-2">Configuration Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-white h-[50vh]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p>Loading secure checkout...</p>
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret,
      }}
    >
      <PaymentGateway 
          price={price} 
          planName={planName} 
          clientSecret={clientSecret} 
      />
    </Elements>
  );
}