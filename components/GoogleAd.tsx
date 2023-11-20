import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const GoogleAd = () => {
  useEffect(() => {
    if (window.adsbygoogle && !window.adsbygoogle.loaded) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <div className="googleAd-container">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="fluid"
        data-ad-layout-key="-fb+5w+4e-db+86"
        data-ad-client="ca-pub-1331839021898772"
        data-ad-slot="7002854636"
      />
    </div>
  );
};

export default GoogleAd;
