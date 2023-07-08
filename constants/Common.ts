import { Dayjs } from "dayjs";
import { RecoilState, RecoilValueReadOnly } from "recoil";
import { Loan } from "../components/LoanInput";
import { LoanResult } from "./Loan";

export const OVERHEATED_SPECULATION_AREA = ['서초구', '강남구', '용산구'];

export enum ConfirmingLoanBank {
  BUSAN = "부산",
  GYEONG_NAM = "경남",
  NONGHYUP = "농협",
  HANA = "하나",
  JEJU = "제주",
}

export enum PaymentType {
  FIXED = "fixed", // 원리금균등
  FIXED_PRINCIPAL = "fixedPrincipal", // 원금균등
  GRADUAL_INCREASE = "gradualIncrease", // 체증식
}

export interface PricePerSquareMeterType {
  districtName: string;
  price18: number;
  price25: number;
  price34: number;
  districtEngName: string;
}

export enum HousePriceLitmitation {
  DIDIMDOL_ADVANTAGE = 3,
  DIDIMDOL_PRIME = 6,
  DIDIMDOL = 5,
  SPECIAL_HOME = 9,
}

export const PricePerSquareMeter: PricePerSquareMeterType[] = [
  {districtName: "도봉구", price18: 33552.14, price25: 50758.36, price34: 72266.15, districtEngName: "DoBong"},
{districtName: "강북구", price18: 33876.35, price25: 51248.83, price34: 72964.44, districtEngName: "GangBuk"},
{districtName: "금천구", price18: 35059.87, price25: 53039.3, price34: 75513.58, districtEngName: "GeumCheon"},
{districtName: "중랑구", price18: 35715.98, price25: 54031.86, price34: 76926.72, districtEngName: "JungNang"},
{districtName: "구로구", price18: 37351.79, price25: 56506.55, price34: 80450.01, districtEngName: "GuRo"},
{districtName: "노원구", price18: 39017.07, price25: 59025.82, price34: 84036.76, districtEngName: "NoWon"},
{districtName: "관악구", price18: 39397.45, price25: 59601.26, price34: 84856.04, districtEngName: "GwanAk"},
{districtName: "성북구", price18: 39842.61, price25: 60274.72, price34: 85814.86, districtEngName: "SeongBuk"},
{districtName: "은평구", price18: 40491.86, price25: 61256.91, price34: 87213.23, districtEngName: "EunPyeong"},
{districtName: "동대문구", price18: 42183.66, price25: 63816.31, price34: 90857.12, districtEngName: "DongDaeMun"},
{districtName: "서대문구", price18: 43876.82, price25: 66377.76, price34: 94503.93, districtEngName: "SeoDaeMun"},
{districtName: "강서구", price18: 45216.15, price25: 68403.92, price34: 97388.63, districtEngName: "GangSeo"},
{districtName: "중구", price18: 53034.67, price25: 80231.93, price34: 114228.52, districtEngName: "Jung"},
{districtName: "동작구", price18: 53102.05, price25: 80333.87, price34: 114373.65, districtEngName: "DongJak"},
{districtName: "영등포구", price18: 53364.05, price25: 80730.23, price34: 114937.95, districtEngName: "YeongDeungPo"},
{districtName: "종로구", price18: 53623.16, price25: 81122.22, price34: 115496.04, districtEngName: "JongNo"},
{districtName: "강동구", price18: 54057.84, price25: 81779.81, price34: 116432.27, districtEngName: "GangDong"},
{districtName: "양천구", price18: 58144.75, price25: 87962.57, price34: 125234.85, districtEngName: "YangCheon"},
{districtName: "광진구", price18: 58477.93, price25: 88466.6, price34: 125952.45, districtEngName: "GwangJin"},
{districtName: "마포구", price18: 60139.02, price25: 90979.55, price34: 129530.21, districtEngName: "MaPo"},
{districtName: "성동구", price18: 63086.01, price25: 95437.82, price34: 135877.57, districtEngName: "SeongDong"},
{districtName: "송파구", price18: 74773.67, price25: 113119.14, price34: 161050.98, districtEngName: "SongPa"},
{districtName: "용산구", price18: 76917.94, price25: 116363.04, price34: 165669.41, districtEngName: "YongSan"},
{districtName: "서초구", price18: 92598.67, price25: 140085.17, price34: 199443.29, districtEngName: "SeoCho"},
{districtName: "강남구", price18: 101204.14, price25: 153103.71, price34: 217978.16, districtEngName: "GangNam"},

];

export interface FinalResult {
  finalPropertyPrice: number;
  additionalMessage?: string;
}

export interface FinalLoanResult {
  finalLoanResult: Array<LoanResult>;
  finalPropertyPrice: number;
  additionalMessage?: string;
}

export interface KnowingStateType {
  birthday: RecoilState<Dayjs | null>;
  isMarriedValue: RecoilState<string | null>;
  isNewCouple: RecoilState<boolean | null>;
  isFirstTime: RecoilState<boolean>;
  isSpeculationMode: RecoilState<boolean>;
  yearIncome: RecoilState<string>;
  supportAmount: RecoilState<string>;
  depositAmount: RecoilState<string>;
  saveAmount: RecoilState<string>;
  isSingleParent: RecoilState<boolean>;
  isHavingKids: RecoilState<boolean>;
  isDisabled: RecoilState<boolean>;
  isMultiCultural: RecoilState<boolean>;
  havingNoHouse: RecoilState<boolean>;
  useOnlyExtraMoney: RecoilState<boolean>;
  kidsCount: RecoilState<string>;
  monthlySpending: RecoilState<string>;
  residualLoan: RecoilState<Loan[]>;
  borrowingYear: RecoilState<string>;
  confirmingLoanBank: RecoilState<ConfirmingLoanBank>;
  paymentType: RecoilState<PaymentType>;
  useDidimdol: RecoilState<boolean>;
  useSpecialHome: RecoilState<boolean>;
  isMarried: RecoilValueReadOnly<boolean>;
  isAbleDidimdol: RecoilValueReadOnly<boolean>;
  getDidimdolInterest: RecoilValueReadOnly<string | undefined>;
  internationalAge: RecoilValueReadOnly<number>;
  getDidimdolPrimeRate: RecoilValueReadOnly<string>;
  getDidimdolLimit: RecoilValueReadOnly<number>;
  isAbleHomeLoan: RecoilValueReadOnly<boolean>;
  isAbleSpecialHomeLoan: RecoilValueReadOnly<boolean>;
  getSpecialHomeLoanPrimeRate: RecoilValueReadOnly<number>;
  getHomeLoanPrimeRate: RecoilValueReadOnly<string>;
  getSpecialHomeLoanInterest: RecoilValueReadOnly<string | undefined>;
  getHomeLoanInterest: RecoilValueReadOnly<string | undefined>;
  getSpecialHomeLoanLimit: RecoilValueReadOnly<number>;
  getHomeLoanLimit: RecoilValueReadOnly<number>;
  isAbleConfirmingLoan: RecoilValueReadOnly<boolean>;
  getConfirmingLoanInterest: RecoilValueReadOnly<number | undefined>;
  getConfirmingLoanLimit: RecoilValueReadOnly<number>;
  getDsr: RecoilValueReadOnly<number>;
  getLtv: RecoilValueReadOnly<number>;
  getSoulGatheringAmount: RecoilValueReadOnly<number>;
  getMyAsset: RecoilValueReadOnly<number>;
  getMaxPropertyPriceByLTV: RecoilValueReadOnly<string>;
  getDsrLoanResult: RecoilValueReadOnly<Array<LoanResult>>;
  getFinalLoanResult: RecoilValueReadOnly<FinalLoanResult>;
}
