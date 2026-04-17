import { getStorefrontProductDetail } from "@/lib/products";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  const { slug } = await params;
  const product = await getStorefrontProductDetail(slug);
  if (!product) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(product);
}
