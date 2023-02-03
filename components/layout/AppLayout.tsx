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
            gap: 30px;
            padding: 30px 0 0 0;
            white-space: pre-wrap;
            background-color: #f3f5fd;
          }
        `}</style>
      </div>
    </>
  );
};

export default AppLayout;
