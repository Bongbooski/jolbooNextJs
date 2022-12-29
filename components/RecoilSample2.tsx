import { useRecoilValue } from "recoil";
import { SampleState } from "../state/SampleState";

const RecoilSample2 = () => {
  const isMarriedValue = useRecoilValue(SampleState.isMarriedValue);
  return <div>{isMarriedValue ? "no!" : "ok!"}</div>;
};

export default RecoilSample2;
