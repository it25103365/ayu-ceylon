import { prisma } from "@/lib/prisma";
import Storefront from "@/components/Storefront";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "සියලුම ආයුර්වේද ඖෂධ - All Ayurvedic Remedies",
  description:
    "ගම්පහ වෙද ආරච්චි පාරම්පරික ආයුර්වේද ඖෂධ, තෛල, පස්පංගුව, පැණි සහ චූර්ණ එකතුව. Authentic Sri Lankan Ayurvedic remedies and herbal formulas.",
  alternates: {
    canonical: "/medicines",
  },
  openGraph: {
    title: "සියලුම ආයුර්වේද ඖෂධ - All Remedies | Ayu Zeylan",
    description:
      "ගම්පහ වෙද ආරච්චි පාරම්පරික ආයුර්වේද ඖෂධ, තෛල, පස්පංගුව, පැණි සහ චූර්ණ එකතුව.",
    url: "https://ayu-ceylon.vercel.app/medicines",
  },
};

export default async function MedicinesPage() {
  const medicines = await prisma.medicine.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <Storefront initialMedicines={medicines} />;
}
