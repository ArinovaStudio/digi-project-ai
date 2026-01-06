// components/PricingCard.tsx
"use client";

import { Plan } from "@/app/pricing/page";
import { Check } from "lucide-react";

export default function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 p-6 flex flex-col
      ${
        plan.highlight
          ? "bg-gradient-to-b from-[#1a1a1a] to-[#111] ring-1 ring-white/20"
          : "bg-[#161616]"
      }`}
    >
      <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>

      <p className="text-3xl font-bold mb-1">{plan.price}</p>
      <p className="text-sm text-gray-400 mb-6">{plan.subtitle}</p>

      <button
        disabled={plan.isCurrent}
        className={`mb-6 rounded-full py-2 text-sm font-medium transition
        ${
          plan.isCurrent
            ? "bg-white/10 text-gray-400 cursor-not-allowed"
            : "bg-white text-black hover:bg-gray-200"
        }`}
      >
        {plan.isCurrent ? "Your current plan" : `Get ${plan.name}`}
      </button>

      <ul className="space-y-3 text-sm text-gray-300">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check size={16} className="text-green-400 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
