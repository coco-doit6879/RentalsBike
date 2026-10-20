// Cloudflare Pages Function: handles /api/rentals
// When deployed on Cloudflare Pages, this function receives customer submissions,
// generates a reference ID, and optionally forwards to Google Sheets.

interface Env {
  GOOGLE_SHEET_WEBHOOK?: string;
}

type PagesFunction<T = Env> = (context: {
  request: Request;
  env: T;
  params: Record<string, string>;
  data: Record<string, unknown>;
  next: () => Promise<Response>;
}) => Promise<Response>;

const planLabels: Record<string, string> = {
  day: "3 ngày (400.000 ₫)",
  week: "1 tuần (700.000 ₫)",
  month: "1 tháng (2.200.000 ₫)",
  quarter: "3 tháng (5.700.000 ₫)",
  "half-year": "6 tháng (10.000.000 ₫)",
  year: "1 năm (16.000.000 ₫)",
};

const pickupLabels: Record<string, string> = {
  hcm: "TP. Hồ Chí Minh",
  hanoi: "Hà Nội",
  danang: "Đà Nẵng",
};

const vehicleLabels: Record<string, string> = {
  pink: "Evo Grand Lite · Hồng phấn",
  white: "Evo Grand Lite · Trắng ngọc",
  ivory: "Evo Lite · Trắng ngà",
  graphite: "Evo Lite · Xám than chì",
  blue: "Evo Lite · Xanh năng động",
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const raw = (await context.request.json()) as Record<string, unknown>;

    const name = String(raw.name || "").trim();
    const phone = String(raw.phone || "").trim();
    const email = String(raw.email || "").trim();
    const vehicleId = String(raw.vehicleId || "");
    const rentalPlan = String(raw.rentalPlan || "");
    const pickup = String(raw.pickup || "");
    const startDate = String(raw.startDate || "");
    const endDate = String(raw.endDate || "");
    const note = String(raw.note || "").trim();
    const honeypot = String(raw.website || "");

    // Ignore honeypot spam
    if (honeypot) {
      return Response.json({ error: "Spam detected." }, { status: 400 });
    }

    if (!name || !phone || !startDate || !endDate) {
      return Response.json(
        { error: "Vui lòng điền đầy đủ các thông tin bắt buộc." },
        { status: 400 },
      );
    }

    const refId =
      "REQ-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    const planText = planLabels[rentalPlan] || rentalPlan;
    const pickupText = pickupLabels[pickup] || pickup;
    const vehicleText = vehicleLabels[vehicleId] || vehicleId;

    // Send to Google Sheet Webhook if configured
    if (context.env.GOOGLE_SHEET_WEBHOOK) {
      try {
        await fetch(context.env.GOOGLE_SHEET_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refId,
            name,
            phone,
            email,
            vehicle: vehicleText,
            plan: planText,
            pickup: pickupText,
            startDate,
            endDate,
            note,
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error("Google Sheet webhook error:", err);
      }
    }

    return Response.json({ id: refId, status: "new" }, { status: 201 });
  } catch (err) {
    console.error("Request error:", err);
    return Response.json(
      { error: "Không thể xử lý yêu cầu. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
