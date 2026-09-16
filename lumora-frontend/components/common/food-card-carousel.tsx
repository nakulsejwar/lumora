import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useNutrientsStore, { FoodItem } from "@/lib/hooks/use-nutrients-store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getFoodItemCategory } from "@/lib/utils";

export function FoodCardCarousel() {
  const pathname = usePathname();
  const foodData = useNutrientsStore((state) => state.nutrientsData);
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-xs md:max-w-lg lg:max-w-3xl "
    >
      <CarouselContent className="">
        {foodData.map((item: FoodItem, index) => (
          <CarouselItem key={index} className="  md:basis-1/2 lg:basis-1/3  ">
            <div className="p-1 flex items-center justify-center">
              <Card className="border border-blue-200 w-[250px] relative">
                <CardContent className="flex flex-col items-center justify-center !p-0">
                  <p className="absolute top-1 right-1">
                    {getFoodItemCategory(pathname.split("/")[2], item) ? (
                      <span className="bg-white text-green-500 text-xs shadow-md rounded-full px-2 py-1 ">
                        ✅{pathname.split("/")[2]}
                      </span>
                    ) : (
                      <span className="bg-white text-red-500 text-xs shadow-md rounded-full px-2 py-1">
                        ❌{pathname.split("/")[2]}
                      </span>
                    )}
                  </p>
                  <div id="illustration" className="w-full rounded-t-lg h-40 ">
                    {/* <Image
                      priority
                      className={` w-full h-full object-cover rounded-t-lg `}
                      src={item.}
                      width={500}
                      height={500}
                      alt=""
                    /> */}
                  </div>
                  <p
                    id="affirmation"
                    className="px-1 pt-1 text-xl leading-tight"
                  >
                    {item.Name}
                  </p>
                  <p className="text-2xl font-semibold bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-500  bg-clip-text text-transparent">
                    Lumora Metrics
                  </p>
                  <p className="">
                    Serving Size
                    <span className="pl-1 text-sm text-gray-600">
                      {"("}100 g{")"}{" "}
                    </span>
                  </p>

                  <p className="text-left text-sm w-full px-2">
                    Calories
                    <span className="pl-1 text-xs font-semibold">
                      {item.Calories}
                    </span>
                  </p>
                  <div className="grid grid-cols-2 place-items-start place-content-between text-sm  w-full  px-2 pb-3">
                    <p className="">
                      Protein
                      <span className="pl-1 text-xs font-semibold">
                        {item.Protein}g
                      </span>
                    </p>
                    <p className="">
                      Fat
                      <span className="pl-1 text-xs font-semibold">
                        {item.Fat}g
                      </span>
                    </p>
                    <p className="">
                      Carbs
                      <span className="pl-1 text-xs font-semibold">
                        {item.Carbs}g
                      </span>
                    </p>
                    <p className="">
                      Fiber
                      <span className="pl-1 text-xs font-semibold">
                        {item.Fiber}g
                      </span>
                    </p>
                    <p className="">
                      Sugar
                      <span className="pl-1 text-xs font-semibold">
                        {item.Sugar}g
                      </span>
                    </p>
                    <p className="">
                      Water
                      <span className="pl-1 text-xs font-semibold">
                        {item.Water}g
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
