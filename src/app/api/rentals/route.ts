import { withApi } from "../../../server/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function POST(request: Request) { return withApi((api) => api.submit(request)); }
