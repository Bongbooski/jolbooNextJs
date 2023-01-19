import "../styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";
import { MuiThemeProvider } from "../context/ThemeProvider";
import AppLayout from "../components/layout/AppLayout";
import { NextPage } from "next";

/*For Per-page layout! */
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <MuiThemeProvider>
      <RecoilRoot>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
        <style jsx global>{`
          /* a {
            color: green;
          } */
          body {
            background-color: #f3f5fd;
          }
        `}</style>
      </RecoilRoot>
    </MuiThemeProvider>
  );
};

export default App;
