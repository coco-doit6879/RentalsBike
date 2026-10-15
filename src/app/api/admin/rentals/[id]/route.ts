import { withApi } from "../../../../../server/runtime";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return withApi((api) => api.update(request, id));
}
