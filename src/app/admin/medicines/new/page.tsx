import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import MedicineForm from "@/components/MedicineForm";

export const dynamic = "force-dynamic";

export default async function NewMedicinePage() {
  const session = await getAdminSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin/medicines/new");
  }

  return <MedicineForm isEditMode={false} />;
}
