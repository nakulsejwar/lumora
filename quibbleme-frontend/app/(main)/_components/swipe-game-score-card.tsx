"use client";
import React from "react";
import { FoodCardModal } from "@/components/modals/food-card-modal";
import { useCardModal } from "@/lib/hooks/use-card-modal";
import useNutrientsStore, { FoodItem } from "@/lib/hooks/use-nutrients-store";
import { Check, Info, X } from "lucide-react";
import { useGameStore } from "@/lib/hooks/use-game";
import { sendGTMEvent } from "@next/third-parties/google";

function SwipeGameScoreCard() {
  const foodData = useNutrientsStore((state) => state.nutrientsData);
  const [selectedItem, setSelectedItem] = React.useState<FoodItem | null>(null);
  const { isOpen, onOpen } = useCardModal();
  const { game } = useGameStore();
  return (
    <div className="rounded-xl shadow-md shadow-yellow-200  border border-blue-200  ">
      <table className=" min-w-[290px] md:w-[350px]  text-xs rounded-xl   ">
        <tbody className="rounded-xl  ">
          <tr className="text-xl md:text-2xl w-full ">
            <th
              className="p-1  border-b border-opacity-20 capitalize text-center bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent"
              colSpan={3}
            >
              {game.Name}
            </th>
          </tr>
          {foodData.map((item: FoodItem, index) => (
            <tr
              key={index}
              className=" border-b border-opacity-20 rounded-xl text-base md:text-xl z-50  p-1"
            >
              <td className=" px-3 py-1.5 md:py-1">
                <p className=" ">
                  {item.score ? (
                    <Check className="text-green-400 w-5 h-5" />
                  ) : (
                    <X className="text-red-400 w-5 h-5" />
                  )}
                </p>
              </td>
              <td className="py-1.5 md:py-1">
                <p className="capitalize text-left">{item.Name}</p>
              </td>
              <td className=" px-2">
                <button
                  onClick={() => {
                    sendGTMEvent({
                      event: "lumora_metrics_click",
                      foodName: item.Name,
                    });
                    setSelectedItem(item);
                    onOpen();
                  }}
                  id="Play again"
                  className=" flex items-center"
                >
                  <Info className=" text-white h-5 w-5 bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500 rounded-full shadow-md cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* nutrient data modal */}
      <FoodCardModal item={selectedItem!} />
      {/* <FoodCardCarousel /> */}
    </div>
  );
}

export default SwipeGameScoreCard;
