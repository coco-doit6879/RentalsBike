/**
 * Nội dung biên tập mẫu cho giao diện showroom.
 * DEMO ONLY: Không phải thông tin, cam kết hay tuyển dụng chính thức.
 * TODO(verification): Xác minh và phê duyệt mọi nội dung, ngày đăng,
 * địa điểm, giá và điều kiện dịch vụ trước khi xuất bản thực tế.
 */
export type NewsArticle = {
  slug: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
  image: string;
};

export const news: NewsArticle[] = [
  {
    slug: "mot-nhip-di-chuyen-moi",
    category: "Phong cách sống · Demo",
    date: "2026-09-18",
    title: "Một nhịp di chuyển mới cho ngày thường",
    excerpt:
      "Bắt đầu từ những quãng đường quen: một góc phố, một cuộc hẹn và khoảng thời gian dành riêng cho mình. Bài viết minh họa.",
    body: [
      "Đôi khi, thay đổi trải nghiệm di chuyển bắt đầu bằng một thói quen nhỏ: chuẩn bị hành trình từ tối hôm trước, chọn điểm dừng thuận tiện và dành đủ thời gian cho buổi sáng. Trong câu chuyện demo này, chiếc xe chỉ là một phần của nhịp sống đô thị chậm rãi hơn.",
      "Khi cân nhắc một chiếc xe điện, hãy đối chiếu nhu cầu đi lại thực tế với tài liệu của đúng phiên bản xe. Hỏi rõ về điều kiện sạc, hướng dẫn sử dụng và dịch vụ sau bán hàng; không suy ra khả năng vận hành từ hình ảnh minh họa.",
      "Hình ảnh trong bài là tác phẩm vector nguyên bản mô tả một mẫu xe hư cấu, không phải VinFast Evo Lite. Nội dung và ngày đăng đều là dữ liệu mẫu. TODO: Xác minh hướng dẫn sử dụng và biên tập lại với thông tin đã được phê duyệt trước khi công bố.",
    ],
    image: "/images/city.svg",
  },
  {
    slug: "ngon-ngu-cua-nhung-chi-tiet",
    category: "Thiết kế · Demo",
    date: "2026-09-12",
    title: "Ngôn ngữ của những chi tiết nhỏ",
    excerpt:
      "Bề mặt ngà, kim loại xước và những đường nối gọn: một nghiên cứu thị giác nguyên bản cho bản demo showroom.",
    body: [
      "Một tổng thể chỉn chu thường đến từ những chuyển tiếp rất nhỏ: từ bề mặt sơn sang kim loại, từ đường cong thân xe đến nét thẳng của cụm tay lái. Bộ minh họa này khám phá sự tương phản giữa vật liệu sáng và những chi tiết than chì.",
      "Các chi tiết bánh, phanh đĩa, yên và gương được dựng bằng hình học vector để tạo chiều sâu thị giác. Chúng là lựa chọn mỹ thuật cho một thiết kế hư cấu, không phải mô tả cấu tạo, tính năng an toàn hay hiệu suất của sản phẩm thương mại.",
      "TODO: Thay hình ý tưởng bằng tư liệu sản phẩm có quyền sử dụng nếu bài viết chuyển sang giới thiệu xe thật. Đối chiếu tên linh kiện và toàn bộ thông tin kỹ thuật với tài liệu được xác nhận trước khi xuất bản.",
    ],
    image: "/images/detail.svg",
  },
  {
    slug: "khong-gian-cho-mot-cuoc-tro-chuyen",
    category: "Không gian · Demo",
    date: "2026-09-05",
    title: "Một không gian cho những câu hỏi của bạn",
    excerpt:
      "Ý tưởng showroom với ánh sáng dịu, vật liệu trung tính và khoảng trống để quan sát kỹ hơn. Không phải địa điểm thực tế.",
    body: [
      "Không gian trưng bày trong bản demo được hình dung như một studio yên tĩnh: ánh sáng đi qua cửa kính cao, bảng màu trung tính và một bục trưng bày thấp. Mục đích của minh họa là truyền tải nhịp điệu không gian, không khẳng định cơ sở vật chất của bất kỳ đại lý nào.",
      "Trước một buổi tư vấn, bạn có thể chuẩn bị câu hỏi về mục đích sử dụng, lựa chọn phiên bản, cách sạc và các khoản chi phí liên quan. Nếu muốn trải nghiệm xe, hãy xác nhận trước việc có xe, điều kiện tham gia và lịch hẹn với đơn vị vận hành thực tế.",
      "TODO: Xác minh địa chỉ, giờ mở cửa, khả năng hỗ trợ và quy trình đặt lịch trước khi sử dụng nội dung này cho showroom thật. Không xem thông tin demo là thông báo khai trương hoặc xác nhận dịch vụ.",
    ],
    image: "/images/showroom.svg",
  },
];

export const jobs = [
  {
    id: "demo-tu-van-trai-nghiem",
    title: "Tư vấn trải nghiệm khách hàng · Demo",
    department: "Trải nghiệm khách hàng",
    location: "Showroom minh họa · Chưa xác định địa điểm",
    type: "Toàn thời gian · Vị trí mẫu",
    description:
      "Hỗ trợ khách tìm hiểu thông tin đã được xác minh, ghi nhận nhu cầu và phối hợp lịch tư vấn. Đây là vai trò minh họa, không phải tin tuyển dụng đang mở. TODO: Xác minh đơn vị tuyển dụng, địa điểm, yêu cầu và chế độ trước khi công bố.",
  },
  {
    id: "demo-ky-thuat-dich-vu",
    title: "Kỹ thuật viên dịch vụ · Demo",
    department: "Dịch vụ",
    location: "Xưởng minh họa · Chưa xác định địa điểm",
    type: "Toàn thời gian · Vị trí mẫu",
    description:
      "Vai trò mẫu về tiếp nhận tình trạng xe, thực hiện công việc theo quy trình được phê duyệt và bàn giao hồ sơ dịch vụ. Không khẳng định năng lực hay ủy quyền của xưởng. TODO: Xác minh yêu cầu chuyên môn, phạm vi sửa chữa và điều kiện làm việc.",
  },
  {
    id: "demo-dieu-phoi-showroom",
    title: "Điều phối showroom · Demo",
    department: "Vận hành",
    location: "Không gian minh họa · Chưa xác định địa điểm",
    type: "Toàn thời gian · Vị trí mẫu",
    description:
      "Sắp xếp lịch hẹn, theo dõi yêu cầu khách hàng và chuẩn bị không gian đón tiếp trong kịch bản demo. Không phải lời mời ứng tuyển chính thức. TODO: Xác minh mô tả công việc, thông tin liên hệ và chính sách dữ liệu ứng viên.",
  },
];

export const servicePackages = [
  {
    id: "demo-kiem-tra",
    title: "Kiểm tra tổng quan · Demo",
    description:
      "Ví dụ về tiếp nhận tình trạng xe và kiểm tra hạng mục theo hướng dẫn của đúng dòng xe. Phạm vi thực tế cần được tư vấn và xác nhận. TODO: Xác minh danh mục, thời lượng và báo giá.",
    price: "Giá mẫu: 150.000 ₫ · Chưa xác minh",
  },
  {
    id: "demo-cham-soc",
    title: "Chăm sóc ngoại quan · Demo",
    description:
      "Ví dụ về vệ sinh bề mặt và hướng dẫn chăm sóc vật liệu phù hợp. Không bao gồm cam kết xử lý mọi vết xước hoặc hư hại. TODO: Xác minh quy trình, vật tư, thuế và phạm vi dịch vụ.",
    price: "Giá mẫu: 250.000 ₫ · Chưa xác minh",
  },
  {
    id: "demo-tu-van-su-dung",
    title: "Tư vấn sử dụng · Demo",
    description:
      "Ví dụ về buổi hướng dẫn đọc tài liệu xe, lập lịch chăm sóc và chuẩn bị câu hỏi sử dụng. Không thay thế tài liệu an toàn của nhà sản xuất. TODO: Xác minh khả năng cung cấp, nội dung và mức phí.",
    price: "Giá mẫu: 100.000 ₫ · Chưa xác minh",
  },
];

export const faqs = [
  {
    question: "Các gói dịch vụ và mức giá này đã áp dụng chưa?",
    answer:
      "Chưa. Đây là dữ liệu demo để minh họa giao diện, không phải bảng giá hay đề nghị cung cấp dịch vụ. TODO: Xác minh đơn vị thực hiện, phạm vi, thuế, vật tư và báo giá trước khi sử dụng thực tế.",
  },
  {
    question: "Tôi cần chuẩn bị gì khi muốn đặt lịch dịch vụ?",
    answer:
      "Trong kịch bản mẫu, bạn có thể cung cấp dòng xe, tình trạng cần hỗ trợ và thời gian mong muốn. Không gửi thông tin nhạy cảm không cần thiết. Lịch chỉ có hiệu lực sau khi đơn vị thực tế xác nhận. TODO: Xác minh kênh tiếp nhận và chính sách dữ liệu.",
  },
  {
    question: "Showroom có thực hiện bảo hành chính hãng không?",
    answer:
      "Bản demo không xác nhận tư cách đại lý, ủy quyền dịch vụ hay điều kiện bảo hành. Hãy kiểm tra với nhà sản xuất hoặc đơn vị được xác nhận trước khi mang xe đến. TODO: Xác minh giấy tờ ủy quyền và chính sách áp dụng cho đúng xe.",
  },
  {
    question: "Ảnh xe trên website có phải VinFast Evo Lite không?",
    answer:
      "Không. Tất cả ảnh SVG là thiết kế ý tưởng nguyên bản của một mẫu xe hư cấu, không phải ảnh chính thức, không mô phỏng chính xác Evo Lite và không thể dùng để suy ra thông số, trang bị hoặc màu sản phẩm thật.",
  },
  {
    question: "Bao lâu cần kiểm tra hoặc bảo dưỡng xe?",
    answer:
      "Hãy tham khảo tài liệu của đúng mẫu xe, điều kiện sử dụng và tư vấn của đơn vị đủ thẩm quyền. Bản demo không đưa ra chu kỳ bảo dưỡng chung hay hướng dẫn sửa chữa. TODO: Chỉ bổ sung mốc thời gian sau khi xác minh tài liệu liên quan.",
  },
];
