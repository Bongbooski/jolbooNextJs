import { atom } from "recoil";
import RecoilKey from "../constants/recoilKey";
import { Dayjs } from "dayjs";

export const KnowingState = {
  birthday: atom<Dayjs | null>({
    key: RecoilKey.knowing["KNOWING/birthday"],
    default: null,
  }),
  isMarried: atom<string | null>({
    key: RecoilKey.knowing["KNOWING/isMarried"],
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
  isManyKids: atom<boolean>({
    key: RecoilKey.knowing["KNOWING/isManyKids"],
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
};
