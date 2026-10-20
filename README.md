# Evo Lite Rentals — Thuê xe điện

Next.js App Router + TypeScript, Tailwind, Framer Motion, React Hook Form/Zod. Giao diện premium từ showroom được chuyển sang cho thuê, hỗ trợ toàn bộ nội dung tiếng Việt/English.

## Chạy

Yêu cầu **Node >=22.13** (SQLite tích hợp), đã kiểm tra Node26.7.

```sh
npm ci
npm run dev
```

Production: `npm run build` rồi `npm run start`. Không build/dev trong lúc dùng production server cũ để kiểm thử. Bản tích hợp đã kiểm tra tại `http://localhost:3006`.

## Quản trị

```sh
npm run admin:setup
```

Tự nhập và xác nhận mật khẩu trong terminal được che ký tự (12 ký tự trở lên), sau đó khởi động lại server và mở `/admin`. **Không có mật khẩu mặc định.** Không gửi mật khẩu qua chat, tham số lệnh hoặc source. Với production HTTP local, cần `ADMIN_COOKIE_SECURE=false`; public production phải HTTPS. Chi tiết: [docs/BACKEND.md](docs/BACKEND.md).

Yêu cầu được lưu tại `private-data/rentals.sqlite` (hoặc `RENTAL_DB_PATH`), không trong browser localStorage. SQLite cần private persistent disk; không dùng filesystem ephemeral của serverless cho dữ liệu thật. `.env.local` và `private-data/` đã ignore. Khi chưa cấu hình admin, API quản trị đóng và không có public list dữ liệu khách.

## Trang chính

`/`, `/models`, `/models/evo-lite`, `/pricing`, `/rent`, `/how-it-works`, `/locations`, `/about`, `/privacy`, `/terms`, `/admin`.

Các URL mua xe/lái thử/dịch vụ cũ chuyển hướng; các component cũ giữ để tham chiếu, không còn dùng trong luồng đang hoạt động.

## Giá theo poster người dùng cung cấp

| Gói | Giá VND |
|---|---:|
| 3 ngày | 400.000 |
| Tuần | 700.000 |
| Tháng | 2.200.000 |
| 3 tháng | 5.700.000 |
| 6 tháng | 10.000.000 |
| Năm | 16.000.000 |

Cọc 1.000.000đ; trễ 100.000đ giờ đầu, 50.000đ mỗi giờ tiếp. `src/data/rental-pricing.ts` là nguồn cấu hình. Không tự tính ngày lẻ, thuế/giao xe, khấu trừ cọc hay tổng thanh toán khi chưa có quy tắc. Form lưu gói, ngày và liên hệ; không tự giữ xe hoặc thanh toán.

## Kiểm thử

```sh
npm test
npm run typecheck
npm run build
npx playwright install chromium
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3006 npm run test:e2e
npm audit
```

Browser suite mới chỉ chạy `rental.spec.ts` và `rental-submit.spec.ts`; các test showroom cũ không còn phù hợp được loại khỏi Playwright testMatch. Test submit gửi thông tin giả và tạo bản ghi thật: dùng `RENTAL_DB_PATH` trỏ file riêng trong scratch khi kiểm thử, không chạy vào DB khách hàng. Backend tests tự dùng scratch DB và fixture authentication, không cấu hình mật khẩu người dùng.

Đã thực thi: 90 unit/component/backend tests qua trước bổ sung regression ngày quá khứ;48 browser UI Việt/Anh desktop/mobile và2 real-POST integration tests qua. Real POST được đọc lại SQLite:2 bản ghi gói tuần xe xanh trạng thái mới. Production build/typecheck qua. Axe không violation trong các route/languages/viewports đã kiểm tra; không phải chứng nhận WCAG đầy đủ.

## Cần hoàn thiện trước ra mắt

Ảnh hiện là concept tự tạo, không phải xe Evo Lite thực tế. Điểm nhận Hà Nội/Đà Nẵng/TPHCM đang minh họa; cần chốt khu vực phục vụ. Chưa có SMS/email, thanh toán, kho xe/khóa lịch hay hợp đồng điện tử. Cần bổ sung doanh nghiệp, địa chỉ/hotline, retention và privacy pháp lý, điều kiện thuê/giấy phép/bảo hiểm. Không dùng câu “legal for foreigners” như cam kết pháp lý chưa kiểm chứng.

Demo noindex được giữ. Tài liệu: [docs/RENTAL-MIGRATION.md](docs/RENTAL-MIGRATION.md), [docs/BACKEND.md](docs/BACKEND.md), [docs/ASSETS.md](docs/ASSETS.md). Tài liệu REPLACEMENTS của showroom cũ chỉ là lịch sử, ưu tiên migration/backend hiện tại.
