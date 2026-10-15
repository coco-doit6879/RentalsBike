export type Dealer = {
  id: string;
  name: string;
  province: string;
  address: string;
  hours: string;
};

// TODO: verify every showroom, address and opening hour before a production launch.
// These are invented demonstration records, not an official dealer directory.
export const dealers: Dealer[] = [
  {
    id: "ha-noi-demo",
    name: "Showroom Hà Nội — Demo",
    province: "Hà Nội",
    address: "Địa chỉ minh họa — khu vực trung tâm Hà Nội",
    hours: "Giờ minh họa: 08:30–18:00",
  },
  {
    id: "da-nang-demo",
    name: "Showroom Đà Nẵng — Demo",
    province: "Đà Nẵng",
    address: "Địa chỉ minh họa — khu vực trung tâm Đà Nẵng",
    hours: "Giờ minh họa: 08:30–18:00",
  },
  {
    id: "ho-chi-minh-demo",
    name: "Showroom TP. Hồ Chí Minh — Demo",
    province: "TP. Hồ Chí Minh",
    address: "Địa chỉ minh họa — khu vực trung tâm TP. Hồ Chí Minh",
    hours: "Giờ minh họa: 08:30–18:00",
  },
];
