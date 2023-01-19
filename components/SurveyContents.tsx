import { Typography } from "@mui/material";

interface SurveyContentsProps extends React.PropsWithChildren<object> {
  title: string;
  required?: boolean;
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
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 10px;
          padding: 30px 0 0 0;
          white-space: pre-wrap;
        }
        .contents {
          margin-left: auto;
        }
      `}</style>
    </>
  );
};

export default SurveyContents;
