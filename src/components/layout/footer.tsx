import { MapPin, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/layout/page-container";
import { Link } from "@/i18n/routing";
import { getStorefrontStorePublic } from "@/lib/storefront";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64v-3.5a6.33 6.33 0 1 0 5.13 6.23V8.73a8.16 8.16 0 0 0 4.77 1.55V6.69h-.79Z"
      />
    </svg>
  );
}

export async function Footer() {
  const t = await getTranslations("footer");
  const common = await getTranslations("common");
  const store = await getStorefrontStorePublic();
  const year = new Date().getFullYear();

  const socialClass =
    "flex size-11 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-900 transition-colors hover:border-neutral-300 hover:bg-neutral-50";

  return (
    <footer className="border-t border-neutral-200 bg-white pt-10 pb-8 text-neutral-900">
      <PageContainer>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-neutral-900">
              {t("contact")}
            </h2>
            <ul className="list-none space-y-5 p-0">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-neutral-700" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-900">
                    {t("addressLabel")}
                  </p>
                  <p className="mt-0.5 text-sm font-normal text-neutral-800">{store.address || t("addressLine")}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-neutral-700" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-900">
                    {t("emailLabel")}
                  </p>
                  <a
                    className="mt-0.5 block text-sm text-neutral-800 underline-offset-2 hover:underline"
                    href={`mailto:${store.support_email || t("emailLine")}`}
                  >
                    {store.support_email || t("emailLine")}
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-neutral-700" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-900">
                    {t("phoneLabel")}
                  </p>
                  <a
                    className="mt-0.5 block text-sm text-neutral-800 underline-offset-2 hover:underline"
                    href={`tel:${store.phone.replace(/\s/g, "")}`}
                  >
                    {store.phone}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-neutral-900">
              {t("customer")}
            </h2>
            <ul className="list-none space-y-2.5 p-0">
              <li>
                <a href="#" className="text-sm text-neutral-900 underline-offset-2 hover:underline">
                  {t("customerAccount")}
                </a>
              </li>
              <li>
                <Link href="/checkout" className="text-sm text-neutral-900 underline-offset-2 hover:underline">
                  {t("customerCart")}
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-900 underline-offset-2 hover:underline">
                  {t("customerWishlist")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-900 underline-offset-2 hover:underline">
                  {t("customerBlog")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-neutral-900">
              {t("information")}
            </h2>
            <ul className="list-none space-y-2.5 p-0">
              <li>
                <a
                  href={store.social_links.website || "#"}
                  className="text-sm text-neutral-900 underline-offset-2 hover:underline"
                >
                  {t("infoAbout")}
                </a>
              </li>
              <li>
                <Link href="/support" className="text-sm text-neutral-900 underline-offset-2 hover:underline">
                  {t("infoContact")}
                </Link>
              </li>
              <li>
                <a
                  href={store.policy_urls.privacy || "#"}
                  className="text-sm text-neutral-900 underline-offset-2 hover:underline"
                >
                  {t("infoPrivacy")}
                </a>
              </li>
              <li>
                <a
                  href={store.policy_urls.returns || "#"}
                  className="text-sm text-neutral-900 underline-offset-2 hover:underline"
                >
                  {t("infoReturns")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-900 underline-offset-2 hover:underline">
                  {t("infoCancellation")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-5 text-sm font-bold uppercase tracking-wide text-neutral-900">
              {t("socialLinks")}
            </h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={store.social_links.facebook || "https://www.facebook.com/"}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label={t("socialFacebook")}
              >
                <span className="text-[17px] font-bold leading-none">f</span>
              </a>
              <a
                href={store.social_links.tiktok || "https://www.tiktok.com/"}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label={t("socialTiktok")}
              >
                <TikTokIcon className="size-[18px]" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-neutral-500">
          © {year} {store.store_name || common("brand")}. {t("copyright")}{" "}
          <span className="text-neutral-400">|</span> {t("developedBy")}{" "}
          <span className="font-semibold text-neutral-600">{t("developerName")}</span>
        </p>
      </PageContainer>
    </footer>
  );
}
