import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PaymentWrapper from '@/components/PaymentWrapper';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPlan(id: string) {
  const plan = await prisma.plan.findUnique({
    where: { id: id },
  });
  return plan;
}

export default async function PaymentPage({ params }: PageProps) {
  const { id } = await params;
  const plan = await getPlan(id);

  if (!plan) {
    return notFound();
  }

  return (
      <PaymentWrapper planId={plan.id} planName={plan.name} price={Number(plan.price)} />
  );
}