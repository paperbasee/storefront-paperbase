import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { PageContainer } from "@/components/layout/page-container";

export default async function NotFoundPage() {
  const t = await getTranslations("states");

  return (
    <PageContainer>
      <div className="card mt-8 space-y-3">
        <h1 className="text-xl font-semibold text-text">{t("notFoundTitle")}</h1>
        <p className="text-sm text-text/80">{t("notFoundDescription")}</p>
        <Link href="/" className="price-text text-sm font-semibold hover:underline">
          {t("goHome")}
        </Link>
      </div>
    </PageContainer>
  );
}
