import { read } from "@/lib/db";
import { PageHead } from "@/components/admin/ui";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata = { title: "Orders" };

export default async function OrdersAdmin() {
  const orders = await read("orders");
  return (
    <>
      <PageHead title="Orders" sub="Every checkout lands here, and is also sent to your WhatsApp." />
      <OrdersTable orders={orders} />
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
