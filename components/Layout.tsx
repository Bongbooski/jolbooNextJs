import Navbar from "./Navbar";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="container">{children}</div>
      <style jsx>{`
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
    </>
  );
};

export default Layout;
