"use client";
import React from "react";
import { FoodCardModal } from "@/components/modals/food-card-modal";
import { useCardModal } from "@/lib/hooks/use-card-modal";
import useNutrientsStore, { FoodItem } from "@/lib/hooks/use-nutrients-store";
import { Check, Info, X, FileText, Search } from "lucide-react";
import { useGameStore } from "@/lib/hooks/use-game";
import { sendGTMEvent } from "@next/third-parties/google";

function MixedGameScoreCard() {
  const foodData = useNutrientsStore((state) => state.nutrientsData);
  const [selectedItem, setSelectedItem] = React.useState<FoodItem | null>(null);
  const { isOpen, onOpen } = useCardModal();
  const { game } = useGameStore();

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border border-[#c8c5d0]/70 bg-white shadow-xl p-5 sm:p-6 text-[#131b2e]">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#eaedff]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#070235] text-[#fe932c] flex items-center justify-center font-bold text-xs shadow-sm">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-extrabold text-[#070235] capitalize">
            {game.Name || "Evidence Claims Analysis"}
          </h3>
        </div>
        <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest bg-[#eaedff] text-[#070235] px-2.5 py-1 rounded-md">
          CLAIM RECORD
        </span>
      </div>

      {/* Claim Items List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {foodData.map((item: FoodItem, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8ff] border border-[#c8c5d0]/50 hover:border-[#0091cf]/40 transition-all text-left gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                  item.score
                    ? "bg-[#059669]/10 text-[#059669] border-[#059669]/30"
                    : "bg-[#ba1a1a]/10 text-[#ba1a1a] border-[#ba1a1a]/30"
                }`}
              >
                {item.score ? (
                  <Check className="w-4 h-4 text-[#059669] stroke-[3]" />
                ) : (
                  <X className="w-4 h-4 text-[#ba1a1a] stroke-[3]" />
                )}
              </div>
              <p className="text-sm font-medium text-[#131b2e] leading-snug truncate">
                {item.question}
              </p>
            </div>

            <button
              onClick={() => {
                sendGTMEvent({
                  event: "lumora_metrics_click",
                  foodName: item.Name,
                });
                setSelectedItem(item);
                onOpen();
              }}
              className="w-8 h-8 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#0091cf] flex items-center justify-center shrink-0 transition-colors shadow-xs"
              title="View Claim Evidence Details"
            >
              <Info className="w-4 h-4 text-[#0091cf]" />
            </button>
          </div>
        ))}
      </div>

      {/* Item Evidence Modal */}
      <FoodCardModal item={selectedItem!} />
    </div>
  );
}

export default MixedGameScoreCard;

