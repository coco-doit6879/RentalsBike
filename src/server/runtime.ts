import { resolve } from "node:path";
import { RentalStore } from "./store";
import { createApi, json } from "./api";

let current: { store: RentalStore; api: ReturnType<typeof createApi> } | undefined;
function getApi() {
  if (!current) {
    const store = new RentalStore(process.env.RENTAL_DB_PATH || resolve(process.cwd(), "private-data", "rentals.sqlite"));
    current = { store, api: createApi({
      store,
      passwordHash: process.env.ADMIN_PASSWORD_HASH,
      secureCookies: process.env.ADMIN_COOKIE_SECURE === "true" ? true : process.env.ADMIN_COOKIE_SECURE === "false" ? false : undefined,
      trustedClientHeader: process.env.RENTAL_TRUSTED_CLIENT_HEADER,
      rateLimitKey: process.env.RENTAL_RATE_LIMIT_KEY,
    }) };
  }
  return current.api;
}
export async function withApi(handler: (api: ReturnType<typeof createApi>) => Promise<Response>) {
  try { return await handler(getApi()); }
  catch { return json({ error: "Service unavailable.", code: "INTERNAL_ERROR" }, 503); }
}
export function closeApi() { current?.store.close(); current = undefined; }
