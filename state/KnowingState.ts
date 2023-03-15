import { atom, selector } from "recoil";
import RecoilKey from "../constants/recoilKey";
import dayjs, { Dayjs } from "dayjs";
import {
  ConfirmingLoanInterests,
  DidimdolInterests,
  HomeLoanInterests,
  NormalLoanInterest,
  SpecialHomeLoanInterests,
} from "../constants/Interests";
import { Loan } from "../components/LoanInput";
import {
  ConfirmingLoanBank,
  FinalLoanResult,
  FinalResult,
  PaymentType,
} from "../constants/Common";
import { LoanResult, LoanType } from "../constants/Loan";
import {
  calculateFixedPaymentLoanAmountByMonth,
  calculateFixedPrincipalPaymentLoanAmountFirstMonth,
  getPrincipalAndInterest,
  getPrincipalAndInterestInSoulGathering,
} from "../utils/CommonUtils";

export const KnowingState = {
  birthday: atom<Dayjs | null>({
    key: RecoilKey.knowing["KNOWING/birthday"],
    default: dayjs("1988-04-18", "YYYY-MM-DD"),
  }),
  isMarriedValue: atom<string | null>({
    key: RecoilKey.knowing["KNOWING/isMarriedValue"],
    default: "married",
  }),
  isNewCouple: atom<boolean | null>({
    key: RecoilKey.knowing["KNOWING/isNewCouple"],
    default: false,
  }),
  isFirstTime: atom<boolean>({
    key: RecoilKey.knowing["KNOWING/isFirstTime"],
    default: true,
  }),

  yearIncome: atom<string>({
    key: RecoilKey.knowing["KNOWING/yearIncome"],
    default: "0",
  }),
  supportAmount: atom<string>({
    key: RecoilKey.knowing["KNOWING/supportAmount"],
    default: "0",
  }),
  depositAmount: atom<string>({
    key: RecoilKey.knowing["KNOWING/depositAmount"],
    default: "0",
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
  paymentType: atom<PaymentType>({
    key: RecoilKey.knowing["KNOWING/paymentType"],
    default: PaymentType.FIXED,
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

  getDidimdolInterest: selector<string | undefined>({
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
  getDidimdolPrimeRate: selector<string>({
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

  // 1주택 이하
  // 신혼 N, 자녀수 0이면 소득 7천 이하
  // 신혼 N, 자녀수 1이면 소득 8천이하
  // 자녀 2 이면 9천이하
  // 자녀 3 이상, 1억이하
  // 신혼 Y, 자녀수 0이면 소득 8500 이하
  // 신혼 Y, 자녀수 1이면 소득 8500 이하
  isAbleHomeLoan: selector<boolean>({
    key: RecoilKey.knowing["KNOWING/isAbleHomeLoan"],
    get: ({ get }) => {
      let result = false;

      const yearIncome = Number.parseInt(get(KnowingState.yearIncome));
      const isNewCouple = get(KnowingState.isNewCouple);
      const isHavingKids = get(KnowingState.isHavingKids);
      const kidsCount = Number.parseInt(get(KnowingState.kidsCount));

      if (
        (!isNewCouple && !isHavingKids && yearIncome <= 7000) ||
        (!isNewCouple &&
          isHavingKids &&
          kidsCount === 1 &&
          yearIncome <= 8000) ||
        (kidsCount === 2 && yearIncome <= 9000) ||
        (kidsCount === 3 && yearIncome <= 10000) ||
        (isNewCouple && yearIncome <= 8500)
      ) {
        result = true;
      }
      return result;
    },
  }),

  isAbleSpecialHomeLoan: selector<boolean>({
    key: RecoilKey.knowing["KNOWING/isAbleSpecialHomeLoan"],
    get: ({ get }) => {
      return true;
    },
  }),

  // 일반형(주택가격 6억이상 or 소득 1억이상)
  // 아낌e : 0.1

  // 우대형(주택가격 6억이하 and 소득 1억이하)
  // 아낌e : 0.1
  // 저소득청년 (6천이하 and 만39세 이하) : 0.1
  // 사회적배려층(한부모, 장애인, 다문화, 다자녀) (6천이하(다자녀는 7천이하)) : 0.4
  // 신혼가구(7천이하) : 0.2
  // 미분양주택(8천이하) : 0.2
  // 중복적용가능, 최대 0.8%
  getSpecialHomeLoanPrimeRate: selector<number>({
    key: RecoilKey.knowing["KNOWING/getSpecialHomeLoanPrimeRate"],
    get: ({ get }) => {
      let result = 0;
      const housePrice = 50000; //TODO: 임시로 5억으로 설정, 추후 재계산시 결과로 나온 집값 넣기
      const isSingleParent = get(KnowingState.isSingleParent);
      const isDisabled = get(KnowingState.isDisabled);
      const isMultiCultural = get(KnowingState.isMultiCultural);

      const isMarried = get(KnowingState.isMarried);
      const isNewCouple = get(KnowingState.isNewCouple);
      const isHavingKids = get(KnowingState.isHavingKids);
      const kidsCount = Number.parseInt(get(KnowingState.kidsCount));
      const yearIncome = Number.parseInt(get(KnowingState.yearIncome));

      const internationalAge: number = get(KnowingState.internationalAge);

      if (housePrice >= 60000 || yearIncome >= 10000) {
        // 일반형
        result += 0.1; //TODO: 아낌e로 한다고 가정함. 추후 해당 부분 어떻게 ui에 넣을지 확인 필요
      } else {
        // 우대형
        result += 0.1;

        if (yearIncome <= 6000 && internationalAge <= 39) {
          result += 0.1;
        }

        if (
          ((isSingleParent || isDisabled || isMultiCultural) &&
            yearIncome <= 6000) ||
          (isHavingKids && kidsCount > 2 && yearIncome <= 7000)
        ) {
          result += 0.4;
        }

        if (isNewCouple && yearIncome <= 7000) {
          result += 0.2;
        }

        // TODO: 미분양주택 && 8천이하 어떻게 할지 확인 필요
      }
      return Math.min(result, 0.8);
    },
  }),

  // 0.4 : 한부모, 장애인, 다문화, 자녀 >= 3 && 소득 <= 7천
  // 0.2 : 결혼 Y && 소득 <= 7천
  // 0.1 : 소득 <= 4500
  getHomeLoanPrimeRate: selector<string>({
    key: RecoilKey.knowing["KNOWING/getHomeLoanPrimeRate"],
    get: ({ get }) => {
      let result = 0;

      const isSingleParent = get(KnowingState.isSingleParent);
      const isDisabled = get(KnowingState.isDisabled);
      const isMultiCultural = get(KnowingState.isMultiCultural);

      const isMarried = get(KnowingState.isMarried);
      const isHavingKids = get(KnowingState.isHavingKids);
      const kidsCount = Number.parseInt(get(KnowingState.kidsCount));
      const yearIncome = Number.parseInt(get(KnowingState.yearIncome));

      let fourPrimeRateCount = 0;
      let twoPrimeRateCount = 0;
      let onePrimeRateCount = 0;

      if (isSingleParent) {
        fourPrimeRateCount++;
      }

      if (isDisabled) {
        fourPrimeRateCount++;
      }

      if (isMultiCultural) {
        fourPrimeRateCount++;
      }

      if (isHavingKids && kidsCount >= 3 && yearIncome <= 7000) {
        fourPrimeRateCount++;
      }

      if (isMarried && yearIncome <= 7000) {
        twoPrimeRateCount++;
      }

      if (yearIncome <= 4500) {
        onePrimeRateCount++;
      }

      if (fourPrimeRateCount >= 2) {
        result = 0.8;
      } else if (fourPrimeRateCount === 1 && twoPrimeRateCount === 1) {
        result = 0.6;
      } else if (fourPrimeRateCount === 1 && onePrimeRateCount == 1) {
        result = 0.5;
      } else if (
        fourPrimeRateCount === 1 &&
        twoPrimeRateCount === 0 &&
        onePrimeRateCount === 0
      ) {
        result = 0.4;
      } else if (twoPrimeRateCount === 1 && onePrimeRateCount === 1) {
        result = 0.3;
      } else if (twoPrimeRateCount === 1 && onePrimeRateCount === 0) {
        result = 0.2;
      } else if (onePrimeRateCount === 1) {
        result = 0.1;
      } else {
        result = 0;
      }

      return result.toFixed(2);
    },
  }),

  getSpecialHomeLoanInterest: selector<string | undefined>({
    key: RecoilKey.knowing["KNOWING/getSpecialHomeLoanInterest"],
    get: ({ get }) => {
      let result: number | undefined = undefined;
      const isAbleSpecialHomeLoan = get(KnowingState.isAbleSpecialHomeLoan);
      const getSpecialHomeLoanPrimeRate: number = get(
        KnowingState.getSpecialHomeLoanPrimeRate
      );
      const borrowingYear: string = get(KnowingState.borrowingYear);
      const yearIncome = Number.parseInt(get(KnowingState.yearIncome));

      if (isAbleSpecialHomeLoan) {
        if (yearIncome <= 10000) {
          // 우대형
          result =
            SpecialHomeLoanInterests.PRIME[borrowingYear] -
            getSpecialHomeLoanPrimeRate;
        } else {
          result =
            SpecialHomeLoanInterests.NORMAL[borrowingYear] -
            getSpecialHomeLoanPrimeRate;
        }
      }

      return result?.toFixed(2);
    },
  }),

  getHomeLoanInterest: selector<string | undefined>({
    key: RecoilKey.knowing["KNOWING/getHomeLoanInterest"],
    get: ({ get }) => {
      let result: number | undefined = undefined;
      const isAbleHomeLoan = get(KnowingState.isAbleHomeLoan);
      const getHomeLoanPrimeRate: number = get(
        KnowingState.getHomeLoanPrimeRate
      );
      const borrowingYear: string = get(KnowingState.borrowingYear);

      if (isAbleHomeLoan) {
        result =
          HomeLoanInterests.U_HOME_LOAN[borrowingYear] - getHomeLoanPrimeRate;
      }

      return result?.toFixed(2);
    },
  }),

  getSpecialHomeLoanLimit: selector<number>({
    key: RecoilKey.knowing["KNOWING/getSpecialHomeLoanLimit"],
    get: ({ get }) => {
      return 5;
    },
  }),

  // 최대 3.6억
  // 미성년자녀 3명 이상인 경우 4억
  getHomeLoanLimit: selector<number>({
    key: RecoilKey.knowing["KNOWING/getHomeLoanLimit"],
    get: ({ get }) => {
      let result = 0;
      const isAbleHomeLoan = get(KnowingState.isAbleHomeLoan);
      const isHavingKids = get(KnowingState.isHavingKids);
      const kidsCount = Number.parseInt(get(KnowingState.kidsCount));

      if (isAbleHomeLoan) {
        result = 3.6;
        if (isHavingKids && kidsCount >= 3) {
          result += 0.4;
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

      console.log(
        `getConfirmingLoanInterest::confirmingLoanBank:${confirmingLoanBank}, borrowingYear:${borrowingYear}`
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

  getLtv: selector<number>({
    key: RecoilKey.knowing["KNOWING/getLtv"],
    get: ({ get }) => {
      const isFirstTime = get(KnowingState.isFirstTime);

      if (isFirstTime) {
        return 80;
      } else {
        return 70;
      }
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

  getMyAsset: selector<number>({
    key: RecoilKey.knowing["KNOWING/getMyAsset"],
    get: ({ get }) => {
      const supportAmount = Number.parseInt(get(KnowingState.supportAmount));
      const depositAmount = Number.parseInt(get(KnowingState.depositAmount));

      return (supportAmount + depositAmount) / 10000;
    },
  }),

  getMaxPropertyPriceByLTV: selector<string>({
    key: RecoilKey.knowing["KNOWING/getMaxPropertyPriceByLTV"],
    get: ({ get }) => {
      const getMyAsset = Number.parseFloat(get(KnowingState.getMyAsset));
      const getLtv = Number.parseInt(get(KnowingState.getLtv));

      return ((getMyAsset * 100) / (100 - getLtv)).toFixed(2);
    },
  }),

  getDsrLoanResult: selector<Array<LoanResult>>({
    key: RecoilKey.knowing["KNOWING/getDsrLoanResult"],
    get: ({ get }) => {
      const result: Array<LoanResult> = [];
      const paymentType: PaymentType = get(KnowingState.paymentType);
      const borrowingYear: number = get(KnowingState.borrowingYear);
      let soulGatheringAmount: number = get(
        KnowingState.getSoulGatheringAmount
      );
      soulGatheringAmount = (soulGatheringAmount * borrowingYear) / 10000;

      const isAbleDidimdol = get(KnowingState.isAbleDidimdol);
      const isAbleSpecialHomeLoan = get(KnowingState.isAbleSpecialHomeLoan);
      // const isAbleHomeLoan = get(KnowingState.isAbleHomeLoan);
      // const isAbleConfirmingLoan = get(KnowingState.isAbleConfirmingLoan);

      if (isAbleDidimdol && soulGatheringAmount > 0) {
        const didimdolInterest: number = get(KnowingState.getDidimdolInterest);
        const didimdolLimit: number = get(KnowingState.getDidimdolLimit);
        const [didimdolPrincipalAmount, didimdolInterestAmount] =
          getPrincipalAndInterest(
            didimdolLimit,
            didimdolInterest,
            paymentType,
            borrowingYear
          );
        if (
          soulGatheringAmount -
            (didimdolPrincipalAmount + didimdolInterestAmount) >=
          0
        ) {
          console.log("dsr didimol 그대로");
          result.push({
            name: LoanType.DIDIMDOL,
            interest: didimdolInterest,
            loanAmount: didimdolPrincipalAmount.toFixed(2),
            interestAmount: didimdolInterestAmount.toFixed(2),
            fixedPaymentLoanAmountByMonth:
              calculateFixedPaymentLoanAmountByMonth(
                borrowingYear,
                didimdolPrincipalAmount,
                didimdolInterest
              ),
            fixedPrincipalPaymentLoanAmountFirstMonth:
              calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                borrowingYear,
                didimdolPrincipalAmount,
                didimdolInterest
              ),
          });
          soulGatheringAmount =
            soulGatheringAmount -
            (didimdolPrincipalAmount + didimdolInterestAmount);
        } else {
          const [principalAmount, interestAmount] =
            getPrincipalAndInterestInSoulGathering(
              didimdolLimit,
              didimdolInterest,
              soulGatheringAmount,
              paymentType,
              borrowingYear
            );
          if (principalAmount >= 0.01) {
            console.log("dsr didimol 줄여서::", principalAmount.toFixed(2));

            result.push({
              name: LoanType.DIDIMDOL,
              interest: didimdolInterest,
              loanAmount: principalAmount.toFixed(2),
              interestAmount: interestAmount.toFixed(2),
              fixedPaymentLoanAmountByMonth:
                calculateFixedPaymentLoanAmountByMonth(
                  borrowingYear,
                  principalAmount,
                  didimdolInterest
                ),
              fixedPrincipalPaymentLoanAmountFirstMonth:
                calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                  borrowingYear,
                  principalAmount,
                  didimdolInterest
                ),
            });
            // soulGatheringAmount = 0;
            soulGatheringAmount =
              soulGatheringAmount - (principalAmount + interestAmount);
          }
        }
        // soulGatheringAmount =
        //   soulGatheringAmount -
        //   (didimdolPrincipalAmount + didimdolInterestAmount);
      }

      if (isAbleSpecialHomeLoan && soulGatheringAmount > 0) {
        const specialHomeLoanInterest: number = get(
          KnowingState.getSpecialHomeLoanInterest
        );
        const specialHomeLoanLimit: number = get(
          KnowingState.getSpecialHomeLoanLimit
        );
        const [specialHomeLoanPrincipalAmount, specialHomeLoanInterestAmount] =
          getPrincipalAndInterest(
            specialHomeLoanLimit,
            specialHomeLoanInterest,
            paymentType,
            borrowingYear
          );

        if (
          soulGatheringAmount -
            (specialHomeLoanPrincipalAmount + specialHomeLoanInterestAmount) >=
          0
        ) {
          console.log(
            "dsr SPECIAL_HOME 그대로::",
            specialHomeLoanPrincipalAmount.toFixed(2)
          );

          result.push({
            name: LoanType.SPECIAL_HOME,
            interest: specialHomeLoanInterest,
            loanAmount: specialHomeLoanPrincipalAmount.toFixed(2),
            interestAmount: specialHomeLoanInterestAmount.toFixed(2),
            fixedPaymentLoanAmountByMonth:
              calculateFixedPaymentLoanAmountByMonth(
                borrowingYear,
                specialHomeLoanPrincipalAmount,
                specialHomeLoanInterest
              ),
            fixedPrincipalPaymentLoanAmountFirstMonth:
              calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                borrowingYear,
                specialHomeLoanPrincipalAmount,
                specialHomeLoanInterest
              ),
          });
          soulGatheringAmount =
            soulGatheringAmount -
            (specialHomeLoanPrincipalAmount + specialHomeLoanInterestAmount);
        } else {
          const [principalAmount, interestAmount] =
            getPrincipalAndInterestInSoulGathering(
              specialHomeLoanLimit,
              specialHomeLoanInterest,
              soulGatheringAmount,
              paymentType,
              borrowingYear
            );

          if (principalAmount >= 0.01) {
            console.log(
              "dsr SPECIAL_HOME 줄여서::",
              principalAmount.toFixed(2)
            );
            result.push({
              name: LoanType.SPECIAL_HOME,
              interest: specialHomeLoanInterest,
              loanAmount: principalAmount.toFixed(2),
              interestAmount: interestAmount.toFixed(2),
              fixedPaymentLoanAmountByMonth:
                calculateFixedPaymentLoanAmountByMonth(
                  borrowingYear,
                  principalAmount,
                  specialHomeLoanInterest
                ),
              fixedPrincipalPaymentLoanAmountFirstMonth:
                calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                  borrowingYear,
                  principalAmount,
                  specialHomeLoanInterest
                ),
            });
            soulGatheringAmount =
              soulGatheringAmount - (principalAmount + interestAmount);
          }
        }
        // soulGatheringAmount =
        //   soulGatheringAmount -
        //   (specialHomeLoanPrincipalAmount + specialHomeLoanInterestAmount);
      }

      // 특례보금자리론 출시로 1년동안 일반 보금자리론, 적격대출은 운영하지 않음 (2023.01.30)
      // if (isAbleHomeLoan && soulGatheringAmount > 0) {
      //   const homeLoanInterest: number = get(KnowingState.getHomeLoanInterest);
      //   const homeLoanLimit: number = get(KnowingState.getHomeLoanLimit);
      //   const [homeLoanPrincipalAmount, homeLoanInterestAmount] =
      //     getPrincipalAndInterest(homeLoanLimit, homeLoanInterest);
      //   if (
      //     soulGatheringAmount -
      //       (homeLoanPrincipalAmount + homeLoanInterestAmount) >=
      //     0
      //   ) {
      //     result.push({
      //       name: LoanType.HOME,
      //       interest: homeLoanInterest,
      //       loanAmount: homeLoanPrincipalAmount.toFixed(2),
      //       interestAmount: homeLoanInterestAmount.toFixed(2),
      //     });
      // soulGatheringAmount =
      //     soulGatheringAmount -
      //     (homeLoanPrincipalAmount + homeLoanInterestAmount);
      //   } else {
      //     const [principalAmount, interestAmount] =
      //       getPrincipalAndInterestInSoulGathering(
      //         homeLoanLimit,
      //         homeLoanInterest,
      //         soulGatheringAmount
      //       );

      //     result.push({
      //       name: LoanType.HOME,
      //       interest: homeLoanInterest,
      //       loanAmount: principalAmount.toFixed(2),
      //       interestAmount: interestAmount.toFixed(2),
      //     });
      // soulGatheringAmount =
      //     soulGatheringAmount -
      //     (principalAmount + interestAmount);
      //   }
      //   // soulGatheringAmount =
      //   //   soulGatheringAmount -
      //   //   (homeLoanPrincipalAmount + homeLoanInterestAmount);
      // }

      // if (isAbleConfirmingLoan && soulGatheringAmount > 0) {
      //   const confirmingLoanInterest: number = get(
      //     KnowingState.getConfirmingLoanInterest
      //   );
      //   const confirmingLoanLimit: number = get(
      //     KnowingState.getConfirmingLoanLimit
      //   );
      //   const [confirmingLoanPrincipal, confirmingLoanInterestAmount] =
      //     getPrincipalAndInterest(confirmingLoanLimit, confirmingLoanInterest);
      //   if (
      //     soulGatheringAmount -
      //       (confirmingLoanPrincipal + confirmingLoanInterestAmount) >=
      //     0
      //   ) {
      //     result.push({
      //       name: LoanType.CONFIRMING,
      //       interest: confirmingLoanInterest,
      //       loanAmount: confirmingLoanPrincipal.toFixed(2),
      //       interestAmount: confirmingLoanInterestAmount.toFixed(2),
      //     });
      // soulGatheringAmount =
      //     soulGatheringAmount -
      //     (confirmingLoanPrincipal + confirmingLoanInterestAmount);
      //   } else {
      //     const [principalAmount, interestAmount] =
      //       getPrincipalAndInterestInSoulGathering(
      //         confirmingLoanLimit,
      //         confirmingLoanInterest,
      //         soulGatheringAmount
      //       );

      //     result.push({
      //       name: LoanType.CONFIRMING,
      //       interest: confirmingLoanInterest,
      //       loanAmount: principalAmount.toFixed(2),
      //       interestAmount: interestAmount.toFixed(2),
      //     });
      // soulGatheringAmount =
      //     soulGatheringAmount -
      //     (principalAmount + interestAmount);
      //   }
      //   // soulGatheringAmount =
      //     // soulGatheringAmount -
      //     // (confirmingLoanPrincipal + confirmingLoanInterestAmount);
      // }

      if (soulGatheringAmount > 0) {
        const [normalLoanPrincipalAmount, normalLoanInterestAmount] =
          getPrincipalAndInterest(
            soulGatheringAmount,
            NormalLoanInterest,
            paymentType,
            borrowingYear
          );
        if (
          soulGatheringAmount -
            (normalLoanPrincipalAmount + normalLoanInterestAmount) >=
          0
        ) {
          console.log(
            "dsr 일반대출 그대로::",
            normalLoanPrincipalAmount.toFixed(2)
          );

          result.push({
            name: LoanType.NORMAL,
            interest: NormalLoanInterest,
            loanAmount: normalLoanPrincipalAmount.toFixed(2),
            interestAmount: normalLoanInterestAmount.toFixed(2),
            fixedPaymentLoanAmountByMonth:
              calculateFixedPaymentLoanAmountByMonth(
                borrowingYear,
                normalLoanPrincipalAmount,
                NormalLoanInterest
              ),
            fixedPrincipalPaymentLoanAmountFirstMonth:
              calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                borrowingYear,
                normalLoanPrincipalAmount,
                NormalLoanInterest
              ),
          });
          soulGatheringAmount =
            soulGatheringAmount -
            (normalLoanPrincipalAmount + normalLoanInterestAmount);
        } else {
          const [principalAmount, interestAmount] =
            getPrincipalAndInterestInSoulGathering(
              soulGatheringAmount,
              NormalLoanInterest,
              soulGatheringAmount,
              paymentType,
              borrowingYear
            );

          if (principalAmount > 0.01) {
            console.log("dsr 일반대출 줄여서::", principalAmount.toFixed(2));

            result.push({
              name: LoanType.NORMAL,
              interest: NormalLoanInterest,
              loanAmount: principalAmount.toFixed(2),
              interestAmount: interestAmount.toFixed(2),
              fixedPaymentLoanAmountByMonth:
                calculateFixedPaymentLoanAmountByMonth(
                  borrowingYear,
                  principalAmount,
                  NormalLoanInterest
                ),
              fixedPrincipalPaymentLoanAmountFirstMonth:
                calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                  borrowingYear,
                  principalAmount,
                  NormalLoanInterest
                ),
            });
            soulGatheringAmount =
              soulGatheringAmount - (principalAmount + interestAmount);
          }
        }
        // soulGatheringAmount =
        //   soulGatheringAmount -
        //   (normalLoanPrincipalAmount + normalLoanInterestAmount);
      }

      return result;
    },
  }),

  getFinalLoanResult: selector<FinalLoanResult>({
    key: RecoilKey.knowing["KNOWING/getFinalLoanResult"],
    get: ({ get }) => {
      const dsrResult: Array<LoanResult> = get(KnowingState.getDsrLoanResult);
      const paymentType: PaymentType = get(KnowingState.paymentType);
      const borrowingYear: number = get(KnowingState.borrowingYear);
      const getMyAsset = Number.parseFloat(get(KnowingState.getMyAsset));
      const getLtv = Number.parseInt(get(KnowingState.getLtv));

      let loanAmountByLtv = (getMyAsset * getLtv) / (100 - getLtv);

      let result: FinalLoanResult = {
        finalLoanResult: [],
        finalPropertyPrice: 0,
      };
      let totalLoanAmountByDsr = 0;

      for (const loan of dsrResult) {
        totalLoanAmountByDsr += Number.parseFloat(loan.loanAmount);
      }

      // // LTV기준 대출가능 금엑이 DSR기준보다 적다면 LTV기준으로 재계산
      if (totalLoanAmountByDsr > loanAmountByLtv) {
        const isAbleDidimdol = get(KnowingState.isAbleDidimdol);
        const isAbleSpecialHomeLoan = get(KnowingState.isAbleSpecialHomeLoan);
        // const isAbleHomeLoan = get(KnowingState.isAbleHomeLoan);
        // const isAbleConfirmingLoan = get(KnowingState.isAbleConfirmingLoan);

        if (isAbleDidimdol && loanAmountByLtv > 0) {
          console.log("recalculate by LTV");
          const didimdolInterest: number = get(
            KnowingState.getDidimdolInterest
          );
          const didimdolLimit: number = get(KnowingState.getDidimdolLimit);

          if (loanAmountByLtv - didimdolLimit >= 0) {
            const [didimdolPrincipalAmount, didimdolInterestAmount] =
              getPrincipalAndInterest(
                didimdolLimit,
                didimdolInterest,
                paymentType,
                borrowingYear
              );
            console.log(
              "ltv DIDIMDOL 그대로::",
              didimdolPrincipalAmount.toFixed(2)
            );

            result.finalLoanResult.push({
              name: LoanType.DIDIMDOL,
              interest: didimdolInterest,
              loanAmount: didimdolPrincipalAmount.toFixed(2),
              interestAmount: didimdolInterestAmount.toFixed(2),
              fixedPaymentLoanAmountByMonth:
                calculateFixedPaymentLoanAmountByMonth(
                  borrowingYear,
                  didimdolPrincipalAmount,
                  didimdolInterest
                ),
              fixedPrincipalPaymentLoanAmountFirstMonth:
                calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                  borrowingYear,
                  didimdolPrincipalAmount,
                  didimdolInterest
                ),
            });
            loanAmountByLtv = loanAmountByLtv - didimdolLimit;
          } else if (loanAmountByLtv > 0) {
            const [principalAmount, interestAmount] = getPrincipalAndInterest(
              loanAmountByLtv,
              didimdolInterest,
              paymentType,
              borrowingYear
            );

            if (principalAmount > 0.01) {
              console.log("ltv DIDIMDOL 줄여서::", principalAmount.toFixed(2));

              result.finalLoanResult.push({
                name: LoanType.DIDIMDOL,
                interest: didimdolInterest,
                loanAmount: principalAmount.toFixed(2),
                interestAmount: interestAmount.toFixed(2),
                fixedPaymentLoanAmountByMonth:
                  calculateFixedPaymentLoanAmountByMonth(
                    borrowingYear,
                    principalAmount,
                    didimdolInterest
                  ),
                fixedPrincipalPaymentLoanAmountFirstMonth:
                  calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                    borrowingYear,
                    principalAmount,
                    didimdolInterest
                  ),
              });
              loanAmountByLtv = loanAmountByLtv - principalAmount;
            }
          }
        }

        if (isAbleSpecialHomeLoan && loanAmountByLtv > 0) {
          const specialHomeLoanInterest: number = get(
            KnowingState.getSpecialHomeLoanInterest
          );
          const specialHomeLoanLimit: number = get(
            KnowingState.getSpecialHomeLoanLimit
          );

          if (loanAmountByLtv - specialHomeLoanLimit >= 0) {
            const [
              specialHomeLoanPrincipalAmount,
              specialHomeLoanInterestAmount,
            ] = getPrincipalAndInterest(
              specialHomeLoanLimit,
              specialHomeLoanInterest,
              paymentType,
              borrowingYear
            );
            console.log(
              "ltv SPECIAL_HOME 그대로::",
              specialHomeLoanPrincipalAmount.toFixed(2)
            );

            result.finalLoanResult.push({
              name: LoanType.SPECIAL_HOME,
              interest: specialHomeLoanInterest,
              loanAmount: specialHomeLoanPrincipalAmount.toFixed(2),
              interestAmount: specialHomeLoanInterestAmount.toFixed(2),
              fixedPaymentLoanAmountByMonth:
                calculateFixedPaymentLoanAmountByMonth(
                  borrowingYear,
                  specialHomeLoanPrincipalAmount,
                  specialHomeLoanInterest
                ),
              fixedPrincipalPaymentLoanAmountFirstMonth:
                calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                  borrowingYear,
                  specialHomeLoanPrincipalAmount,
                  specialHomeLoanInterest
                ),
            });
            loanAmountByLtv = loanAmountByLtv - specialHomeLoanLimit;
          } else if (loanAmountByLtv > 0) {
            const [principalAmount, interestAmount] = getPrincipalAndInterest(
              loanAmountByLtv,
              specialHomeLoanInterest,
              paymentType,
              borrowingYear
            );

            if (principalAmount > 0.01) {
              console.log(
                "ltv SPECIAL_HOME 줄여서::",
                principalAmount.toFixed(2)
              );

              result.finalLoanResult.push({
                name: LoanType.SPECIAL_HOME,
                interest: specialHomeLoanInterest,
                loanAmount: principalAmount.toFixed(2),
                interestAmount: interestAmount.toFixed(2),
                fixedPaymentLoanAmountByMonth:
                  calculateFixedPaymentLoanAmountByMonth(
                    borrowingYear,
                    principalAmount,
                    specialHomeLoanInterest
                  ),
                fixedPrincipalPaymentLoanAmountFirstMonth:
                  calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                    borrowingYear,
                    principalAmount,
                    specialHomeLoanInterest
                  ),
              });
              loanAmountByLtv = loanAmountByLtv - principalAmount;
            }
          }
        }

        if (loanAmountByLtv > 0.01) {
          const [principalAmount, interestAmount] = getPrincipalAndInterest(
            loanAmountByLtv,
            NormalLoanInterest,
            paymentType,
            borrowingYear
          );
          console.log("ltv 일반대출::", principalAmount.toFixed(2));

          result.finalLoanResult.push({
            name: LoanType.NORMAL,
            interest: NormalLoanInterest,
            loanAmount: principalAmount.toFixed(2),
            interestAmount: interestAmount.toFixed(2),
            fixedPaymentLoanAmountByMonth:
              calculateFixedPaymentLoanAmountByMonth(
                borrowingYear,
                principalAmount,
                NormalLoanInterest
              ),
            fixedPrincipalPaymentLoanAmountFirstMonth:
              calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                borrowingYear,
                principalAmount,
                NormalLoanInterest
              ),
          });
          loanAmountByLtv = loanAmountByLtv - principalAmount;
        }
      } else {
        result.finalLoanResult = dsrResult;
      }

      // 주택가격 제한에 걸리는 경우, 재계산
      let totalLoanAmount = 0;
      let useDidimdol = false;
      let useSpecialHome = false;

      for (const loan of result.finalLoanResult) {
        totalLoanAmount += Number.parseFloat(loan.loanAmount);

        if (loan.name === LoanType.DIDIMDOL) {
          useDidimdol = true;
        } else if (loan.name === LoanType.SPECIAL_HOME) {
          useSpecialHome = true;
        }
      }

      const isFirstTime = get(KnowingState.isFirstTime);
      const havingNoHouse = get(KnowingState.havingNoHouse);
      const yearIncome = Number.parseInt(get(KnowingState.yearIncome));

      let isLimited = false;
      result.finalPropertyPrice = totalLoanAmount + getMyAsset;

      // 서민실수요자 최대 5억 제한
      if (isFirstTime && havingNoHouse && yearIncome <= 6000) {
        if (totalLoanAmount + getMyAsset > 5) {
          result.finalPropertyPrice = 5;
          result.additionalMessage =
            "서민 실수요자 대출에 해당되어 주택가격이 5억까지로 제한돼요";
          isLimited = true;
        }
      }

      if (useDidimdol) {
        // 디딤돌 사용시 최대 5억 제한
        if (totalLoanAmount + getMyAsset > 5) {
          result.finalPropertyPrice = 5;
          result.additionalMessage =
            "디딤돌 대출 사용시 주택가격이 5억까지로 제한돼요";
          isLimited = true;
        }
      } else if (useSpecialHome) {
        // 특례보금자리 9억 제한
        if (totalLoanAmount + getMyAsset > 9) {
          result.finalPropertyPrice = 9;
          result.additionalMessage =
            "특례보금자리 대출 사용시 주택가격이 9억까지로 제한돼요";
          isLimited = true;
        }
      }

      console.log("useSpecial:::", useSpecialHome);
      console.log(
        "totalLoanAmount + getMyAsset:::",
        totalLoanAmount + getMyAsset
      );

      if (isLimited) {
        // LTV기준으로 최대 대출금액과 한도에서 내가 가진 돈을 제한 금액중 더 작은 값 사용(실제 필요한 대출금액 계산하기 위한 목적)
        let loanAmountByLimitedPrice = Math.min(
          result.finalPropertyPrice * (getLtv * 0.01),
          result.finalPropertyPrice - getMyAsset
        );

        result.finalLoanResult = [];

        console.log(
          "recalculate by limited property price::",
          result.finalPropertyPrice
        );
        console.log("result.finalPropertyPrice::", result.finalPropertyPrice);
        console.log(
          "result.finalPropertyPrice * (getLtv * 0.01)::",
          result.finalPropertyPrice * (getLtv * 0.01)
        );
        console.log("getMyAsset::", getMyAsset);
        const isAbleDidimdol = get(KnowingState.isAbleDidimdol);
        const isAbleSpecialHomeLoan = get(KnowingState.isAbleSpecialHomeLoan);
        // const isAbleHomeLoan = get(KnowingState.isAbleHomeLoan);
        // const isAbleConfirmingLoan = get(KnowingState.isAbleConfirmingLoan);

        if (isAbleDidimdol && loanAmountByLimitedPrice > 0) {
          const didimdolInterest: number = get(
            KnowingState.getDidimdolInterest
          );
          const didimdolLimit: number = get(KnowingState.getDidimdolLimit);

          if (loanAmountByLimitedPrice - didimdolLimit >= 0) {
            const [didimdolPrincipalAmount, didimdolInterestAmount] =
              getPrincipalAndInterest(
                didimdolLimit,
                didimdolInterest,
                paymentType,
                borrowingYear
              );
            console.log(
              "limited didimdol 그대로::",
              didimdolPrincipalAmount.toFixed(2)
            );
            result.finalLoanResult.push({
              name: LoanType.DIDIMDOL,
              interest: didimdolInterest,
              loanAmount: didimdolPrincipalAmount.toFixed(2),
              interestAmount: didimdolInterestAmount.toFixed(2),
              fixedPaymentLoanAmountByMonth:
                calculateFixedPaymentLoanAmountByMonth(
                  borrowingYear,
                  didimdolPrincipalAmount,
                  didimdolInterest
                ),
              fixedPrincipalPaymentLoanAmountFirstMonth:
                calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                  borrowingYear,
                  didimdolPrincipalAmount,
                  didimdolInterest
                ),
            });
            loanAmountByLimitedPrice = loanAmountByLimitedPrice - didimdolLimit;
          } else if (loanAmountByLimitedPrice > 0) {
            const [principalAmount, interestAmount] = getPrincipalAndInterest(
              loanAmountByLimitedPrice,
              didimdolInterest,
              paymentType,
              borrowingYear
            );

            if (principalAmount > 0.01) {
              console.log(
                "limited didimdol 줄여서::",
                principalAmount.toFixed(2)
              );
              result.finalLoanResult.push({
                name: LoanType.DIDIMDOL,
                interest: didimdolInterest,
                loanAmount: principalAmount.toFixed(2),
                interestAmount: interestAmount.toFixed(2),
                fixedPaymentLoanAmountByMonth:
                  calculateFixedPaymentLoanAmountByMonth(
                    borrowingYear,
                    principalAmount,
                    didimdolInterest
                  ),
                fixedPrincipalPaymentLoanAmountFirstMonth:
                  calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                    borrowingYear,
                    principalAmount,
                    didimdolInterest
                  ),
              });
              loanAmountByLimitedPrice =
                loanAmountByLimitedPrice - principalAmount;
            }
          }
        }

        if (isAbleSpecialHomeLoan && loanAmountByLimitedPrice > 0) {
          const specialHomeLoanInterest: number = get(
            KnowingState.getSpecialHomeLoanInterest
          );
          const specialHomeLoanLimit: number = get(
            KnowingState.getSpecialHomeLoanLimit
          );

          if (loanAmountByLimitedPrice - specialHomeLoanLimit >= 0) {
            const [
              specialHomeLoanPrincipalAmount,
              specialHomeLoanInterestAmount,
            ] = getPrincipalAndInterest(
              specialHomeLoanLimit,
              specialHomeLoanInterest,
              paymentType,
              borrowingYear
            );

            console.log(
              "limited SPECIAL_HOME 그대로::",
              specialHomeLoanPrincipalAmount.toFixed(2)
            );
            result.finalLoanResult.push({
              name: LoanType.SPECIAL_HOME,
              interest: specialHomeLoanInterest,
              loanAmount: specialHomeLoanPrincipalAmount.toFixed(2),
              interestAmount: specialHomeLoanInterestAmount.toFixed(2),
              fixedPaymentLoanAmountByMonth:
                calculateFixedPaymentLoanAmountByMonth(
                  borrowingYear,
                  specialHomeLoanPrincipalAmount,
                  specialHomeLoanInterest
                ),
              fixedPrincipalPaymentLoanAmountFirstMonth:
                calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                  borrowingYear,
                  specialHomeLoanPrincipalAmount,
                  specialHomeLoanInterest
                ),
            });
            loanAmountByLimitedPrice =
              loanAmountByLimitedPrice - specialHomeLoanLimit;
          } else if (loanAmountByLimitedPrice > 0) {
            const [principalAmount, interestAmount] = getPrincipalAndInterest(
              loanAmountByLimitedPrice,
              specialHomeLoanInterest,
              paymentType,
              borrowingYear
            );

            if (principalAmount > 0.01) {
              console.log(
                "limited SPECIAL_HOME 줄여서::",
                principalAmount.toFixed(2)
              );

              result.finalLoanResult.push({
                name: LoanType.SPECIAL_HOME,
                interest: specialHomeLoanInterest,
                loanAmount: principalAmount.toFixed(2),
                interestAmount: interestAmount.toFixed(2),
                fixedPaymentLoanAmountByMonth:
                  calculateFixedPaymentLoanAmountByMonth(
                    borrowingYear,
                    principalAmount,
                    specialHomeLoanInterest
                  ),
                fixedPrincipalPaymentLoanAmountFirstMonth:
                  calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                    borrowingYear,
                    principalAmount,
                    specialHomeLoanInterest
                  ),
              });
              loanAmountByLimitedPrice =
                loanAmountByLimitedPrice - principalAmount;
            }
          }
        }

        if (loanAmountByLimitedPrice > 0.01) {
          const [principalAmount, interestAmount] = getPrincipalAndInterest(
            loanAmountByLimitedPrice,
            NormalLoanInterest,
            paymentType,
            borrowingYear
          );
          console.log("limited 일반대출::", principalAmount.toFixed(2));
          result.finalLoanResult.push({
            name: LoanType.NORMAL,
            interest: NormalLoanInterest,
            loanAmount: principalAmount.toFixed(2),
            interestAmount: interestAmount.toFixed(2),
            fixedPaymentLoanAmountByMonth:
              calculateFixedPaymentLoanAmountByMonth(
                borrowingYear,
                principalAmount,
                NormalLoanInterest
              ),
            fixedPrincipalPaymentLoanAmountFirstMonth:
              calculateFixedPrincipalPaymentLoanAmountFirstMonth(
                borrowingYear,
                principalAmount,
                NormalLoanInterest
              ),
          });
          loanAmountByLimitedPrice = loanAmountByLimitedPrice - principalAmount;
        }
      }

      return result;
    },
  }),

  // getFinalResult: selector<FinalResult>({
  //   key: RecoilKey.knowing["KNOWING/getFinalResult"],
  //   get: ({ get }) => {
  //     const finalLoanResult: Array<LoanResult> = get(
  //       KnowingState.getFinalLoanResult
  //     );
  //     const getMyAsset = Number.parseFloat(get(KnowingState.getMyAsset));

  //     let totalLoanAmount = 0;
  //     let useDidimdol = false;
  //     let useSpecialHome = false;

  //     const result: FinalResult = {
  //       finalPropertyPrice: 0,
  //     };
  //     for (const loan of finalLoanResult) {
  //       totalLoanAmount += Number.parseFloat(loan.loanAmount);

  //       if (loan.name === LoanType.DIDIMDOL) {
  //         useDidimdol = true;
  //       } else if (loan.name === LoanType.SPECIAL_HOME) {
  //         useSpecialHome = true;
  //       }
  //     }

  //     const isFirstTime = get(KnowingState.isFirstTime);
  //     const havingNoHouse = get(KnowingState.havingNoHouse);
  //     const yearIncome = Number.parseInt(get(KnowingState.yearIncome));

  //     // 서민실수요자 최대 5억 제한
  //     if (isFirstTime && havingNoHouse && yearIncome <= 6000) {
  //       if (totalLoanAmount + getMyAsset > 5) {
  //         result.finalPropertyPrice = 5;
  //         result.additionalMessage =
  //           "서민 실수요자 대출에 해당되어 주택가격이 5억까지로 제한돼요";
  //         return result;
  //       } else {
  //         result.finalPropertyPrice = totalLoanAmount + getMyAsset;
  //         return result;
  //       }
  //     }

  //     if (useDidimdol) {
  //       // 디딤돌 사용시 최대 5억 제한
  //       if (totalLoanAmount + getMyAsset > 5) {
  //         result.finalPropertyPrice = 5;
  //         result.additionalMessage =
  //           "디딤돌 대출 사용시 주택가격이 5억까지로 제한돼요";
  //         return result;
  //       } else {
  //         result.finalPropertyPrice = totalLoanAmount + getMyAsset;
  //         return result;
  //       }
  //     } else if (useSpecialHome) {
  //       // 특례보금자리 9억 제한
  //       if (totalLoanAmount + getMyAsset > 9) {
  //         result.finalPropertyPrice = 9;
  //         result.additionalMessage =
  //           "특례보금자리 대출 사용시 주택가격이 9억까지로 제한돼요";
  //         return result;
  //       } else {
  //         result.finalPropertyPrice = totalLoanAmount + getMyAsset;
  //         return result;
  //       }
  //     }

  //     result.finalPropertyPrice = totalLoanAmount + getMyAsset;
  //     return result;
  //   },
  // }),
};
