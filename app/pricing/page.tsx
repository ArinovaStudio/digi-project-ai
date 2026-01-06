import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Check } from 'lucide-react';

async function getPlans() {
  const plans = await prisma.plan.findMany({ orderBy: { price: 'asc' }});
  return plans;
}

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <div className="min-h-screen bg-[#151515] text-white flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-gray-400">Unlock the full potential of your AI Scraper</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <div key={plan.id} className="relative bg-[#1e1e1e] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col">
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">₹{Number(plan.price)}</span>
              <span className="text-gray-500">/month</span>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Check className="w-4 h-4 text-green-500" />
                <span>{plan.monthlyCredits} Credits / Month</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Check className="w-4 h-4 text-green-500" />
                <span>Priority Support</span>
              </div>
            </div>

            <Link 
              href={`/payment/${plan.id}`}
              className="w-full py-3 bg-white text-black font-bold rounded-xl text-center hover:bg-gray-200 transition-colors"
            >
              Select Plan
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}