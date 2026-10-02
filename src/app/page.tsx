import { prisma } from "@/lib/prisma";
import Storefront from "@/components/Storefront";

export const revalidate = 0; // Dynamic data for live updates

export default async function HomePage() {
  const medicines = await prisma.medicine.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <Storefront initialMedicines={medicines} />;
}
