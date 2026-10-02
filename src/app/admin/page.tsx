import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Strict server-side admin verification
  const session = await getAdminSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  const [medicines, orders] = await Promise.all([
    prisma.medicine.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AdminDashboardClient
      initialMedicines={medicines}
      initialOrders={orders}
    />
  );
}
