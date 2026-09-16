"use client";

import React, { useEffect } from "react";

type AdBannerTypes = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
  style?: {
    width: string;
    height: string;
  };
};

const AdBanner = ({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
  style,
}: AdBannerTypes) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full max-w-7xl mx-auto  border">
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={`ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
};

export default AdBanner;
