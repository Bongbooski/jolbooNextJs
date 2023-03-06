export enum ConfirmingLoanBank {
  BUSAN = "부산",
  GYEONG_NAM = "경남",
  NONGHYUP = "농협",
  HANA = "하나",
  JEJU = "제주",
}

export interface PricePerSquareMeterType {
  districtName: string;
  price25: number;
  price34: number;
  districtEngName: string;
}

export const PricePerSquareMeter: PricePerSquareMeterType[] = [
  {
    districtName: "도봉구",
    price25: 54315.99,
    price34: 77331.24,
    districtEngName: "DoBong",
  },
  {
    districtName: "강북구",
    price25: 55100.69,
    price34: 78448.44,
    districtEngName: "GangBuk",
  },
  {
    districtName: "금천구",
    price25: 55119.57,
    price34: 78475.32,
    districtEngName: "GeumCheon",
  },
  {
    districtName: "중랑구",
    price25: 56824.67,
    price34: 80902.92,
    districtEngName: "JungNang",
  },
  {
    districtName: "구로구",
    price25: 60422.4899999999,
    price34: 86025.24,
    districtEngName: "GuRo",
  },
  {
    districtName: "관악구",
    price25: 62629.68,
    price34: 89167.68,
    districtEngName: "GwanAk",
  },
  {
    districtName: "노원구",
    price25: 63029.7,
    price34: 89737.2,
    districtEngName: "NoWon",
  },
  {
    districtName: "성북구",
    price25: 63792.57,
    price34: 90823.32,
    districtEngName: "SeongBuk",
  },
  {
    districtName: "은평구",
    price25: 64258.67,
    price34: 91486.92,
    districtEngName: "EunPyeong",
  },
  {
    districtName: "동대문구",
    price25: 67612.82,
    price34: 96262.32,
    districtEngName: "DongDaeMun",
  },
  {
    districtName: "서대문구",
    price25: 70514.44,
    price34: 100393.44,
    districtEngName: "SeoDaeMun",
  },
  {
    districtName: "강서구",
    price25: 72584.75,
    price34: 103341,
    districtEngName: "GangSeo",
  },
  {
    districtName: "중구",
    price25: 83532.79,
    price34: 118928.04,
    districtEngName: "Jung",
  },
  {
    districtName: "영등포구",
    price25: 83864.37,
    price34: 119400.12,
    districtEngName: "YeongDeungPo",
  },
  {
    districtName: "강동구",
    price25: 84258.49,
    price34: 119961.24,
    districtEngName: "GangDong",
  },
  {
    districtName: "종로구",
    price25: 85266.8,
    price34: 121396.8,
    districtEngName: "JongNo",
  },
  {
    districtName: "동작구",
    price25: 85727,
    price34: 122052,
    districtEngName: "DongJak",
  },
  {
    districtName: "양천구",
    price25: 89780.89,
    price34: 127823.64,
    districtEngName: "YangCheon",
  },
  {
    districtName: "광진구",
    price25: 92995.8,
    price34: 132400.8,
    districtEngName: "GwangJin",
  },
  {
    districtName: "마포구",
    price25: 94390.56,
    price34: 134386.56,
    districtEngName: "MaPo",
  },
  {
    districtName: "성동구",
    price25: 101041.63,
    price34: 143855.88,
    districtEngName: "SeongDong",
  },
  {
    districtName: "송파구",
    price25: 113694.77,
    price34: 161870.52,
    districtEngName: "SongPa",
  },
  {
    districtName: "용산구",
    price25: 119090.32,
    price34: 169552.32,
    districtEngName: "YongSan",
  },
  {
    districtName: "서초구",
    price25: 152959.86,
    price34: 217773.36,
    districtEngName: "SeoCho",
  },
  {
    districtName: "강남구",
    price25: 156035.53,
    price34: 222152.28,
    districtEngName: "GangNam",
  },
];
