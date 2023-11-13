import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const GoogleAd = (props: any) => {
  // const { currentPath } = props;
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className="googleAd-container">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-client="ca-pub-1331839021898772"
        data-ad-slot="5894519611"
      />
    </div>
  );
};

export default GoogleAd;
