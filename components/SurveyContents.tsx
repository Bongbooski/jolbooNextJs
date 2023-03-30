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
      <div className="surveryContentContainer">
        <Typography variant="h5" gutterBottom>
          {props.title}
        </Typography>
        {props.required && <Typography>필수</Typography>}
        <div className="descriptionContainer">
          <div className="descriptionArea">
            {Array.isArray(props.description)
              ? props.description.map((description, index) => {
                  return (
                    <div
                      key={`${props.title}_description_${index}`}
                      className="description"
                    >
                      <div>
                        <QuestionIcon fill="#6e6d6d" />{" "}
                      </div>
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
            {!props.description && <div className="description" />}
          </div>
          <div className="contents">{props.children}</div>
        </div>
      </div>
      <style jsx>{`
        .surveryContentContainer {
          display: flex;
          flex-direction: ${props.vertical ? "row" : "column"};
          justify-content: ${props.vertical ? "" : "center"};
          gap: 10px;
          padding: 30px 50px;
          white-space: pre-wrap;
          text-align: left;
        }
        .descriptionContainer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .description {
          display: flex;
          max-width: 600px;
          min-width: 600px;
        }
        .contents {
          margin-left: auto;
        }
      `}</style>
    </>
  );
};

export default SurveyContents;
