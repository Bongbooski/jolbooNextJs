export interface LoanResult {
  name: LoanType;
  interest: number;
  loanAmount: string;
  interestAmount: string;
  primeRate: number;
  fixedPaymentLoanAmountByMonth: number;
  fixedPrincipalPaymentLoanAmountFirstMonth: number;
  fixedGradualIncreasePaymentLoanAmountFirstMonth: number;
}

export enum LoanType {
  DIDIMDOL = "디딤돌대출",
  HOME = "보금자리대출",
  SPECIAL_HOME = "특례보금자리대출",
  CONFIRMING = "적격대출",
  NORMAL = "일반 주택담보대출",
}

export enum FamilyType {
  DISABLED = "장애인가구: 본인이나 배우자 또는 본인(배우자 포함)의 직계존비속인 세대원 중 1인 이상이 장애인증명서 발급대상자\n",
  MULTI_CULTURAL = "다문화가구: 배우자가 외국인이거나 귀화로 인한 국적 취득자 또는 본인이 귀화로 인한 국적취득자\n",
  SINGLE_PARENT = "한부모가구: 한부모가족증명서 발급대상자\n",
  LOW_INCOME = "저소득자: 연소득 2,500만원 이하\n",
  NEW_COUPLE = "신혼부부: 혼인기간이 7년 이내(3개월 이내 결혼예정자 포함)\n",
  MANY_KIDS = "다자녀가구: 민법상 미성년 자녀 3인 이상\n",
}
