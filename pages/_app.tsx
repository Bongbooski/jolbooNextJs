import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { RecoilRoot } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
        <style jsx global>{`
          /* a {
            color: green;
          } */
        `}</style>
      </Layout>
    </RecoilRoot>
  );
};

export default App;
