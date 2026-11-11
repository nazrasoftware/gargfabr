import { read } from "@/lib/db";
import { PageHead } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsAdmin() {
  const settings = await read("settings");
  return (
    <>
      <PageHead title="Settings" sub="Business details shown across the website." />
      <SettingsForm settings={settings} />
    </>
  );
}

// Admin always shows fresh data, so navigations may block on the server.
export const instant = false;
