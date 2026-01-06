import prisma from "@/lib/prisma";
import PricingCard from "@/components/PricingCard";

export default async function PricingPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { price: "asc" },
  });

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Upgrade your plan
        </h1>

        <div className="flex justify-center items-center flex-wrap gap-20 w-full mt-12">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={{
                id: plan.id, 
                name: plan.name,
                price: `₹${Number(plan.price)} / month`,
                subtitle: `${plan.monthlyCredits} credits / month`,
                features: [
                  `${plan.monthlyCredits} Monthly Credits`,
                  `Max Projects: ${plan.maxProjects}`,
                  "Priority Support",
                ],
                highlight: plan.name === "Plus",
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
