import { Box } from "@mui/material";
import Navbar from "../Navbar";

const HeaderLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className={"jolbooWrapper"}>
      <div className={"pageWrapper"}>
        <Navbar />
        <div className="content">{children}</div>
      </div>
      <style jsx>{`
        .jolbooWrapper {
          text-align: center;
          background-color: #f3f5fd;
        }
        .pageWrapper {
          display: inline-block;
          justify-content: center;
        }
        .content {
          position: relative;
          top: 180px;
        }
      `}</style>
    </div>
  );
};

export default HeaderLayout;
