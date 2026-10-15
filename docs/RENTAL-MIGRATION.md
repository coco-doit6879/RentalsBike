# Chuyển từ showroom bán xe sang cho thuê

## Luồng mới

- `/` giới thiệu thuê xe, `/models` danh sách xe, `/models/evo-lite` chi tiết và màu.
- `/rent` thu thập xe, ngày nhận/trả, khu vực nhận, họ tên, email, số quốc tế/WhatsApp và ghi chú.
- `/how-it-works` hướng dẫn và FAQ; `/locations` điểm nhận minh họa; `/privacy`, `/terms` cập nhật theo luồng thu thập yêu cầu thật.
- `/admin` đăng nhập, xem yêu cầu, tìm kiếm/lọc trạng thái và cập nhật xử lý.
- Các URL cũ `/inventory`, `/test-drive`, `/service`, `/dealers`, `/news`, `/careers` chuyển sang nội dung tương ứng; không tiếp tục quảng bá mua xe/lái thử.
- Nút `English / Tiếng Việt` dịch toàn bộ nội dung đang hoạt động, lưu lựa chọn ở `evo-language`, cập nhật `html lang` và giữ khi điều hướng/tải lại.

## Quyết định hiện tại

Người dùng chọn lưu yêu cầu trong hệ thống và quản trị xem yêu cầu. Bảng giá đã được người dùng xác nhận từ poster: ngày 150.000đ; tuần 800.000đ; tháng 2.500.000đ; 3 tháng 6.500.000đ; 6 tháng 11.000.000đ; năm 18.000.000đ. Cọc 2.000.000đ. Trễ 100.000đ giờ đầu, 50.000đ giờ tiếp theo. Không tự tính thời gian lẻ, thuế/giao xe hay khấu trừ cọc; điều kiện giấy tờ/bảo hiểm còn cần xác minh.

Trạng thái: mới nhận (`new`), đã liên hệ (`contacted`), đã xác nhận (`confirmed`), đã hủy (`cancelled`). Gửi form không tự giữ xe/khóa tồn kho. Quản trị xác nhận sau khi trao đổi khách.

## Dữ liệu và an toàn

Đây không còn là mock-submit: yêu cầu hợp lệ được lưu phía server trong SQLite, không vào localStorage. Dữ liệu cá nhân không có public list API. Thử local bằng dữ liệu giả. Không đưa dữ liệu khách hàng vào git, screenshot hoặc báo cáo.

Trước công bố: bổ sung thông tin pháp nhân, hotline/email, địa chỉ thật, giá và điều kiện thuê, cơ sở pháp lý, retention, quy trình quyền dữ liệu; dùng HTTPS, bảo vệ máy chủ và sao lưu cơ sở dữ liệu. Không triển khai SQLite lên filesystem ephemeral như Vercel/serverless mà kỳ vọng lưu bền.

Đội xe thực tế gồm **2 chiếc VinFast Evo Grand Lite chính chủ (hồng phấn và trắng ngọc)** do người dùng chụp. Xe hồng sử dụng bộ 5 ảnh thực tế (đã che biển số) và video walkaround 14s. Xe trắng có placeholder minh bạch chờ cập nhật ảnh thật, không dùng ảnh giả hay đổi màu ảnh hồng. Thay ảnh qua `ImageSlot`, file trong `public/images/`. Dữ liệu showroom cũ giữ trong source để tham chiếu nhưng không dùng ở routes mới.
