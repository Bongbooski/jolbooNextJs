import { atom } from "recoil";
import RecoilKey from "../constants/recoilKey";

export const SampleState = {
    isMarried: atom<boolean>({
        key: RecoilKey.sample["SAMPLE/isMarried"],
        default: false
    }),
}