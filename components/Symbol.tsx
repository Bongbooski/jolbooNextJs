import { Typography } from "@mui/material";
import SymbolIcon from "../asset/svg/Symbol.svg";

const Symbol = () => {
  return (
    <div className="symbolContainer">
      <SymbolIcon />
      <Typography variant="h3" gutterBottom>
        영끌계산기
      </Typography>
      <Typography variant="h4" gutterBottom>
        내 연봉으로 어떤 집에 살 수 있을까?
      </Typography>
      <style jsx>{`
        .symbolContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          padding: 40px 0px 20px 0px;
        }
      `}</style>
    </div>
  );
};

export default Symbol;
