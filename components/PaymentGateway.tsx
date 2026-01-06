'use client';
import React, { useState } from 'react';
import { Edit2, Eye, EyeOff, CreditCard, Receipt, Lock, AlertCircle } from 'lucide-react';
import { 
  useStripe, 
  useElements, 
  CardNumberElement, 
  CardCvcElement, 
  CardExpiryElement 
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

const stripeInputOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff', 
      fontFamily: 'monospace', 
      '::placeholder': {
        color: 'rgba(255, 255, 255, 0.3)', 
      },
      iconColor: '#ffffff',
    },
    invalid: {
      color: '#ef4444',
    },
  },
};

interface PaymentGatewayProps {
  planName: string;
  price: number;
  clientSecret: string; 
}

export default function PaymentGateway({ planName, price, clientSecret }: PaymentGatewayProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handlePay = async () => {
        if (!stripe || !elements) return;
        
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const verifyRes = await fetch('/api/auth/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (!verifyRes.ok) {
                throw new Error("Incorrect password. Please try again.");
            }

            const cardElement = elements.getElement(CardNumberElement);
            if (!cardElement) throw new Error("Card details not found");

            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                    },
                },
            });

            if (error) {
                throw new Error(error.message || "Payment failed");
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                router.push('/dashboard');
            }

        } catch (err: any) {
            setErrorMessage(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2a2a2a] via-[#1e1e1e] to-[#151515] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08)_0%,transparent_40%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.04)_0%,transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

            {/* Subtle noise texture */}
            <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
            />

            <div className="relative no-scrollbar z-10 bg-gradient-to-b from-[#2d2d2d] via-[#252525] to-[#1f1f1f] border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] max-w-5xl w-full flex overflow-hidden backdrop-blur-sm" style={{ maxHeight: '90vh' }}>
                
                {/* Left Panel - Payment Form */}
                <div className="flex-1 no-scrollbar p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                    
                    {/* Card Number */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-white/90 mb-2">Card Number</label>
                        <p className="text-xs text-white/50 mb-3">Enter the 16-digit card number on the card</p>
                        <div className="relative">
                            <div className="flex items-center gap-3 p-3.5 bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 rounded-xl transition-all focus-within:border-white/30 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                                <div className="flex items-center justify-center">
                                    <div className="w-9 h-6 bg-red-500 rounded-md flex items-center justify-center relative shadow-md">
                                        <div className="w-5 h-5 bg-orange-400 rounded-full absolute right-0"></div>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <CardNumberElement  options={stripeInputOptions}/>
                                </div>

                                <button className="text-white/60 hover:text-white/80 transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CVV Number */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-white/90 mb-2">CVV Number</label>
                        <p className="text-xs text-white/50 mb-3">Enter the 3 or 4 digit number on the card</p>
                        <div className="relative">
                            <div className="w-full h-12 px-4 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 flex items-center transition-all focus-within:border-white/30 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                                <CreditCard className="w-5 h-5 text-white/40 mr-3" />
  
                                <div className="flex-1">
                                    <CardCvcElement options={stripeInputOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-white/90 mb-2">Expiry Date</label>
                        <p className="text-xs text-white/50 mb-3">Enter the expiration date</p>
                        <div className="flex gap-4">
                            <div className="flex-1 h-12 p-3.5 bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 rounded-xl focus-within:border-white/30 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                                <CardExpiryElement options={stripeInputOptions} />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-white/90 mb-2">Confirm Password</label>
                        <p className="text-xs text-white/50 mb-3">Enter your account password for verification</p>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-12 pl-4 pr-12 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 text-white transition-all focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] shadow-[0_4px_12px_rgba(0,0,0,0.2)] placeholder:text-white/30"
                            />
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                            >
                                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Error Messages */}
                    {errorMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        </div>
                    )}

                    {/* Pay Button */}
                    <button 
                        onClick={handlePay}
                        disabled={isLoading || !stripe || !elements}
                        className="w-full h-12 rounded-xl bg-gradient-to-b from-[#404040] via-[#353535] to-[#2a2a2a] border border-white/15 text-white font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:from-[#454545] hover:via-[#3a3a3a] hover:to-[#2f2f2f] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                         {isLoading ? (
                            <>
                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             <span>Processing...</span>
                            </>
                         ) : (
                             <>
                                <Lock className="w-4 h-4" />
                                <span>Pay ₹{price}</span>
                             </>
                         )}
                    </button>
                </div>

                {/* Right Panel - Order Summary */}
                <div className="w-80 bg-gradient-to-b from-[#252525]/50 to-[#1a1a1a]/50 backdrop-blur-sm p-7 border-l border-white/10 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                    {/* Phone Mockup */}
                    <div className="bg-gradient-to-b from-[#2d2d2d] to-[#1f1f1f] border border-white/10 rounded-3xl p-5 mb-7 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                        {/* Card Preview */}
                        <div className="bg-gradient-to-br from-[#3a3a3a] via-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-white/10">
                            <div className="flex justify-between items-start mb-9">
                                <div className="w-9 h-7 bg-yellow-400 rounded shadow-lg"></div>
                            </div>
                            <div className="mb-5">
                                <p className="text-xs opacity-50 mb-1">Card Holder</p>
                                <p className="font-mono text-lg font-semibold tracking-wider">•••• •••• •••• 4242</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs opacity-40 mb-0.5">Valid Thru</p>
                                    <p className="font-mono text-sm font-medium">--/--</p>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-7 h-5 bg-red-500 rounded-full"></div>
                                    <div className="w-7 h-5 bg-orange-400 rounded-full -ml-2.5"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4 mb-7">
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 font-medium text-sm">Product</span>
                            <span className="font-semibold text-white/90 text-sm">{planName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 font-medium text-sm">Order Number</span>
                            <span className="font-semibold text-white/90 text-sm">#{Math.floor(Math.random() * 1000000)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 font-medium text-sm">Tax (0%)</span>
                            <span className="font-semibold text-white/90 text-sm">₹0.00</span>
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="border-t border-white/10 pt-5">
                        <p className="text-white/60 text-xs font-medium mb-3">You have to Pay</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-white">{price}</span>
                                <span className="text-xl text-white/70">.00</span>
                                <span className="text-xs text-white/50 ml-2 font-medium">INR</span>
                            </div>
                            <div className="w-9 h-9 bg-gradient-to-b from-[#2d2d2d] to-[#1f1f1f] border border-white/10 rounded-lg flex items-center justify-center hover:border-white/20 transition-colors shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                                <Receipt className="w-4 h-4 text-white/60" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}