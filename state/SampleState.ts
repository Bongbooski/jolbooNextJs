import { atom } from "recoil";
import RecoilKey from "../constants/recoilKey";
import { Dayjs } from "dayjs";

export const SampleState = {
  //   isMarried: atom<boolean>({
  //     key: RecoilKey.sample["SAMPLE/isMarried"],
  //     default: false,
  //   }),
  birthday: atom<Dayjs | null>({
    key: "birthday",
    default: null,
  }),
  isMarried: atom<string | null>({
    key: "isMarried",
    default: null,
  }),
  isNewCouple: atom<boolean | null>({
    key: "isNewCouple",
    default: null,
  }),
  isFirstTime: atom<boolean>({
    key: "isFirstTime",
    default: true,
  }),

  yearIncome: atom<string>({
    key: "yearIncome",
  }),
  supportAmount: atom<string>({
    key: "supportAmount",
  }),
  depositAmount: atom<string>({
    key: "depositAmount",
  }),

  isSingleParent: atom<boolean>({
    key: "isSingleParent",
    default: false,
  }),
  isManyKids: atom<boolean>({
    key: "isManyKids",
    default: false,
  }),
  isDisabled: atom<boolean>({
    key: "isDisabled",
    default: false,
  }),
  isMultiCultural: atom<boolean>({
    key: "isMultiCultural",
    default: false,
  }),
  havingNoHouse: atom<boolean>({
    key: "havingNoHouse",
    default: true,
  }),

  kidsCount: atom<string>({
    key: "kidsCount",
  }),
};
