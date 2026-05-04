import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CARD_REGISTRY } from "@/components/common/cardRegistry";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Link, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { getStorefrontSearchResults } from "@/lib/products";
import { getStorefrontTheme } from "@/lib/theme/getTheme";

/** Storefront API default page size for `GET /products/search/`. */
const PRODUCT_SEARCH_PAGE_SIZE = 24;

function buildSearchHref(q: string, page: number): string {
  const params = new URLSearchParams();
  params.set("q", q);
  if (page > 1) {
    params.set("page", String(page));
  }
  return `/search?${params.toString()}`;
}

type SearchPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const resolvedSearch = await searchParams;
  const q = (resolvedSearch.q ?? "").trim();
  const pageRaw = resolvedSearch.page;
  const page = Math.max(1, Math.floor(Number(pageRaw)) || 1);
  const queryReady = q.length >= 2;

  const [t, searchData, theme] = await Promise.all([
    getTranslations("search"),
    queryReady ? getStorefrontSearchResults(q, page) : Promise.resolve(null),
    getStorefrontTheme(),
  ]);

  const CardComponent = theme?.card_variant === "shelf" ? CARD_REGISTRY.shelf : CARD_REGISTRY.classic;

  const totalPages =
    searchData && searchData.count > 0
      ? Math.ceil(searchData.count / PRODUCT_SEARCH_PAGE_SIZE)
      : 0;

  const showPagination = queryReady && totalPages > 1;
  const hasProductHits = Boolean(searchData?.products.length);
  const showCategoryMatches = Boolean(searchData?.categories.length);
  const showSuggestions = Boolean(searchData?.suggestions.length);

  return (
    <div className="bg-card py-8 md:py-10">
      <PageContainer>
        <header className="max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{t("title")}</h1>
          {queryReady ? (
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              {t("resultsFor", { q })}
              {searchData ? (
                <span className="ms-1 text-muted-foreground">
                  ({t("resultCount", { count: searchData.count })})
                </span>
              ) : null}
            </p>
          ) : q.length === 1 ? (
            <p className="mt-2 text-sm text-muted-foreground">{t("minCharsHint")}</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{t("emptyQueryHint")}</p>
          )}
        </header>

        {queryReady && showCategoryMatches ? (
          <section className="mt-8" aria-labelledby="search-categories-heading">
            <h2 id="search-categories-heading" className="text-sm font-semibold text-foreground">
              {t("matchingCategories")}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {searchData!.categories.map((cat) => (
                <li key={cat.public_id}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "rounded-sm border border-border bg-card px-4 text-foreground shadow-sm hover:bg-muted",
                    )}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {queryReady && showSuggestions ? (
          <section className="mt-8" aria-labelledby="search-suggestions-heading">
            <h2 id="search-suggestions-heading" className="text-sm font-semibold text-foreground">
              {t("suggestions")}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {searchData!.suggestions.map((label) => (
                <li key={label}>
                  <Link
                    href={buildSearchHref(label, 1)}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "rounded-sm border border-violet-200/80 bg-violet-50/80 px-4 text-foreground hover:bg-violet-100/80",
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {queryReady && hasProductHits ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {searchData!.products.map((product, productIdx) => (
              <CardComponent
                key={product.public_id}
                product={product}
                locale={locale as Locale}
                aosDelay={(productIdx + 1) * 100}
              />
            ))}
          </div>
        ) : null}

        {queryReady && !hasProductHits ? (
          <p className="card mx-auto mt-10 max-w-lg text-center text-sm text-foreground/80">{t("noProducts")}</p>
        ) : null}

        {showPagination ? (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-border/80 pt-8"
            aria-label={t("paginationAria")}
          >
            {page > 1 ? (
              <Link
                href={buildSearchHref(q, page - 1)}
                className={cn(buttonVariants({ variant: "ghost", size: "md" }), "min-w-[7rem] border border-border")}
              >
                {t("previous")}
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: "ghost", size: "md" }),
                  "pointer-events-none min-w-[7rem] border border-border text-muted-foreground",
                )}
                aria-disabled="true"
              >
                {t("previous")}
              </span>
            )}
            <span className="text-sm tabular-nums text-muted-foreground">
              {t("pageStatus", { current: page, total: totalPages })}
            </span>
            {page < totalPages ? (
              <Link
                href={buildSearchHref(q, page + 1)}
                className={cn(buttonVariants({ variant: "ghost", size: "md" }), "min-w-[7rem] border border-border")}
              >
                {t("next")}
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ variant: "ghost", size: "md" }),
                  "pointer-events-none min-w-[7rem] border border-border text-muted-foreground",
                )}
                aria-disabled="true"
              >
                {t("next")}
              </span>
            )}
          </nav>
        ) : null}
      </PageContainer>
    </div>
  );
}
