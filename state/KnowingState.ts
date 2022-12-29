import { atom, selector } from "recoil";
import RecoilKey from "../constants/recoilKey";
import { Dayjs } from "dayjs";
import {
  ConfirmingLoanInterests,
  DidimdolInterests,
} from "../constants/Interests";
import { Loan } from "../components/LoanInput";
import { ConfirmingLoanBank } from "../constants/Common";

export const KnowingState = {
  birthday: atom<Dayjs | null>({
    key: RecoilKey.knowing["KNOWING/birthday"],
    default: null,
  }),
  isMarriedValue: atom<string | null>({
    key: RecoilKey.knowing["KNOWING/isMarriedValue"],
    default: null,
  }),
  isNewCouple: atom<boolean | null>({
    key: RecoilKey.knowing["KNOWING/isNewCouple"],
    default: null,
  }),
  isFirstTime: atom<boolean>({
    key: RecoilKey.knowing["KNOWING/isFirstTime"],
    default: true,
  }),

  yearIncome: atom<string>({
    key: RecoilKey.knowing["KNOWING/yearIncome"],
    default: "",
  }),
  supportAmount: atom<string>({
    key: RecoilKey.knowing["KNOWING/supportAmount"],
    default: "",
  }),
  depositAmount: atom<string>({
    key: RecoilKey.knowing["KNOWING/depositAmount"],
    default: "",
  }),

  isSingleParent: atom<boolean>({
    key: RecoilKey.knowing["KNOWING/isSingleParent"],
    default: false,
  }),
  isHavingKids: atom<boolean>({
    key: RecoilKey.knowing["KNOWING/isHavingKids"],
    default: false,
  }),
  isDisabled: atom<boolean>({
    key: RecoilKey.knowing["KNOWING/isDisabled"],
    default: false,
  }),
  isMultiCultural: atom<boolean>({
    key: RecoilKey.knowing["KNOWING/isMultiCultural"],
    default: false,
  }),
  havingNoHouse: atom<boolean>({
    key: RecoilKey.knowing["KNOWING/havingNoHouse"],
    default: true,
  }),

  kidsCount: atom<string>({
    key: RecoilKey.knowing["KNOWING/kidsCount"],
    default: "",
  }),

  monthlySpending: atom<string>({
    key: RecoilKey.knowing["KNOWING/monthlySpending"],
    default: "",
  }),
  residualLoan: atom<Loan[]>({
    key: RecoilKey.knowing["KNOWING/residualLoan"],
    default: [],
  }),
  borrowingYear: atom<string>({
    key: RecoilKey.knowing["KNOWING/borrowingYear"],
    default: "10",
  }),
  confirmingLoanBank: atom<ConfirmingLoanBank>({
    key: RecoilKey.knowing["KNOWING/confirmingLoanBank"],
    default: ConfirmingLoanBank.GYEONG_NAM,
  }),

  isMarried: selector<boolean>({
    key: RecoilKey.knowing["KNOWING/isMarried"],
    get: ({ get }) => {
      const isMarriedValue = get(KnowingState.isMarriedValue);
      if (isMarriedValue === "married") {
        return true;
      } else {
        return false;
      }
    },
  }),

  isAbleDidimdol: selector<boolean>({
    key: RecoilKey.knowing["KNOWING/isAbleDidimdol"],
    get: ({ get }) => {
      let result = false;
      const yearIncome = Number.parseInt(get(KnowingState.yearIncome));
      const isMarried = get(KnowingState.isMarried);
      const isHavingKids = get(KnowingState.isHavingKids);
      const isNewCouple = get(KnowingState.isNewCouple);
      if (
        yearIncome <= 6000 ||
        (((isMarried && isHavingKids) || (isMarried && isNewCouple)) &&
          yearIncome <= 7000)
      ) {
        result = true;
      }
      return result;
    },
  }),

  getDidimdolInterest: selector<number | undefined>({
    key: RecoilKey.knowing["KNOWING/getDidimdolInterest"],
    get: ({ get }) => {
      let result: number | undefined = undefined;
      const yearIncome = Number.parseInt(get(KnowingState.yearIncome));
      const isAbleDidimdol = get(KnowingState.isAbleDidimdol);
      const getDidimdolPrimeRate: number = get(
        KnowingState.getDidimdolPrimeRate
      );
      const borrowingYear: string = get(KnowingState.borrowingYear);

      if (isAbleDidimdol) {
        if (yearIncome <= 2000) {
          result = DidimdolInterests.LOWER_TWO_THOUSAND[borrowingYear];
        } else if (yearIncome <= 4000) {
          result = DidimdolInterests.LOWER_FOUR_THOUSANDS[borrowingYear];
        } else {
          result = DidimdolInterests.LOWER_SIX_THOUSANDS[borrowingYear];
        }
        result -= getDidimdolPrimeRate;

        if (result < 1.5) {
          result = 1.5;
        }
      }
      return result?.toFixed(2);
    },
  }),

  internationalAge: selector<number>({
    key: RecoilKey.knowing["KNOWING/internationalAge"],
    get: ({ get }) => {
      const birthday = new Date(get(KnowingState.birthday));
      const today = new Date();

      let age = today.getFullYear() - birthday.getFullYear();
      const m = today.getMonth() - birthday.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
      }

      return age;
    },
  }),

  // 다자녀 0.7 / 연소득6천이하 한부모가구 0.5/ 2자녀 가구 0.5/ 1자녀 가구 0.3/
  // 다문화가구 및 장애인가구, 생애최초 주택구입자, 신혼가구는 0.2
  getDidimdolPrimeRate: selector<number>({
    key: RecoilKey.knowing["KNOWING/getDidimdolPrimeRate"],
    get: ({ get }) => {
      let result = 0;
      const isAbleDidimdol = get(KnowingState.isAbleDidimdol);
      const isMarried = get(KnowingState.isMarried);
      const isHavingKids = get(KnowingState.isHavingKids);
      const isNewCouple = get(KnowingState.isNewCouple);
      const kidsCount = Number.parseInt(get(KnowingState.kidsCount));
      const yearIncome = Number.parseInt(get(KnowingState.yearIncome));
      const isSingleParent = get(KnowingState.isSingleParent);
      const isFirstTime = get(KnowingState.isFirstTime);
      const isMultiCultural = get(KnowingState.isMultiCultural);
      const isDisabled = get(KnowingState.isDisabled);

      if (isAbleDidimdol) {
        if (isMarried && isHavingKids) {
          if (kidsCount === 1) {
            result += 0.3;
          } else if (kidsCount === 2) {
            result += 0.5;
          } else if (kidsCount > 2) {
            result += 0.7;
          }
        }

        if (yearIncome <= 6000 && isSingleParent) {
          result += 0.5;
        } else if (isMarried && isNewCouple) {
          result += 0.2;
        } else if (isFirstTime) {
          result += 0.2;
        } else if (isMultiCultural) {
          result += 0.2;
        } else if (isDisabled) {
          result += 0.2;
        }
      }
      return result.toFixed(2);
    },
  }),

  //   - 대출한도 최대 2.5억/ 최대 dti 60%, ltv 70%
  // - 신혼 2.7억/ 2자녀이상은 3.1억/ 만 30세 이상의 미혼 단독세대주는 1.5억 제한
  getDidimdolLimit: selector<number>({
    key: RecoilKey.knowing["KNOWING/getDidimdolLimit"],
    get: ({ get }) => {
      let result = 0;
      const isAbleDidimdol = get(KnowingState.isAbleDidimdol);
      const isMarried = get(KnowingState.isMarried);
      const isHavingKids = get(KnowingState.isHavingKids);
      const isNewCouple = get(KnowingState.isNewCouple);
      const kidsCount = Number.parseInt(get(KnowingState.kidsCount));
      const internationalAge: number = get(KnowingState.internationalAge);

      if (isAbleDidimdol) {
        result = 2.5;
        if (isMarried && isHavingKids && kidsCount >= 2) {
          result += 0.6;
        } else if (isMarried && isNewCouple) {
          result += 0.2;
        } else if (internationalAge >= 30 && !isMarried) {
          result -= 1;
        }
      }
      return result;
    },
  }),

  isAbleConfirmingLoan: selector<boolean>({
    key: RecoilKey.knowing["KNOWING/isAbleConfirmingLoan"],
    get: ({ get }) => {
      let result = false;
      const internationalAge: number = get(KnowingState.internationalAge);

      if (internationalAge >= 19) {
        result = true;
      }
      return result;
    },
  }),

  getConfirmingLoanInterest: selector<number | undefined>({
    key: RecoilKey.knowing["KNOWING/getConfirmingLoanInterest"],
    get: ({ get }) => {
      let result: number | undefined = undefined;
      const isAbleConfirmingLoan = get(KnowingState.isAbleConfirmingLoan);
      const borrowingYear: string = get(KnowingState.borrowingYear);
      const confirmingLoanBank: ConfirmingLoanBank = get(
        KnowingState.confirmingLoanBank
      );

      if (isAbleConfirmingLoan) {
        result = ConfirmingLoanInterests[confirmingLoanBank][borrowingYear];
      }

      return result;
    },
  }),

  getConfirmingLoanLimit: selector<number>({
    key: RecoilKey.knowing["KNOWING/getConfirmingLoanLimit"],
    get: ({ get }) => {
      const result = 5;
      return result;
    },
  }),

  getDsr: selector<number>({
    key: RecoilKey.knowing["KNOWING/getDsr"],
    get: ({ get }) => {
      const result = 0.4;
      return result;
    },
  }),

  getSoulGatheringAmount: selector<number>({
    key: RecoilKey.knowing["KNOWING/getSoulGatheringAmount"],
    get: ({ get }) => {
      const yearIncome = Number.parseInt(get(KnowingState.yearIncome));
      const DSR: number = get(KnowingState.getDsr);

      return yearIncome * DSR;
    },
  }),
};
