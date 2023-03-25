import { ConfirmingLoanBank } from "./Common";

export const DidimdolInterests: Interest = {
  LOWER_TWO_THOUSAND: {
    "10": 2.15,
    "15": 2.25,
    "20": 2.35,
    "30": 2.4,
  },
  LOWER_FOUR_THOUSANDS: {
    "10": 2.5,
    "15": 2.6,
    "20": 2.7,
    "30": 2.75,
  },
  LOWER_SIX_THOUSANDS: {
    "10": 2.75,
    "15": 2.85,
    "20": 2.95,
    "30": 3,
  },
};

export const HomeLoanInterests: Interest = {
  U_HOME_LOAN: {
    "10": 4.25,
    "15": 4.35,
    "20": 4.4,
    "30": 4.45,
  },
};

export const SpecialHomeLoanInterests: Interest = {
  NORMAL: {
    "10": 4.25,
    "15": 4.35,
    "20": 4.4,
    "30": 4.45,
    "40": 4.5,
    "50": 4.55,
  },
  PRIME: {
    "10": 4.15,
    "15": 4.25,
    "20": 4.3,
    "30": 4.35,
    "40": 4.4,
    "50": 4.45,
  },
};

export const GradualIncreaseRate: InterestDetail = {
  "10": 0.0115,
  "15": 0.0046,
  "20": 0.0023,
  "30": 0.0008,
  "40": 0,
};

interface Interest {
  [index: string]: InterestDetail;
}

interface InterestDetail {
  [index: string]: number;
}

type ConfirmingLoanInterest = {
  [index in ConfirmingLoanBank]: InterestDetail;
};

export const NormalLoanInterest: number = 5.17;

export const ConfirmingLoanInterests: ConfirmingLoanInterest = {
  부산: {
    "10": 2.15,
    "15": 2.25,
    "20": 2.35,
    "30": 2.4,
  },
  경남: {
    "10": 5.37,
    "15": 5.47,
    "20": 5.57,
    "30": 5.62,
    "40": 5.67,
    "50": 5.72,
  },
  농협: {
    "10": 6.09,
    "15": 6.14,
    "20": 6.19,
    "30": 6.24,
  },
  하나: {
    "10": 5.26,
    "15": 5.31,
    "20": 5.36,
    "30": 5.36,
    "40": 5.36,
    "50": 5.36,
  },
  제주: {
    "10": 5.94,
    "15": 5.94,
    "20": 5.94,
    "30": 5.94,
    "40": 5.94,
    "50": 5.94,
  },
};
