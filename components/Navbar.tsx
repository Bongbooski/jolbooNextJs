import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";
import SymbolIcon from "../asset/svg/Symbol.svg";

const Navbar = () => {
  return (
    <div className="header">
      <div className="content">
        <SymbolIcon />
        <Typography variant="h3" gutterBottom>
          영끌 계산기
        </Typography>
        <Typography>
          안녕하세요. 지금부터 입력한 내용은 이번 계산에만 활용하며 어떤 개인
          정보도 저장하지 않습니다.
        </Typography>
      </div>
      <style jsx>{`
        .header {
          left: 0;
          top: 0;
          position: fixed;
          height: 180px;
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
