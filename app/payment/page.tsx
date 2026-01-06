'use client';
import React, { useState } from 'react';
import { X, Edit2, Eye, EyeOff, CreditCard, Wifi, Battery, Signal, Receipt } from 'lucide-react';

export default function PaymentGateway() {
    const [showPassword, setShowPassword] = useState(false);
    const [cardNumber, setCardNumber] = useState('2412 7450 3665 3446');
    const [cvv, setCvv] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="min-h-screen  bg-gradient-to-br from-[#2a2a2a] via-[#1e1e1e] to-[#151515] flex items-center justify-center p-4 relative overflow-hidden">
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
                    {/* Header */}
                    {/* <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#404040] to-[#2a2a2a] border border-white/20 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                <div className="text-white font-bold text-xl">»</div>
              </div>
              <span className="text-xl font-semibold text-white">Meiranpay</span>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div> */}

                    {/* Timer */}
                    {/* <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 text-white px-4 py-3 rounded-xl text-xl font-mono font-bold shadow-[0_4px_12px_rgba(0,0,0,0.3)]">1</div>
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 text-white px-4 py-3 rounded-xl text-xl font-mono font-bold shadow-[0_4px_12px_rgba(0,0,0,0.3)]">0</div>
              </div>
              <span className="text-xl font-bold text-white/70 mx-1">:</span>
              <div className="flex gap-1.5">
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 text-white px-4 py-3 rounded-xl text-xl font-mono font-bold shadow-[0_4px_12px_rgba(0,0,0,0.3)]">0</div>
                <div className="bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 text-white px-4 py-3 rounded-xl text-xl font-mono font-bold shadow-[0_4px_12px_rgba(0,0,0,0.3)]">3</div>
              </div>
            </div>
          </div> */}

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
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="flex-1 bg-transparent font-mono text-white text-base outline-none placeholder:text-white/30"
                                    placeholder="2412 7450 3665 3446"
                                />
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
                            <input
                                type="text"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="446"
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 text-white placeholder:text-white/30 transition-all focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] font-mono shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                            />
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-white/90 mb-2">Expiry Date</label>
                        <p className="text-xs text-white/50 mb-3">Enter the expiration date of the card</p>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={expiryMonth}
                                onChange={(e) => setExpiryMonth(e.target.value)}
                                placeholder="10"
                                className="flex-1 h-12 p-3.5 bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 rounded-xl focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] text-white font-mono text-center transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)] placeholder:text-white/30"
                            />
                            <input
                                type="text"
                                value={expiryYear}
                                onChange={(e) => setExpiryYear(e.target.value)}
                                placeholder="24"
                                className="flex-1 h-12 p-3.5 bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 rounded-xl focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] text-white font-mono text-center transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)] placeholder:text-white/30"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-white/90 mb-2">Password</label>
                        <p className="text-xs text-white/50 mb-3">Enter your Dynamic password</p>
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

                    {/* Pay Button */}
                    <button className="w-full h-12 rounded-xl bg-gradient-to-b from-[#404040] via-[#353535] to-[#2a2a2a] border border-white/15 text-white font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:from-[#454545] hover:via-[#3a3a3a] hover:to-[#2f2f2f] active:scale-[0.98] transition-all">
                        Pay Now
                    </button>
                </div>

                {/* Right Panel - Order Summary */}
                <div className="w-80 bg-gradient-to-b from-[#252525]/50 to-[#1a1a1a]/50 backdrop-blur-sm p-7 border-l border-white/10 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                    {/* Phone Mockup */}
                    <div className="bg-gradient-to-b from-[#2d2d2d] to-[#1f1f1f] border border-white/10 rounded-3xl p-5 mb-7 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                        {/* Phone Status Bar */}
                        {/* <div className="flex justify-between items-center mb-5 text-xs text-white/50">
              <div className="flex items-center gap-2">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium">100%</span>
                <Battery className="w-4 h-3" />
              </div>
            </div> */}

                        {/* Card Preview */}
                        <div className="bg-gradient-to-br from-[#3a3a3a] via-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-white/10">
                            <div className="flex justify-between items-start mb-9">
                                <div className="w-9 h-7 bg-yellow-400 rounded shadow-lg"></div>
                                {/* <Wifi className="w-5 h-5 opacity-60" /> */}
                            </div>
                            <div className="mb-5">
                                <p className="text-xs opacity-50 mb-1">Aduke Morewa</p>
                                <p className="font-mono text-lg font-semibold tracking-wider">•••• 3456</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs opacity-40 mb-0.5">Valid Thru</p>
                                    <p className="font-mono text-sm font-medium">09/24</p>
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
                            <span className="text-white/60 font-medium text-sm">Company</span>
                            <span className="font-semibold text-white/90 text-sm">Samsung</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 font-medium text-sm">Order Number</span>
                            <span className="font-semibold text-white/90 text-sm">1443366</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 font-medium text-sm">Product</span>
                            <span className="font-semibold text-white/90 text-sm">Galaxy S22</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 font-medium text-sm">VAT (20%)</span>
                            <span className="font-semibold text-white/90 text-sm">$100.00</span>
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="border-t border-white/10 pt-5">
                        <p className="text-white/60 text-xs font-medium mb-3">You have to Pay</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold text-white">800</span>
                                <span className="text-xl text-white/70">.00</span>
                                <span className="text-xs text-white/50 ml-2 font-medium">USD</span>
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