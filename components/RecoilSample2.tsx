import { useRecoilValue } from "recoil";
import { SampleState } from "../state/SampleState";

const RecoilSample2 = () => {
  const isMarried = useRecoilValue(SampleState.isMarried);
  return <div>{isMarried ? "no!" : "ok!"}</div>;
};

export default RecoilSample2;
