import { Box } from "@mui/material";
import Navbar from "../Navbar";

const HeaderLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <div>
        <Navbar />
        <div className="content">{children}</div>
        {/* <div className="container">{children}</div> */}
        <style jsx>{`
          .content {
            position: relative;
            top: 300px;
          }
        `}</style>
      </div>
    </>
  );
};

export default HeaderLayout;
