import { Typography } from "@mui/material";
import QuestionIcon from "../asset/svg/Question.svg";

interface SurveyContentsProps extends React.PropsWithChildren<object> {
  title: string;
  required?: boolean;
  vertical?: boolean;
  description?: string;
}

const SurveyContents = (props: SurveyContentsProps) => {
  return (
    <>
      <div className="container">
        <Typography variant="h5" gutterBottom>
          {props.title}
        </Typography>
        {props.required && <Typography>필수</Typography>}
        <div className="descriptionContainer">
          {props.description && (
            <>
              <div className="description">
                <QuestionIcon />{" "}
                <Typography variant="h6"> {props.description}</Typography>
              </div>
            </>
          )}
          <div className="contents">{props.children}</div>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: ${props.vertical ? "row" : "column"};
          justify-content: ${props.vertical ? "" : "center"};
          gap: 10px;
          padding: 30px 50px;
          white-space: pre-wrap;
        }

        .descriptionContainer {
          display: flex;
          justify-content: space-between;
        }

        .description {
          display: flex;
        }
        .contents {
          margin-left: ${props.description ? "" : "auto"};
        }
      `}</style>
    </>
  );
};

export default SurveyContents;
