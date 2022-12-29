import { useRecoilState } from "recoil";
import { SampleState } from "../state/SampleState";

const RecoilSample1 = () => {
  const [isMarriedValue, setisMarriedValue] = useRecoilState(
    SampleState.isMarriedValue
  );

  const handleClick = () => {
    isMarriedValue ? setisMarriedValue(false) : setisMarriedValue(true);
  };

  return (
    <div>
      <button onClick={handleClick}>marry me!</button>
    </div>
  );
};

export default RecoilSample1;
