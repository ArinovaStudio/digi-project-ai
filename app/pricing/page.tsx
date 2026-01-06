import PricingCard from "@/components/PricingCard";

export type Plan = {
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  isCurrent?: boolean;
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Go",
    price: "₹0",
    subtitle: "100 credits / month",
    isCurrent: true,
    features: [
      "Go deep on harder questions",
      "Chat longer and upload more content",
      "Make realistic images",
      "Store more context",
      "Help with planning and tasks",
    ],
  },
  {
    name: "Plus",
    price: "₹199 / month",
    subtitle: "1500 credits / month",
    highlight: true,
    features: [
      "Tackle complex questions & projects",
      "Longer conversations & more uploads",
      "Create high-quality images",
      "Increased memory capacity",
      "Priority support",
    ],
  },
  {
    name: "Pro",
    price: "₹1000 / month",
    subtitle: "3000 credits / month",
    features: [
      "Advanced tasks & topics",
      "Priority access to new features",
      "Faster response times",
      "Extended memory capacity",
      "Premium support",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Upgrade your plan
        </h1>

        {/* <div className="flex justify-center mb-12">
          <PricingToggle />
        </div> */}

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </main>
  );
}
