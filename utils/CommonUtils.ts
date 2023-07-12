import { HousePriceLitmitation, PaymentType } from "../constants/Common";
import { GradualIncreaseRate } from "../constants/Interests";

export const getNumericString = (value: string) => {
  let check = /(^\d+$)|(^\d{1,}.\d{0,2}$)/;
  const withoutCommaString = value.replaceAll(",", "");
  if (check.test(withoutCommaString)) {
    return withoutCommaString;
  }
  return "";
};

export const getDidimdolHousePriceLimit = (
  isNewCouple: boolean,
  isMarried: boolean,
  isHavingKids: boolean,
  kidsCount: number,
  internationalAge: number
) => {
  if (isNewCouple || (isMarried && isHavingKids && kidsCount >= 2)) {
    return HousePriceLitmitation.DIDIMDOL_PRIME;
  }
  if (!isMarried && internationalAge >= 30) {
    return HousePriceLitmitation.DIDIMDOL_ADVANTAGE;
  }
  return HousePriceLitmitation.DIDIMDOL;
};

export const getPrincipalAndInterest = (
  amount: number,
  interest: number,
  paymentType: string, // model로 빼기
  borrowingYear: number
) => {
  // paymentType이,
  // 만기일시면 ->  [amount, (amount * interest) / 100];
  // 원리금균등 -> [원금총액, 이자총액]
  // 원금균등 -> [원금총액, 이자총액]
  // 소수점 신경 안써도 됨
  if (paymentType === PaymentType.FIXED) {
    // calculateFixedPaymentLoanAmountByMonth 함수에서 한달에 갚아야할 금액 구하고
    // 거기에 총 개월수를 곱해서 전체 이자를 구한다음 원금(amount가 억 단위라 100000000 곱함)을 빼주고
    // 실제 getPrincipalAndInterest 호출하는 쪽에서는 단위가 억이기 때문에 다시 100000000로 나눠줌
    return [
      amount,
      (calculateFixedPaymentLoanAmountByMonth(
        borrowingYear!,
        amount,
        interest
      ) *
        borrowingYear! *
        12 -
        amount * 100000000) /
        100000000,
    ];
  } else if (paymentType === PaymentType.FIXED_PRINCIPAL) {
    // 매달 갚아야 할 원금 (원금 / 개월수)
    const fixedPrincipal = getFixedPrincipalInterest(
      amount,
      borrowingYear,
      interest
    );
    return [amount, fixedPrincipal.totalInterest / 100000000];
  } else if (paymentType === PaymentType.GRADUAL_INCREASE) {
    const totalInterest = getGradualIncreaseInterest(
      amount,
      borrowingYear,
      interest
    );
    return [amount, totalInterest.totalInterest / 100000000];
  }
  return [amount, (amount * interest) / 100];
};

export const getGradualIncreaseInterest = (
  amount: number, // 총 대출금, 단위 억
  borrowingYear: number, // 빌린기간, 단위 년
  interest: number, // 이율
  loopingYear?: number
) => {
  let amountForCalculate = amount * 100000000;
  let totalBorrowingMonth = (loopingYear ?? borrowingYear) * 12;
  let monthlyInterest = 0;
  let monthlyPrincipal = 0;
  let totalInterest = 0;
  let i = 1;
  let totalPayment = 0;

  while (totalBorrowingMonth > 0) {
    amountForCalculate -= monthlyPrincipal;
    monthlyInterest = Math.round((amountForCalculate * interest) / 100 / 12);
    monthlyPrincipal = Math.round(
      ((amountForCalculate * GradualIncreaseRate[borrowingYear]) / 100) *
        (i - 1)
    );
    totalPayment += monthlyPrincipal + monthlyInterest;
    totalBorrowingMonth--;
    i++;
    totalInterest += monthlyInterest;
  }

  return { totalInterest, totalPayment };
};

export const getFixedPrincipalInterest = (
  amount: number, // 총 대출금, 단위 억
  borrowingYear: number, // 빌린기간, 단위 년
  interest: number, // 이율
  loopingYear?: number
) => {
  let amountForCalculate = amount * 100000000;
  let totalBorrowingMonth = (loopingYear ?? borrowingYear) * 12;
  const monthlyPrincipal = (amount * 100000000) / (borrowingYear * 12);
  let monthlyInterest = 0;

  let totalInterest = 0; // 총 이자
  let totalPrincipal = 0; // 총 원금
  let totalPayment = 0; // 총 원리금

  const monthlyInterestRate = interest / 100 / 12;

  while (totalBorrowingMonth > 0) {
    monthlyInterest = amountForCalculate * monthlyInterestRate;
    amountForCalculate -= monthlyPrincipal;
    totalPayment += monthlyPrincipal + monthlyInterest;
    totalPrincipal += monthlyPrincipal;
    totalInterest += monthlyInterest;
    totalBorrowingMonth--;
  }

  return {
    totalInterest,
    totalPrincipal,
    totalPayment,
  };
};

export const getPrincipalAndInterestInSoulGathering = (
  amount: number,
  interest: number,
  soulGathering: number,
  paymentType: string,
  borrowingYear: number
) => {
  let [resultAmount, resultInterest] = getPrincipalAndInterest(
    amount,
    interest,
    paymentType,
    borrowingYear
  );

  while (resultAmount + resultInterest > soulGathering) {
    amount -= 0.01;

    [resultAmount, resultInterest] = getPrincipalAndInterest(
      amount,
      interest,
      paymentType,
      borrowingYear
    );
  }

  return [Number.parseFloat(resultAmount.toFixed(2)), resultInterest];
};

// 원리금 균등 월 상환 금액
export const calculateFixedPaymentLoanAmountByMonth = (
  borrowingYear: number,
  loanAmount: number,
  loanRate: number
): number => {
  const loanYear = borrowingYear;
  const totalLoanAmount = loanAmount * 100000000;
  // AB(1 + B)^n / (1 + B)^n - 1
  // A: 대출받은 원금
  // B: 대출에 대한 이자율(연이자율 / 12)
  // n: 대출 상환 개월 수
  const A = totalLoanAmount;
  const B = loanRate / 100 / 12;
  const n = loanYear * 12;

  const result = Math.ceil((A * B * (1 + B) ** n) / ((1 + B) ** n - 1));
  return result;
};

// 원금 균등 첫 달 상환 금액
export const calculateFixedPrincipalPaymentLoanAmountFirstMonth = (
  borrowingYear: number,
  loanAmount: number,
  loanRate: number
): number => {
  const loanMonth = borrowingYear * 12;
  const totalLoanAmount = loanAmount * 100000000;

  // 첫달 갚을 원금 : 대출금 / 개월
  // 첫달 갚을 이자 : 대출금 * (연이자율 / 100 / 12)

  return Math.ceil(
    totalLoanAmount / loanMonth + totalLoanAmount * (loanRate / 100 / 12)
  );
};

// A × r/12 ​+ A × g × (i−1)​
// 대출원금 : A, 대출기간 : N, 대출금리 : r (%), 회차 : i (i=1,2,3...), 체증률 : g (%)
// 10년 0.015%, 15년 0.046%, 20년 0.023%, 30년 0.008%
export const calculateFixedGradualIncreasePaymentLoanAmountFirstMonthh = (
  borrowingYear: number,
  loanAmount: number,
  loanRate: number
): number => {
  const totalLoanAmount = loanAmount * 100000000;

  return Math.ceil((totalLoanAmount * (loanRate / 100)) / 12);
};

export const getCommaString = (original: string | number) => {
  return original.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const convertPriceToKorean = (price: string) => {
  const numKor = new Array(
    "",
    "일",
    "이",
    "삼",
    "사",
    "오",
    "육",
    "칠",
    "팔",
    "구",
    "십"
  ); // 숫자 문자
  const danKor = new Array(
    "",
    "십",
    "백",
    "천",
    "",
    "십",
    "백",
    "천",
    "",
    "십",
    "백",
    "천",
    "",
    "십",
    "백",
    "천"
  ); // 만위 문자열
  let result = "";

  if (price && !isNaN(Number(price))) {
    for (let i = 0; i < price.length; i++) {
      let str = "";
      const num = numKor[Number(price.slice(-1 - i, -i))];
      if (num != "") str += num + danKor[i]; // 숫자가 0인 경우 텍스트를 표현하지 않음
      switch (i) {
        case 4:
          str += "억";
          break; // 4자리인 경우 '만'을 붙여줌 ex) 10000 -> 일만
        case 8:
          str += "조";
          break; // 8자리인 경우 '억'을 붙여줌 ex) 100000000 -> 일억
      }

      result = str + result;
    }

    result = result + "만원";
    if (result.indexOf("억만") > 0) result = result.replace("억만", "억");
  }

  return result;
};
