/**
 * Meta CAPI / custom tracking is not implemented here.
 * Storefront events use Paperbase `tracker.js` → Paperbase ingest (see contract).
 */
export function GET() {
  return new Response(null, { status: 405 });
}

export function POST() {
  return new Response(null, { status: 405 });
}
