import { Typography } from "@mui/material";
import React from "react";
import { Children, cloneElement } from "react";

interface SurveyContentsGroupProps extends React.PropsWithChildren<any> {}

const SurveyContentsGroup = (props: SurveyContentsGroupProps) => {
  return (
    <>
      <div className="container">{props.children}</div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default SurveyContentsGroup;
