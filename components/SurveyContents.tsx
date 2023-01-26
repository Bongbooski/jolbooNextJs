import { Typography } from "@mui/material";

interface SurveyContentsProps extends React.PropsWithChildren<object> {
  title: string;
  required?: boolean;
  vertical?: boolean;
}

const SurveyContents = (props: SurveyContentsProps) => {
  return (
    <>
      <div className="container">
        <Typography variant="h5" gutterBottom>
          {props.title}
        </Typography>
        {props.required && <Typography>필수</Typography>}
        <div className="contents">{props.children}</div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: ${props.vertical ? "row" : "column"};
          align-items: flex-start;
          justify-content: ${props.vertical ? "" : "center"};
          gap: 10px;
          padding: 30px 50px;
          white-space: pre-wrap;
        }
        .contents {
          margin-left: ${props.vertical ? "" : "auto"};
        }
      `}</style>
    </>
  );
};

export default SurveyContents;
