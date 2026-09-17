import React from "react";
import Navbar from "@/components/common/navbar";
import AdBanner from "@/components/google-ads-banner";

const RouteLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pb-20 sm:pb-0">
      <Navbar />
      <div className="flex justify-center max-w-7xl mx-auto">
        <div className="hidden xl:block my-12  min-w-[180px] ">
          <AdBanner
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
            dataAdSlot="1470504191"
            style={{ width: "180px", height: "500px" }}
          />
        </div>

        <aside className="min-h-screen w-full mx-auto  max-w-5xl">
          {children}
        </aside>
        <div className="hidden xl:block my-12  min-w-[180px]  ">
          <AdBanner
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
            dataAdSlot="1470504191"
            style={{ width: "180px", height: "500px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default RouteLayout;
