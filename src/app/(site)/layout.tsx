import { getSettings } from "@/lib/data";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Preloader } from "@/components/motion/Preloader";
import { Cursor } from "@/components/motion/Cursor";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <Header announcement={settings.announcement} />
      <CartDrawer freeShippingAbove={settings.freeShippingAbove} />
      <main id="main">{children}</main>
      <WhatsAppFab number={settings.whatsapp} />
      <Footer settings={settings} />
    </SmoothScroll>
  );
}
