import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { BlogHero } from "@/components/blog/blog-hero";
import { BlogListing } from "@/components/blog/blog-listing";
import { PageContainer } from "@/components/layout/page-container";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPosts, getFeaturedPosts, getLatestPosts } from "@/lib/blog-data";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    return {};
  }

  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
    getTranslations({ locale, namespace: "common" }),
  ]);

  return {
    title: `${t("metaTitle")} - ${common("brand")}`,
    description: t("metaDescription"),
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [t, posts, featuredPosts, latestPosts] = await Promise.all([
    getTranslations({ locale, namespace: "blog" }),
    getAllPosts(),
    getFeaturedPosts(),
    getLatestPosts(),
  ]);

  return (
    <div className="bg-surface pb-12 pt-8 md:pb-16 md:pt-10">
      <PageContainer>
        <BlogHero badge={t("badge")} title={t("heroTitle")} intro={t("heroIntro")} />
        <BlogListing
          posts={posts}
          featuredPosts={featuredPosts}
          latestPosts={latestPosts}
          sectionTitle={t("sectionTitle")}
          featuredHeading={t("featuredHeading")}
          latestHeading={t("latestHeading")}
          searchPlaceholder={t("searchPlaceholder")}
          searchButtonLabel={t("searchButton")}
          emptySearch={t("emptySearch")}
        />
      </PageContainer>
    </div>
  );
}
