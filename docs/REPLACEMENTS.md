# Các chỗ cần thay trước khi dùng thật

Mọi dữ liệu minh họa phải được kiểm chứng; không dùng website hiện tại để bán hàng hoặc nhận đăng ký thật.

| Vị trí | Thay / xác minh |
|---|---|
| `public/images/scooter-{ivory,graphite,blue}.svg` | Ảnh sản phẩm có quyền sử dụng, chính xác từng màu; SVG hiện tại là concept không phải Evo Lite |
| `public/images/detail.svg`, `city.svg`, `showroom.svg` | Ảnh chi tiết kỹ thuật, lifestyle và showroom có giấy phép |
| `src/components/primitives.tsx` → `ImageSlot` | Đường dẫn, tỷ lệ, alt, sizes; ảnh raster dùng Next Image optimization; priority chỉ cho LCP |
| `src/data/catalog.ts` | Phiên bản Urban/Signature, màu, giá 18.9/20.9 triệu, 150km, 49km/h, 8h, tồn kho và khu vực đều là MẪU |
| `src/components/home.tsx` | Nội dung công nghệ/môi trường; chỉ số 0g tại ống xả không đại diện carbon toàn vòng đời; tuyệt đối không thêm tái tạo phanh nếu chưa xác minh |
| `src/components/catalog.tsx` | Nội dung tính năng, loại pin/công suất/kết nối/trang bị an toàn, điều kiện thử nghiệm và bảng thông số |
| `src/data/dealers.ts` | Địa chỉ, SĐT, giờ mở cửa, tỉnh/thành, showroom và dữ liệu điểm sạc thực tế |
| `src/components/dealers.tsx` → `MapPanel` | Tích hợp provider bản đồ sau khi có key và chính sách quyền riêng tư; placeholder không có tọa độ thật |
| `src/data/editorial.ts` | Tin tức, ngày đăng, sự kiện, mô tả tuyển dụng, gói dịch vụ, giá và FAQ |
| `src/lib/forms.ts` | Lựa chọn gói trong form, lịch hoạt động, quy tắc xác thực; thay mock bằng backend có rate-limit, chống spam, kiểm tra server và lưu trữ có kiểm soát |
| `src/components/forms.tsx` | Tên/màu/đại lý, nội dung đồng ý hợp lệ; bỏ checkbox lỗi demo khi đã có hệ thống thật |
| `src/data/legal.ts` | Chính sách bảo mật, điều khoản, đơn vị kiểm soát dữ liệu, retention và quyền của người dùng — cần rà soát pháp lý |
| `src/components/shell.tsx` | Thông tin pháp nhân, showroom, hotline, email example.com, liên kết mạng xã hội; chỉ dùng wordmark/logo khi có quyền |
| `.env.local` → `NEXT_PUBLIC_SITE_URL` | Domain triển khai để canonical, Open Graph và sitemap chính xác |
| `public/og-image.svg`, `src/lib/seo.ts` | Thay ảnh social PNG/JPEG 1200×630 vì nhiều social crawler không hỗ trợ SVG; kiểm tra metadata riêng từng trang |
| `src/app/robots.ts`, `layout.tsx` | Demo đang disallow/noindex; chỉ cho phép index sau khi đã thay dữ liệu và được phép dùng thương hiệu |

## Những phần chưa có backend thật

Không thanh toán/đặt cọc, không tài khoản khách hàng/admin, không CMS, không kho xe thật, không lưu CRM, không gửi email/SMS, không tiếp nhận CV, không tích hợp trạm sạc hoặc bản đồ thực. Form chỉ mô phỏng, chọn thành công không có nghĩa đã đặt lịch.

## Checklist trước production

1. Xác minh toàn bộ dữ liệu với nguồn chính thức, lưu nguồn và ngày kiểm chứng.
2. Xác nhận quyền thương hiệu, ảnh, nội dung; thay asset và placeholder liên hệ.
3. Xây API bảo mật và quy trình xử lý dữ liệu; cập nhật consent/privacy.
4. Tích hợp backend lịch hẹn, kho, dịch vụ và CMS; theo dõi lỗi không chứa PII.
5. Kiểm thử luồng end-to-end bằng staging, rà soát accessibility thủ công, kiểm tra Safari/Firefox.
6. Đo Lighthouse và Core Web Vitals trên hosting/CDN thật; tối ưu ảnh WebP/AVIF, cache.
7. Cấu hình domain/canonical, OG PNG, sitemap; chỉ mở index khi đủ điều kiện.
