import { read } from "@/lib/db";
import { PageHead } from "@/components/admin/ui";
import { InquiriesList } from "@/components/admin/InquiriesList";

export const metadata = { title: "Enquiries" };

export default async function InquiriesAdmin() {
  const inquiries = await read("inquiries");
  return (
    <>
      <PageHead title="Enquiries" sub="Bulk-order and contact form submissions." />
      <InquiriesList inquiries={inquiries} />
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
