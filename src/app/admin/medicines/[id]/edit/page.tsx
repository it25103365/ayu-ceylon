import { redirect, notFound } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MedicineForm from "@/components/MedicineForm";

export const dynamic = "force-dynamic";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMedicinePage({ params }: EditPageProps) {
  const session = await getAdminSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  const { id } = await params;
  const medicine = await prisma.medicine.findUnique({
    where: { id },
  });

  if (!medicine) {
    notFound();
  }

  return (
    <MedicineForm
      isEditMode={true}
      initialData={{
        id: medicine.id,
        nameSi: medicine.nameSi,
        nameEn: medicine.nameEn,
        category: medicine.category,
        price: medicine.price,
        stock: medicine.stock,
        descriptionSi: medicine.descriptionSi,
        descriptionEn: medicine.descriptionEn,
        ingredientsSi: medicine.ingredientsSi || "",
        ingredientsEn: medicine.ingredientsEn || "",
        usageSi: medicine.usageSi || "",
        usageEn: medicine.usageEn || "",
        imageUrl: medicine.imageUrl,
        featured: medicine.featured,
      }}
    />
  );
}
