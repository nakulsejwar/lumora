import React from "react";
import { BookOpen, Search } from "lucide-react";

type UnitBannerProps = {
  title: string;
  description: string;
};

export const UnitBanner = ({ title, description }: UnitBannerProps) => {
  return (
    <div className="w-full rounded-2xl bg-[#070235] text-white p-5 border border-[#0091cf]/40 shadow-md relative overflow-hidden my-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0091cf]/20 border border-[#89ceff]/40 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-[#fe932c]" />
        </div>
        <div className="space-y-1">
          <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#89ceff]">
            Module Reading Mission
          </div>
          <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight leading-snug">
            {title}
          </h3>
          {description && description !== "None" && (
            <p className="text-xs text-[#eaedff]/90 leading-relaxed max-w-2xl mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

