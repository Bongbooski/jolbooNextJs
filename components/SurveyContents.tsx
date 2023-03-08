import { Typography } from "@mui/material";
import QuestionIcon from "../asset/svg/Question.svg";

interface SurveyContentsProps extends React.PropsWithChildren<object> {
  title: string;
  required?: boolean;
  vertical?: boolean;
  description?: string | string[];
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
          <div className="descriptionArea">
            {Array.isArray(props.description)
              ? props.description.map((description) => {
                  return (
                    <div className="description">
                      <QuestionIcon fill="#6e6d6d" />{" "}
                      <Typography variant="h6"> {description}</Typography>
                    </div>
                  );
                })
              : props.description && (
                  <div className="description">
                    <QuestionIcon fill="#6e6d6d" />{" "}
                    <Typography variant="h6"> {props.description}</Typography>
                  </div>
                )}
          </div>
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
          min-height: 55px;
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
