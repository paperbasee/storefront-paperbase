import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/layout/page-container";

export default async function Loading() {
  const t = await getTranslations("states");

  return (
    <PageContainer>
      <div className="card mt-8 text-sm text-text/80">{t("loading")}</div>
    </PageContainer>
  );
}
