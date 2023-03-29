import { Typography } from "@mui/material";
import SymbolIcon from "../asset/svg/Symbol.svg";

const Symbol = () => {
  return (
    <div className="symbolContainer">
      <SymbolIcon />
      <Typography variant="h3" gutterBottom>
        영끌계산기
      </Typography>
      <style jsx>{`
        .symbolContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          padding-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default Symbol;
