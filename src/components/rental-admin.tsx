"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language";
import { rentalPlans, type RentalPlanId } from "@/data/rental-pricing";

const statuses = ["new", "contacted", "confirmed", "cancelled"] as const;
type Status = (typeof statuses)[number];
type Rental = {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleId: string;
  rentalPlan?: RentalPlanId;
  startDate: string;
  endDate: string;
  pickup: string;
  note: string;
  locale: string;
  status: Status;
  createdAt: string;
};
type Auth = "checking" | "guest" | "authenticated";
type ErrorKey = "login" | "session" | "setup" | "expired" | "logout" | null;
export function RentalAdmin() {
  const { t } = useLanguage();
  function planLabel(planId: RentalPlanId | undefined) {
    const plan = rentalPlans.find((item) => item.id === planId);
    return plan ? t(plan.vi, plan.en) : t("Chưa cung cấp", "Not provided");
  }
  const [auth, setAuth] = useState<Auth>("checking");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKey>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Status>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveResult, setSaveResult] = useState<{
    id: string;
    ok: boolean;
  } | null>(null);
  const generation = useRef(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "">("");
  const [applied, setApplied] = useState({
    query: "",
    filter: "",
    revision: 0,
  });
  function clearPrivateData() {
    generation.current += 1;
    setRentals([]);
    setDrafts({});
    setSaveResult(null);
    setSavingId(null);
    setPassword("");
    setQuery("");
    setFilter("");
    setApplied({ query: "", filter: "", revision: 0 });
    setLoading(false);
    setListError(false);
    setAuth("guest");
  }
  function expireSession() {
    clearPrivateData();
    setError("expired");
  }
  async function logout() {
    clearPrivateData();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!res.ok && res.status !== 401) setError("logout");
    } catch {
      setError("logout");
    } finally {
      setBusy(false);
    }
  }
  async function saveStatus(rental: Rental) {
    const status = drafts[rental.id] ?? rental.status;
    const currentGeneration = generation.current;
    setSavingId(rental.id);
    setSaveResult(null);
    try {
      const res = await fetch(
        `/api/admin/rentals/${encodeURIComponent(rental.id)}`,
        {
          method: "PATCH",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (currentGeneration !== generation.current) return;
      if (res.status === 401) {
        expireSession();
        return;
      }
      if (res.status === 503) {
        clearPrivateData();
        setError("setup");
        return;
      }
      if (!res.ok) throw new Error("save");
      setRentals((items) =>
        items.map((item) =>
          item.id === rental.id ? { ...item, status } : item,
        ),
      );
      setSaveResult({ id: rental.id, ok: true });
    } catch {
      if (currentGeneration === generation.current)
        setSaveResult({ id: rental.id, ok: false });
    } finally {
      if (currentGeneration === generation.current) setSavingId(null);
    }
  }
  const statusLabel = (status: Status) =>
    ({
      new: t("Mới", "New"),
      contacted: t("Đã liên hệ", "Contacted"),
      confirmed: t("Đã xác nhận", "Confirmed"),
      cancelled: t("Đã hủy", "Cancelled"),
    })[status];
  useEffect(() => {
    if (auth !== "authenticated") return;
    let active = true;
    const currentGeneration = generation.current;
    const isCurrent = () => active && currentGeneration === generation.current;
    setLoading(true);
    setListError(false);
    setRentals([]);
    setDrafts({});
    setSaveResult(null);
    const params = new URLSearchParams({
      q: applied.query,
      status: applied.filter,
    });
    void fetch(`/api/admin/rentals?${params}`, { credentials: "same-origin" })
      .then(async (res) => {
        if (!isCurrent()) return;
        if (res.status === 401) {
          expireSession();
          return;
        }
        if (res.status === 503) {
          clearPrivateData();
          setError("setup");
          return;
        }
        if (!res.ok) throw new Error("list");
        const data = await res.json();
        if (!Array.isArray(data.rentals)) throw new Error("list");
        if (isCurrent()) setRentals(data.rentals);
      })
      .catch(() => {
        if (isCurrent()) setListError(true);
      })
      .finally(() => {
        if (isCurrent()) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [auth, applied]);
  useEffect(() => {
    let active = true;
    void fetch("/api/admin/session", { credentials: "same-origin" })
      .then(async (res) => {
        if (!active) return;
        if (res.status === 503) {
          setAuth("guest");
          setError("setup");
          return;
        }
        if (res.status === 401) {
          setAuth("guest");
          return;
        }
        if (!res.ok) throw new Error("session");
        const data = await res.json();
        if (active) setAuth(data.authenticated ? "authenticated" : "guest");
      })
      .catch(() => {
        if (active) {
          setAuth("guest");
          setError("session");
        }
      });
    return () => {
      active = false;
    };
  }, []);
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const submitted = password;
    setPassword("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: submitted }),
      });
      if (res.status === 503) {
        setError("setup");
        return;
      }
      if (!res.ok) {
        setError("login");
        return;
      }
      setAuth("authenticated");
    } catch {
      setError("login");
    } finally {
      setBusy(false);
    }
  }
  const errorMessage =
    error === "setup"
      ? t(
          "Chưa cấu hình quản trị. Chạy npm run admin:setup trên máy chủ để thiết lập mật khẩu.",
          "Administration is not configured. Run npm run admin:setup on the server to set a password.",
        )
      : error === "expired"
        ? t(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
            "Your session has expired. Please sign in again.",
          )
        : error === "logout"
          ? t(
              "Đã xóa dữ liệu khỏi màn hình nhưng chưa xác nhận đăng xuất trên máy chủ. Vui lòng thử đăng xuất lại.",
              "Customer data is cleared, but server sign-out could not be confirmed. Please retry sign out.",
            )
          : error === "session"
            ? t(
                "Không thể kiểm tra phiên đăng nhập. Vui lòng thử đăng nhập lại.",
                "Unable to check your session. Please sign in again.",
              )
            : t(
                "Không thể đăng nhập. Kiểm tra mật khẩu và thử lại.",
                "Unable to sign in. Check your password and try again.",
              );
  return (
    <section aria-labelledby="admin-title">
      <h1 id="admin-title">
        {t("Quản lý yêu cầu thuê xe", "Rental administration")}
      </h1>
      {auth === "checking" ? (
        <p role="status">
          {t("Đang kiểm tra phiên đăng nhập…", "Checking your session…")}
        </p>
      ) : auth === "guest" ? (
        <form onSubmit={login} className="admin-card">
          <h2>{t("Đăng nhập quản trị", "Admin sign in")}</h2>
          {error && (
            <p role="alert" className="error">
              {errorMessage}
            </p>
          )}
          {error === "logout" && (
            <button
              type="button"
              className="btn btn-outline"
              disabled={busy}
              onClick={() => void logout()}
            >
              {t("Thử đăng xuất lại", "Retry sign out")}
            </button>
          )}
          <label className="field">
            {t("Mật khẩu quản trị", "Admin password")}
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={busy}
            />
          </label>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy
              ? t("Đang đăng nhập…", "Signing in…")
              : t("Đăng nhập", "Sign in")}
          </button>
        </form>
      ) : (
        <>
          <div className="admin-toolbar">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setApplied((current) => ({
                  query: query.trim(),
                  filter,
                  revision: current.revision + 1,
                }));
              }}
            >
              <label className="field">
                {t("Tìm kiếm yêu cầu", "Search requests")}
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label className="field">
                {t("Lọc theo trạng thái", "Filter by status")}
                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value as Status | "")
                  }
                >
                  <option value="">
                    {t("Tất cả trạng thái", "All statuses")}
                  </option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading || savingId !== null}
              >
                {t("Tìm kiếm", "Search")}
              </button>
            </form>
            <button className="btn btn-outline" onClick={() => void logout()}>
              {t("Đăng xuất", "Sign out")}
            </button>
          </div>
          <p className="notice">
            {t(
              "Số lượng chỉ phản ánh kết quả trả về mới nhất, không phải tất cả yêu cầu đã lưu.",
              "Counts reflect only the latest returned results, not all stored requests.",
            )}
          </p>
          <dl className="admin-stats">
            <div>
              <dt>{t("Kết quả hiện tại", "Current results")}</dt>
              <dd>{rentals.length}</dd>
            </div>
            {statuses.map((status) => (
              <div key={status}>
                <dt>{statusLabel(status)}</dt>
                <dd>
                  {rentals.filter((rental) => rental.status === status).length}
                </dd>
              </div>
            ))}
          </dl>
          {loading && (
            <p role="status">{t("Đang tải yêu cầu…", "Loading requests…")}</p>
          )}
          {listError && (
            <div className="error">
              <p role="alert">
                {t(
                  "Không thể tải yêu cầu. Vui lòng thử lại.",
                  "Unable to load requests. Please try again.",
                )}
              </p>
              <button
                className="btn btn-outline"
                onClick={() =>
                  setApplied((current) => ({
                    ...current,
                    revision: current.revision + 1,
                  }))
                }
              >
                {t("Thử lại", "Retry")}
              </button>
            </div>
          )}
          {!loading && !listError && rentals.length === 0 && (
            <p className="empty-state">
              {t(
                "Không có yêu cầu phù hợp với bộ lọc.",
                "No requests match these filters.",
              )}
            </p>
          )}
          <div className="admin-grid">
            {rentals.map((rental) => (
              <article className="admin-card" key={rental.id}>
                <h2>{rental.name}</h2>
                <p className="admin-status">{statusLabel(rental.status)}</p>
                <dl>
                  <div>
                    <dt>{t("Mã yêu cầu", "Request ID")}</dt>
                    <dd>{rental.id}</dd>
                  </div>
                  <div>
                    <dt>{t("Email", "Email")}</dt>
                    <dd>{rental.email}</dd>
                  </div>
                  <div>
                    <dt>{t("Điện thoại", "Phone")}</dt>
                    <dd>{rental.phone}</dd>
                  </div>
                  <div>
                    <dt>{t("Phiên bản xe", "Vehicle")}</dt>
                    <dd>{rental.vehicleId}</dd>
                  </div>
                  <div>
                    <dt>{t("Gói thuê", "Rental plan")}</dt>
                    <dd>{planLabel(rental.rentalPlan)}</dd>
                  </div>
                  <div>
                    <dt>{t("Ngày nhận", "Start date")}</dt>
                    <dd>{rental.startDate}</dd>
                  </div>
                  <div>
                    <dt>{t("Ngày trả", "End date")}</dt>
                    <dd>{rental.endDate}</dd>
                  </div>
                  <div>
                    <dt>{t("Điểm nhận xe", "Pickup")}</dt>
                    <dd>{rental.pickup}</dd>
                  </div>
                  <div>
                    <dt>{t("Ngôn ngữ khách hàng", "Customer language")}</dt>
                    <dd>
                      {rental.locale === "vi"
                        ? t("Tiếng Việt", "Vietnamese")
                        : t("Tiếng Anh", "English")}
                    </dd>
                  </div>
                  <div>
                    <dt>{t("Ngày gửi", "Submitted")}</dt>
                    <dd>{rental.createdAt}</dd>
                  </div>
                  <div>
                    <dt>{t("Ghi chú", "Note")}</dt>
                    <dd
                      style={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {rental.note || t("Không có ghi chú", "No note")}
                    </dd>
                  </div>
                </dl>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void saveStatus(rental);
                  }}
                >
                  <label className="field">
                    {t(
                      `Cập nhật trạng thái cho ${rental.name}`,
                      `Update status for ${rental.name}`,
                    )}
                    <select
                      value={drafts[rental.id] ?? rental.status}
                      disabled={savingId !== null}
                      onChange={(event) => {
                        setDrafts((current) => ({
                          ...current,
                          [rental.id]: event.target.value as Status,
                        }));
                        setSaveResult(null);
                      }}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={
                      savingId !== null ||
                      (drafts[rental.id] ?? rental.status) === rental.status
                    }
                  >
                    {savingId === rental.id
                      ? t("Đang lưu…", "Saving…")
                      : t("Lưu trạng thái", "Save status")}
                  </button>
                  {saveResult?.id === rental.id && (
                    <p
                      role={saveResult.ok ? "status" : "alert"}
                      className={saveResult.ok ? "notice" : "error"}
                    >
                      {saveResult.ok
                        ? t("Đã lưu trạng thái.", "Status saved.")
                        : t(
                            "Không thể lưu trạng thái. Vui lòng thử lại.",
                            "Unable to save status. Please try again.",
                          )}
                    </p>
                  )}
                </form>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
