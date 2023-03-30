import { Box } from "@mui/material";
import Navbar from "../Navbar";

const HeaderLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <div>
        <Navbar />
        <div className="content">{children}</div>
        <style jsx>{`
          .content {
            position: relative;
            padding-top: 150px;
            background-color: #f3f5fd;
          }
        `}</style>
      </div>
    </>
  );
};

export default HeaderLayout;
