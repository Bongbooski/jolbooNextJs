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
    amount -= 0.1;
    console.log("after amount::", amount);

    [resultAmount, resultInterest] = getPrincipalAndInterest(amount, interest);
  }

  return [Number.parseFloat(resultAmount.toFixed(2)), resultInterest];
};
