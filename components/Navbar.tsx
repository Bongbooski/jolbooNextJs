import { Typography } from "@mui/material";
import SymbolIcon from "../asset/svg/Symbol.svg";

const Navbar = () => {
  return (
    <div className="header">
      <div className="content">
        <SymbolIcon />
        <Typography variant="h3" gutterBottom>
          영끌 계산기
        </Typography>
      </div>
      <style jsx>{`
        .header {
          left: 0;
          top: 0;
          position: fixed;
          height: 150px;
          width: 100%;
          background-color: #ffffff;
          z-index: 2;
        }
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 29px;
          gap: 10px;
        }
      `}</style>
    </div>
    // </nav>
  );
};

export default Navbar;
