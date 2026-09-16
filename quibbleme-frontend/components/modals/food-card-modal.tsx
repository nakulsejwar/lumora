"use client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/lib/hooks/use-card-modal";
import { FoodItem } from "@/lib/hooks/use-nutrients-store";
import { getFoodItemCategory } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ChevronRight, XIcon } from "lucide-react";
import { useGameStore } from "@/lib/hooks/use-game";

export const FoodCardModal = ({ item }: { item: FoodItem }) => {
  const cardModal = useCardModal();
  const pathname = usePathname();
  const { game } = useGameStore();
  const calories =
    item && item.type === "swipe"
      ? Number(
          (
            item.Fat! * 9 +
            (item.Carbs! - item.Fiber!) * 4 +
            item.Protein! * 4
          ).toFixed(0)
        )
      : 0;

  if (!item) return null;

  return (
    <Dialog open={cardModal.isOpen} onOpenChange={cardModal.onClose}>
      <DialogContent className="flex flex-col items-center !gap-0 w-full max-w-xs md:max-w-md p-0 overflow-hidden border-none shadow-none  ">
        <div className="flex w-full items-center justify-end ">
          <XIcon
            onClick={cardModal.onClose}
            className=" w-6 h-6  text-blue-500  z-50 cursor-pointer hover:scale-105"
          />
        </div>
        {[
          "Sug0916",
          "Wat3581",
          "Cal3334",
          "Fib4080",
          "Fat5747",
          "Pro0742",
          "Car9360",
          "Hea8072",
        ].includes(game.GameId) ? (
          <Card className="  border border-blue-200 w-[290px] relative">
            <CardContent className="flex flex-col items-center justify-center !p-0 ">
              <p className="absolute top-1 right-1">
                {getFoodItemCategory(pathname.split("/")[2], item) ? (
                  <span className="bg-white text-green-500 text-xs shadow-md rounded-full px-2 py-1 capitalize ">
                    {pathname.split("/")[2].replaceAll("-", " ")}
                  </span>
                ) : null}
              </p>
              <div id="illustration" className="w-full rounded-t-lg h-40 ">
                <Image
                  priority
                  className={` w-full h-full object-cover rounded-t-lg `}
                  src={item.ImageLink ? item.ImageLink : item.options![0].image}
                  width={500}
                  height={500}
                  alt=""
                />
              </div>

              {/* <p className="text-2xl font-semibold bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent">
            Lumora Metrics
          </p> */}
              <div className=" pt-2 text-sm flex items-center justify-between w-full px-2 py-1 border-b border-blue-300 ">
                <p className="font-semibold leading-tight">
                  {item.Name}{" "}
                  <span className="pl-1 text-sm font-normal text-gray-600">
                    {"("}100g{")"}{" "}
                  </span>
                </p>
                <p>
                  {calories} <span className="font-semibold">Calories</span>
                </p>
              </div>

              <div className="text-sm md:text-lg pb-1 w-full px-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold pr-2">Fat</span>
                    <span className="font-normal text-sm pl-2">
                      {item.Fat!.toFixed(1)}g
                    </span>
                  </div>
                  <span className="text-sm font-normal">
                    {(item.Fat! * 9).toFixed(0)}
                    {" ( "}
                    {(((item.Fat! * 9) / calories) * 100).toFixed(0)} % {")"}
                  </span>
                </div>
                <hr className="border-blue-300" />

                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold pr-2">Carbs</span>
                    <span className="font-normal text-sm pl-2">
                      {item.Carbs!.toFixed(1)}g
                    </span>
                  </div>
                  <span className="text-sm font-normal">
                    {((item.Carbs! - item.Fiber!) * 4).toFixed(0)} {" ("}{" "}
                    {(
                      (((item.Carbs! - item.Fiber!) * 4) / calories) *
                      100
                    ).toFixed(0)}{" "}
                    % {")"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="pl-5">
                    Fiber{" "}
                    <span className="font-normal text-sm pl-2">
                      {item.Fiber!.toFixed(1)}g
                    </span>{" "}
                  </div>
                  <span className="text-sm font-normal pr-[52px]">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="pl-5">
                    Sugar{" "}
                    <span className="font-normal text-sm pl-2">
                      {item.Sugar!.toFixed(1)}g
                    </span>{" "}
                  </div>
                  <span className="text-sm font-normal pr-[52px]">
                    {(item.Sugar! * 4).toFixed(0)}
                  </span>
                </div>
                <hr className="border-blue-300" />
                <div className="flex justify-between items-center">
                  <div className="font-bold">
                    Protein{" "}
                    <span className="font-normal text-sm pl-2">
                      {item.Protein!.toFixed(1)}g
                    </span>{" "}
                  </div>
                  <span className="text-sm font-normal">
                    {(item.Protein! * 4).toFixed(0)}
                    {" ( "}
                    {(((item.Protein! * 4) / calories) * 100).toFixed(0)} %{" "}
                    {")"}
                  </span>
                </div>
                <hr className="border-blue-300" />
                <div className="flex justify-between items-center">
                  <div className="font-bold">
                    Water{" "}
                    <span className="font-normal text-sm pl-2">
                      {item.Water!.toFixed(1)}g
                    </span>{" "}
                  </div>
                  <span className="text-sm font-normal pr-[52px] ">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="  border border-blue-200 w-full relative">
            <CardContent className="flex flex-col items-center justify-center !p-0 ">
              <div id="illustration" className="w-full rounded-t-lg  p-5 ">
                <p className="text-sm">
                  {" "}
                  <span className="text-xs"> Q.</span> {item?.question}
                </p>
                <div className="grid grid-cols-2 gap-1 md:gap-2 ">
                  {item
                    ?.options!.filter(
                      (option) =>
                        option.option &&
                        option.option !== "" &&
                        option.option !== "None"
                    )
                    .map((option, index) => (
                      <p className="text-xs md:text-sm mt-2" key={index}>
                        <span className="">
                          {" "}
                          {item?.answer!.length > 1
                            ? item.answer?.includes(index + 1)
                              ? "✅"
                              : "❌"
                            : item?.answer![0] - 1 === index
                            ? "✅"
                            : "❌"}
                        </span>{" "}
                        {option.option}
                      </p>
                    ))}
                </div>
                <div className="flex gap-1  mt-3">
                  <ChevronRight className="w-4 h-4" />
                  <p className="text-xs md:text-sm font-semibold   ">
                    {item.reason}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};
