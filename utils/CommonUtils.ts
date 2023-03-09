import { PaymentType } from "../constants/Common";

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
    let amountForCalculate = amount * 100000000;
    let totalBorrowingMonth = borrowingYear * 12;
    const monthlyPayment = (amount * 100000000) / totalBorrowingMonth;
    let monthlyInterest = 0;
    let totalInterest = 0;
    const monthlyInterestRate = interest / 100 / 12;

    while (totalBorrowingMonth > 0) {
      monthlyInterest = amountForCalculate * monthlyInterestRate;
      amountForCalculate -= monthlyPayment;
      totalInterest += monthlyInterest;
      totalBorrowingMonth--;
    }
    return [amount, totalInterest / 100000000];
  }
  return [amount, (amount * interest) / 100];
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

export const getCommaString = (original: string | number) => {
  return original.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
