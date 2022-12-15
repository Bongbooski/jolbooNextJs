import { useRecoilState } from "recoil";
import { SampleState } from "../state/SampleState";

const RecoilSample1 = () => {
  const [isMarried, setIsMarried] = useRecoilState(SampleState.isMarried);

  const handleClick = () => {
    isMarried ? setIsMarried(false) : setIsMarried(true);
  };

  return (
    <div>
      <button onClick={handleClick}>marry me!</button>
    </div>
  );
};

export default RecoilSample1;
