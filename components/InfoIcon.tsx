import { Box } from "@mui/material";
import QuestionIcon from "../asset/svg/Question.svg";

interface InfoIconProps extends React.PropsWithChildren<object> {
  fill?: string;
}

const InfoIcon = (props: InfoIconProps) => {
  return (
    <>
      <div>
        <QuestionIcon fill={props.fill} />
      </div>
      <Box m={0.2} />
    </>
  );
};

export default InfoIcon;
