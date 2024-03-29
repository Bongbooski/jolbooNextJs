import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@mui/styles";
import Script from "next/script";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1331839021898772`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-E6NWYCQ921`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-E6NWYCQ921');
          `,
            }}
          />
          <meta
            name="google-site-verification"
            content="k1jckqiuhGuqJNogAFbFY_Eldrk1R9Ws9gEOuNqidSc"
          />
          <meta
            name="naver-site-verification"
            content="63a6d2dbef2eebca9fa4ea51eaeb86b76db5e7cb"
          />
          <meta
            name="description"
            content="내 연봉으로 어떤 집에 살 수 있을까?"
          />
          <meta name="keywords" content="영끌계산기, 영끌, 부동산, 내집마련" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://letsbejolboos.com" />
          <meta property="og:title" content="영끌계산기" />
          <meta
            property="og:image"
            content="https://letsbejolboos.com/main.png"
          />
          <meta
            property="og:description"
            content="내 연봉으로 어떤 집에 살 수 있을까?"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const materialSheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        materialSheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    styles: <>{initialProps.styles}</>,
  };
};
