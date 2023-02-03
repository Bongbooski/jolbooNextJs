export const getPrincipalAndInterest = (amount: number, interest: number) => {
  return [amount, (amount * interest) / 100];
};

export const getPrincipalAndInterestInSoulGathering = (
  amount: number,
  interest: number,
  soulGathering: number
) => {
  let [resultAmount, resultInterest] = getPrincipalAndInterest(
    amount,
    interest
  );

  while (resultAmount + resultInterest > soulGathering) {
    console.log("before amount::", amount);
    amount -= 0.01;
    console.log("after amount::", amount);

    [resultAmount, resultInterest] = getPrincipalAndInterest(amount, interest);
  }

  return [Number.parseFloat(resultAmount.toFixed(2)), resultInterest];
};

// 원리금 균등 월 상환 금액
export const calculateFixedPaymentLoanAmountByMonth = (
  borrowingYear: number,
  loanAmount: number,
  loanRate: number
): number => {
  debugger;
  const loanYear = borrowingYear;
  const totalLoanAmount = loanAmount * 10000000 * loanYear;

  // AB(1 + B)^n / (1 + B)^n - 1
  // A: 대출받은 원금
  // B: 대출에 대한 이자율(연이자율 / 12)
  // n: 대출 상환 개월 수
  const A = totalLoanAmount;
  const B = loanRate / 100 / 12;
  const n = loanYear * 12;

  return Math.ceil((A * B * (1 + B) ** n) / ((1 + B) ** n - 1));
};

// 원금 균등 첫 달 상환 금액
export const calculateFixedPrincipalPaymentLoanAmountFirstMonth = (
  borrowingYear: number,
  loanAmount: number,
  loanRate: number
): number => {
  debugger;
  const loanYear = borrowingYear;
  const loanMonth = borrowingYear * 12;
  const totalLoanAmount = loanAmount * 10000000 * loanYear;

  // 첫달 갚을 원금 : 대출금 / 개월
  // 첫달 갚을 이자 : 대출금 * (연이자율 / 100 / 12)

  return Math.ceil(
    totalLoanAmount / loanMonth + totalLoanAmount * (loanRate / 100 / 12)
  );
};
