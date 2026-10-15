import { withApi } from "../../../../server/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET(request: Request) { return withApi((api) => api.session(request)); }
