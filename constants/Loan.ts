export interface LoanResult {
  name: string;
  interest: number;
  loanAmount: string;
  interestAmount: string;
}

export enum LoanType {
  DIDIMDOL = "디딤돌대출",
  HOME = "보금자리대출",
  CONFIRMING = "적격대출",
}
