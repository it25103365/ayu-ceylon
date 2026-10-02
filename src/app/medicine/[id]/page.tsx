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

  const title = `${medicine.nameSi} (${medicine.nameEn})`;
  const description = medicine.descriptionSi || medicine.descriptionEn;
  const canonicalUrl = `/medicine/${medicine.slug || medicine.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Ayu Zeylan`,
      description,
      url: `https://ayu-ceylon.vercel.app${canonicalUrl}`,
      images: medicine.imageUrl ? [{ url: medicine.imageUrl, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Ayu Zeylan`,
      description,
      images: medicine.imageUrl ? [medicine.imageUrl] : undefined,
    },
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
