import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MedicineDetailClient from "@/components/MedicineDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const medicine = await prisma.medicine.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  });

  if (!medicine) {
    return {
      title: "ඖෂධය හමු නොවීය - Ayu Zeylan",
    };
  }

  return {
    title: `${medicine.nameSi} (${medicine.nameEn}) - Ayu Zeylan`,
    description: medicine.descriptionSi,
  };
}

export default async function MedicineDetailPage({ params }: PageProps) {
  const { id } = await params;

  const medicine = await prisma.medicine.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
  });

  if (!medicine) {
    notFound();
  }

  return <MedicineDetailClient medicine={medicine} />;
}
