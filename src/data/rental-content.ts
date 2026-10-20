// TODO: CẦN XÁC MINH điểm nhận, ảnh và thông tin kinh doanh trước khi công bố.
export const rentalRoutes: Record<
  string,
  { vi: string; en: string; descriptionVi: string; descriptionEn: string }
> = {
  pricing: {
    vi: "Bảng giá cho hành trình của bạn.",
    en: "Rental rates for your journey.",
    descriptionVi:
      "Chọn gói từ 3 ngày đến một năm. Giá thuê và điều kiện theo bảng giá đã cung cấp.",
    descriptionEn:
      "Choose a rental package from three days to one year. Rates and conditions follow the supplied rate sheet.",
  },
  models: {
    vi: "Chọn xe cho hành trình của bạn.",
    en: "Your next ride starts here.",
    descriptionVi:
      "Khám phá xe điện cho thuê. Giá và tình trạng thực tế được xác nhận sau khi bạn gửi yêu cầu.",
    descriptionEn:
      "Explore electric scooters for rent. Actual rates and availability are confirmed after your enquiry.",
  },
  rent: {
    vi: "Hành trình mới, bắt đầu từ đây.",
    en: "A new journey starts here.",
    descriptionVi:
      "Chọn xe, thời gian và điểm nhận mong muốn. Chúng tôi sẽ tiếp nhận yêu cầu và liên hệ xác nhận.",
    descriptionEn:
      "Choose your scooter, dates and preferred pickup location. Your enquiry will be saved for the rental team to review.",
  },
  "how-it-works": {
    vi: "Thuê xe theo cách đơn giản hơn.",
    en: "A simpler way to rent.",
    descriptionVi:
      "Từ chọn xe đến nhận xe: thông tin rõ ràng, lựa chọn chủ động.",
    descriptionEn:
      "From choosing a scooter to pickup: clear information, considered choices.",
  },
  locations: {
    vi: "Điểm nhận xe tại TP. Hồ Chí Minh.",
    en: "Pickup location in Ho Chi Minh City.",
    descriptionVi:
      "Dịch vụ cho thuê xe phục vụ tại Khu đô thị Vinhomes Grand Park, TP. Thủ Đức, TP. Hồ Chí Minh.",
    descriptionEn:
      "Rental service is available at Vinhomes Grand Park, Thu Duc City, Ho Chi Minh City.",
  },
  about: {
    vi: "Tự do khám phá, nhẹ nhàng di chuyển.",
    en: "Explore freely. Travel lightly.",
    descriptionVi:
      "Một trải nghiệm thuê xe điện tinh gọn dành cho người Việt và khách quốc tế.",
    descriptionEn:
      "A considered electric scooter rental experience for Vietnamese and international visitors.",
  },
  privacy: {
    vi: "Quyền riêng tư của bạn.",
    en: "Your privacy matters.",
    descriptionVi:
      "Thông tin về dữ liệu yêu cầu thuê xe và cách hệ thống sử dụng dữ liệu.",
    descriptionEn:
      "How rental enquiry information is collected and used by this system.",
  },
  terms: {
    vi: "Điều kiện thuê & sử dụng.",
    en: "Rental & website terms.",
    descriptionVi:
      "Gửi yêu cầu không phải xác nhận thuê xe hay giao dịch thanh toán.",
    descriptionEn:
      "Submitting an enquiry is not a confirmed booking or payment transaction.",
  },
};
export const pickupLocations = [
  {
    id: "hcm",
    vi: "Vinhomes Grand Park — TP. Hồ Chí Minh",
    en: "Vinhomes Grand Park — Ho Chi Minh City",
  },
];
export const rentalSteps = [
  {
    vi: "Chọn chiếc xe của bạn",
    en: "Choose your scooter",
    textVi:
      "Khám phá mẫu xe, màu sắc và thông tin tham khảo trước khi gửi yêu cầu.",
    textEn:
      "Explore scooters, colours and reference information before making an enquiry.",
  },
  {
    vi: "Gửi yêu cầu thuê",
    en: "Send a rental enquiry",
    textVi: "Chọn ngày nhận, ngày trả, điểm nhận và để lại thông tin liên hệ.",
    textEn:
      "Choose pickup and return dates, a location and your contact details.",
  },
  {
    vi: "Trao đổi & xác nhận",
    en: "Discuss & confirm",
    textVi:
      "Đội ngũ cho thuê kiểm tra tình trạng xe, báo giá và thống nhất điều kiện trước khi xác nhận.",
    textEn:
      "The team checks availability, provides a quote and agrees rental terms before confirming.",
  },
];
export const rentalFaqs = [
  {
    vi: "Gửi form có nghĩa là đã giữ xe chưa?",
    en: "Does submitting the form reserve a scooter?",
    textVi:
      "Chưa. Đây là yêu cầu tư vấn thuê xe. Chỉ có xác nhận riêng của đơn vị cho thuê mới xác lập lịch nhận xe.",
    textEn:
      "No. This is a rental enquiry. A separate confirmation from the rental team is required to arrange pickup.",
  },
  {
    vi: "Giá thuê và tiền cọc được tính thế nào?",
    en: "What are the rental rates and deposit?",
    textVi:
      "Giá thuê từ 400.000đ/3 ngày, có các gói tuần, tháng và năm. Cọc 1.000.000đ; bảng giá ghi hoàn khi kết thúc hợp đồng. Phí trả trễ 100.000đ giờ đầu, 50.000đ mỗi giờ tiếp theo. Cần xác nhận điều kiện hoàn cọc và thời gian lẻ trước khi thuê.",
    textEn:
      "Rates start at 400,000 VND/3 days, with weekly, monthly and yearly packages. The deposit is 1,000,000 VND, stated refundable at contract end. Late fees are 100,000 VND for the first hour and 50,000 VND per subsequent hour. Confirm refund conditions and partial periods before renting.",
  },
  {
    vi: "Khách nước ngoài có thể đăng ký không?",
    en: "Can international visitors send an enquiry?",
    textVi:
      "Có. Chọn English và nhập email hoặc số điện thoại/WhatsApp có mã quốc gia. Điều kiện giấy tờ và quyền điều khiển xe sẽ được kiểm tra trước khi thuê.",
    textEn:
      "Yes. Choose English and enter your email and an international phone/WhatsApp number. Documents and legal eligibility to ride must be checked before rental.",
  },
  {
    vi: "Tôi cần chuẩn bị giấy tờ gì?",
    en: "Which documents will I need?",
    textVi:
      "Yêu cầu giấy tờ phụ thuộc xe, quy định pháp luật và chính sách của đơn vị cho thuê. Không gửi ảnh hộ chiếu hoặc giấy tờ nhạy cảm trong form này.",
    textEn:
      "Required documents depend on the vehicle, applicable law and rental provider policies. Do not submit passport images or sensitive documents through this form.",
  },
];
export const rentalPrivacy = [
  {
    vi: "Thông tin được thu thập",
    en: "Information collected",
    textVi:
      "Khi gửi yêu cầu, hệ thống lưu họ tên, email, số điện thoại/WhatsApp, xe quan tâm, ngày nhận–trả, khu vực nhận, ghi chú và ngôn ngữ liên hệ trong cơ sở dữ liệu của website. Không có thanh toán hoặc tải giấy tờ tùy thân.",
    textEn:
      "When you submit an enquiry, this website stores your name, email, phone/WhatsApp number, scooter preference, pickup/return dates, pickup area, note and language in its database. There are no payments or identity-document uploads.",
  },
  {
    vi: "Mục đích và quyền truy cập",
    en: "Purpose and access",
    textVi:
      "Thông tin dùng để quản lý và liên hệ về yêu cầu thuê. Trang quản trị yêu cầu đăng nhập; dữ liệu không được công bố trong danh sách công khai. Website chưa gửi email/SMS tự động.",
    textEn:
      "Information is used to manage and respond to rental enquiries. The admin area requires authentication; enquiries are not publicly listed. Automated emails and SMS are not enabled.",
  },
  {
    vi: "Trình duyệt và phiên đăng nhập",
    en: "Browser storage and sessions",
    textVi:
      "Trình duyệt nhớ lựa chọn ngôn ngữ và thông báo quyền riêng tư. Không lưu dữ liệu form trong localStorage. Phiên quản trị dùng cookie HttpOnly và hết hạn; không có quảng cáo hoặc analytics bên thứ ba.",
    textEn:
      "Your browser remembers language and privacy notice preferences. Form data is not stored in localStorage. Admin sessions use an expiring HttpOnly cookie. There are no third-party ads or analytics.",
  },
  {
    vi: "Quyền của bạn và vận hành chính thức",
    en: "Your rights and public operation",
    textVi:
      "Bạn có thể liên hệ đơn vị vận hành để yêu cầu truy cập, sửa hoặc xóa thông tin. Thông tin pháp nhân, email hỗ trợ, thời hạn lưu dữ liệu và quy trình thực hiện quyền chưa được cấu hình; cần hoàn thiện và rà soát pháp lý trước khi mở nhận thông tin khách hàng thật trên Internet. Khi thử bản local, dùng dữ liệu thử nghiệm.",
    textEn:
      "You may contact the operator to request access, correction or deletion. Legal entity details, support contact, data retention and rights procedures are not configured yet and must be finalised with legal review before collecting real customer information publicly. Use test data in the local preview.",
  },
];
