import { CreditCard, Gift, HelpCircle, Info, ShoppingBag, Truck } from "lucide-react";
import {
  aboutLinks,
  giftCardLinks,
  helpLinks,
  productCategories,
  moreInspiration,
} from "../footerData";
import FooterColumn from "./FooterColumn";
import FooterLinkGrid from "./FooterLinkGrid";
import FooterLinkList from "./FooterLinkList";
import LegalLinks from "./LegalLinks";
import PartnerBadges from "./PartnerBadges";
import PaymentMethods from "./PaymentMethods";
import PromiseList from "./PromiseList";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-light">
      <div className="container space-y-10 py-12">
        <FooterLinkGrid title="Product Categories" links={productCategories} />
        <FooterLinkGrid title="More Inspiration" links={moreInspiration} />
      </div>

      {/* Help / Gift Cards / About */}
      <div className="border-t border-gray-200">
        <div className="container grid gap-10 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <FooterColumn icon={HelpCircle} title="Help & Contact">
              <FooterLinkList links={helpLinks} variant="grid" firstBold />
            </FooterColumn>
          </div>
          <FooterColumn icon={Gift} title="Gift Cards">
            <FooterLinkList links={giftCardLinks} />
          </FooterColumn>
          <FooterColumn icon={Info} title="About us">
            <FooterLinkList links={aboutLinks} />
          </FooterColumn>
        </div>

        {/* Partners / Payments / Promises */}
        <div className="container grid gap-10  pb-12 md:grid-cols-3">
          <FooterColumn icon={Truck} title="Our partners">
            <PartnerBadges />
          </FooterColumn>
          <FooterColumn icon={CreditCard} title="Our payment methods">
            <PaymentMethods />
          </FooterColumn>
          <FooterColumn icon={ShoppingBag} title="Our promises">
            <PromiseList />
          </FooterColumn>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="container flex flex-col gap-8  py-8 lg:flex-row lg:items-start lg:justify-between">
          <LegalLinks />
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
