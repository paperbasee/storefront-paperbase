import {
  getActiveNotifications,
  getBanners,
  getStorePublic,
  listCategories,
} from "@/lib/server/paperbase";
import type { PaperbaseCategoryTreeNode } from "@/types/paperbase";

export type HeaderCategoryNav = {
  id: string;
  label: string;
  href: string;
  description?: string;
  isNew?: boolean;
  children?: HeaderCategoryNav[];
};

function mapCategoryNode(node: PaperbaseCategoryTreeNode): HeaderCategoryNav {
  return {
    id: node.public_id,
    label: node.name,
    href: `/categories/${node.slug}`,
    description: node.description || undefined,
    children: node.children?.map(mapCategoryNode) ?? [],
  };
}

export async function getStorefrontStorePublic() {
  return getStorePublic();
}

export async function getStorefrontHeaderCategories() {
  const categories = await listCategories({ tree: "1" });
  return categories.map(mapCategoryNode);
}

export async function getStorefrontBanners() {
  const banners = await getBanners();
  return [...banners].sort((a, b) => a.order - b.order);
}

export async function getStorefrontNotifications() {
  const notifications = await getActiveNotifications();
  return notifications
    .filter((item) => item.is_currently_active)
    .sort((a, b) => a.order - b.order);
}
