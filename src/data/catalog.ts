// TODO: CẦN XÁC MINH theo nguồn chính thức — mọi phiên bản, giá và thông số dưới đây là dữ liệu mẫu.
export const vehicles = [
  {
    id: "ivory",
    name: "Evo Lite",
    edition: "Urban",
    color: "Trắng ngọc",
    hex: "#e1dfd4",
    image: "/images/scooter-ivory.svg",
    price: 18900000,
    range: 150,
    speed: 49,
    charge: 8,
    city: "TP. Hồ Chí Minh",
    stock: 3,
  },
  {
    id: "graphite",
    name: "Evo Lite",
    edition: "Urban",
    color: "Đen graphite",
    hex: "#42464b",
    image: "/images/scooter-graphite.svg",
    price: 18900000,
    range: 150,
    speed: 49,
    charge: 8,
    city: "Hà Nội",
    stock: 2,
  },
  {
    id: "blue",
    name: "Evo Lite",
    edition: "Signature",
    color: "Xanh cobalt",
    hex: "#344e8e",
    image: "/images/scooter-blue.svg",
    price: 20900000,
    range: 150,
    speed: 49,
    charge: 8,
    city: "Đà Nẵng",
    stock: 1,
  },
];
export type Vehicle = (typeof vehicles)[number];
export const priceFormat = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + " ₫";
export const heroSlides = [
  {
    kicker: "THUẦN ĐIỆN. THUẦN PHONG CÁCH.",
    title: "Định nghĩa lại",
    subtitle: "di chuyển đô thị.",
    description:
      "Công nghệ tiên tiến, thiết kế tinh tế và vận hành êm ái cho mọi hành trình.",
    image: "/images/scooter-ivory.svg",
    label: "Thiết kế gọn nhẹ, thanh lịch",
    color: "Trắng ngọc",
  },
  {
    kicker: "MỘT THIẾT KẾ. NHIỀU CÁ TÍNH.",
    title: "Cá tính của bạn.",
    subtitle: "Dấu ấn riêng.",
    description:
      "Khám phá những sắc màu tối giản, để mỗi hành trình đều mang dấu ấn của bạn.",
    image: "/images/scooter-blue.svg",
    label: "Phiên bản và màu sắc",
    color: "Xanh cobalt",
  },
  {
    kicker: "SẴN SÀNG CHO NGÀY MỚI.",
    title: "Nạp năng lượng.",
    subtitle: "Mở lối tự do.",
    description:
      "Tìm hiểu trải nghiệm pin và sạc, cho nhịp sống đô thị thêm nhẹ nhàng.",
    image: "/images/scooter-graphite.svg",
    label: "Pin và sạc tiện lợi",
    color: "Đen graphite",
  },
];
export const navigation = [
  { label: "Xe", href: "/models" },
  { label: "Mua xe", href: "/inventory" },
  { label: "Dịch vụ", href: "/service" },
  { label: "Khám phá", href: "/models/evo-lite#technology" },
  { label: "Tin tức", href: "/news" },
  { label: "Về chúng tôi", href: "/about" },
];
export const routeInfo: Record<
  string,
  { title: string; description: string; eyebrow: string }
> = {
  models: {
    title: "Một thiết kế. Dấu ấn riêng.",
    description: "Khám phá phiên bản và sắc màu phù hợp với nhịp sống của bạn.",
    eyebrow: "BỘ SƯU TẬP EVO LITE",
  },
  inventory: {
    title: "Hành trình mới, không cần chờ.",
    description:
      "Tìm phiên bản yêu thích tại showroom gần bạn. Tình trạng xe chỉ là dữ liệu mô phỏng.",
    eyebrow: "XE CÓ SẴN · DEMO",
  },
  "test-drive": {
    title: "Trải nghiệm trước. Quyết định sau.",
    description:
      "Cảm nhận Evo Lite trên từng con phố. Đăng ký một buổi lái thử theo cách của bạn.",
    eyebrow: "ĐĂNG KÝ LÁI THỬ",
  },
  service: {
    title: "Chăm sóc từng hành trình.",
    description:
      "Khám phá dịch vụ và mô phỏng đặt lịch chăm sóc xe, đơn giản và chủ động.",
    eyebrow: "DỊCH VỤ & CHĂM SÓC",
  },
  dealers: {
    title: "Gần bạn hơn một hành trình.",
    description:
      "Khám phá hệ thống showroom minh họa và chọn không gian trải nghiệm phù hợp.",
    eyebrow: "TÌM ĐẠI LÝ & ĐIỂM SẠC",
  },
  news: {
    title: "Chuyển động & cảm hứng.",
    description:
      "Những góc nhìn mới về thiết kế, công nghệ và cuộc sống di chuyển bằng điện.",
    eyebrow: "TIN TỨC & SỰ KIỆN",
  },
  about: {
    title: "Chuyển động có ý nghĩa.",
    description:
      "Một ý tưởng showroom cho cuộc sống đô thị hiện đại: tinh gọn hơn, kết nối hơn.",
    eyebrow: "VỀ CHÚNG TÔI",
  },
  careers: {
    title: "Cùng kiến tạo điều tiếp theo.",
    description:
      "Khám phá những vai trò mẫu tại showroom tương lai. Đây không phải thông tin tuyển dụng chính thức.",
    eyebrow: "CƠ HỘI NGHỀ NGHIỆP",
  },
  privacy: {
    title: "Quyền riêng tư của bạn.",
    description:
      "Minh bạch về cách website demo hoạt động và những dữ liệu không được thu thập.",
    eyebrow: "CHÍNH SÁCH BẢO MẬT · DEMO",
  },
  terms: {
    title: "Điều khoản sử dụng.",
    description: "Phạm vi sử dụng và giới hạn của website showroom minh họa.",
    eyebrow: "ĐIỀU KHOẢN · DEMO",
  },
};
