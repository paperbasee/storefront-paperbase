import { ImageIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CartPanelHost, CartTrigger } from "@/components/common/cart-drawer-trigger";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { Link } from "@/i18n/routing";
import { DesktopCategoryMegaNav } from "@/components/layout/desktop-category-mega-nav";
import { HeaderSearch } from "@/components/layout/header-search";
import { MobileSearchOverlay } from "@/components/layout/mobile-search-overlay";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import { PageContainer } from "@/components/layout/page-container";
import { getStorefrontHeaderCategories, getStorefrontNotifications, getStorefrontStorePublic } from "@/lib/storefront";

export async function Navbar() {
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const product = await getTranslations("product");
  const [store, categories, notifications] = await Promise.all([
    getStorefrontStorePublic(),
    getStorefrontHeaderCategories(),
    getStorefrontNotifications(),
  ]);
  const topNotice = notifications[0]?.cta_text ?? common("brand");

  return (
    <header className="w-full min-w-0 overflow-x-clip bg-header text-white pt-[env(safe-area-inset-top,0px)] ps-[env(safe-area-inset-left,0px)] pe-[env(safe-area-inset-right,0px)]">
      <div className="bg-header/95">
        <PageContainer>
          <p className="py-1.5 text-center text-[11px] tracking-wide text-white/90">
            {topNotice}
          </p>
        </PageContainer>
      </div>

      <PageContainer>
        <div className="flex min-h-20 items-center gap-3 py-3 md:gap-4">
          <div className="grid w-full min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 md:hidden">
            <MobileNavDrawer
              menuTitle={nav("products")}
              allProductsLabel={nav("products")}
              allCategoriesLabel={nav("products")}
              categories={categories}
            />
            <div className="min-w-0">
              <MobileSearchOverlay
                placeholder={common("empty")}
                openSearchAriaLabel={nav("openSearch")}
                submitAriaLabel={nav("openSearch")}
                closeLabel={common("close")}
              />
            </div>
            <CartTrigger variant="mobile" />
          </div>

          <Link
            href="/"
            className="hidden shrink-0 items-center gap-3 leading-tight md:inline-flex"
          >
            <ImageIcon
              className="size-11 shrink-0 text-white/45"
              strokeWidth={1.25}
              aria-hidden
            />
            <span className="flex flex-col justify-center gap-0.5">
              <span className="text-sm font-semibold">{store.store_name}</span>
              <span className="text-xs text-white/75">Trusted daily essentials</span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 md:block">
            <HeaderSearch
              placeholder={common("empty")}
              submitAriaLabel={nav("openSearch")}
            />
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex md:gap-3">
            <div className="hidden lg:block">
              <p className="text-[11px] uppercase tracking-wide text-white/75">{common("brand")}</p>
              <p className="text-sm font-semibold">{store.phone}</p>
            </div>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <CartTrigger variant="desktop" />
          </div>
        </div>
      </PageContainer>

      <CartPanelHost />

      <div className="hidden border-t border-white/15 bg-header md:block">
        <DesktopCategoryMegaNav
          ariaLabel={nav("products")}
          browseEyebrow={nav("products")}
          shopAllInPrefix={nav("products")}
          newBadgeLabel={product("newBadge")}
          categories={categories}
        />
      </div>
    </header>
  );
}
