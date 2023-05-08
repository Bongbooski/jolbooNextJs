import "../styles/globals.css";
import type { AppProps } from "next/app";
import * as ga from "../lib/ga/gtag";
import { RecoilRoot } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";
import { MuiThemeProvider } from "../context/ThemeProvider";
import AppLayout from "../components/layout/AppLayout";
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

/*For Per-page layout! */
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      ga.pageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <MuiThemeProvider>
      <RecoilRoot>
        <CssBaseline />
        {getLayout(<Component {...pageProps} />)}
        <style jsx global>{``}</style>
      </RecoilRoot>
    </MuiThemeProvider>
  );
};

export default App;
