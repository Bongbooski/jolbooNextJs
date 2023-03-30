import Navbar from "./Navbar";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className={"jolbooWrapper"}>
      <Navbar />
      <div className="container">{children}</div>
      <style jsx>{`
        .jolbooWrapper {
          display: flex;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 30px;
          padding: 30px 0 0 0;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default Layout;
