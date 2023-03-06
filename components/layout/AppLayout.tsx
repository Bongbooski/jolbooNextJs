const AppLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <div className="container">
        {children}
        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            white-space: pre-wrap;
            background-color: #f3f5fd;
          }
        `}</style>
      </div>
    </>
  );
};

export default AppLayout;
