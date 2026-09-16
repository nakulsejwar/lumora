"use client";

import { IgrFinancialChart } from "igniteui-react-charts";
import { IgrFinancialChartModule } from "igniteui-react-charts";
import { MultiSelect } from "./MultiSelect";
import { Button } from "./ui/button";
import { useState } from "react";
import { getStockData } from "@/lib/stock";

IgrFinancialChartModule.register();

export default function Chart() {
  const [selected, setSelected] = useState<
    Record<"symbol" | "instrument_name" | "exchange", string>[]
  >([]);
  const [chartData, setChartData] = useState<any[] | null>(null);

  const [showPercentChange, toggelPercentChange] = useState(true);

  const handleSubmit = async () => {
    const symbols = selected.map((item) => {
      return {
        symbol: item.symbol,
        name: item.instrument_name,
      };
    });

    (async function () {
      const data = await getStockData(symbols);
      setChartData(data);
    })();
  };

  return (
    <div className={` w-full max-w-7xl mx-auto  px-1 md:px-5`}>
      <div className="flex items-center gap-5 pt-20">
        <MultiSelect
          selected={selected}
          onChange={setSelected}
          className="w-64 md:w-96"
        />

        <Button variant="outline" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      {chartData && (
        <Button
          variant="outline"
          className="my-3"
          onClick={() => toggelPercentChange(!showPercentChange)}
        >
          {showPercentChange ? "Percent Change" : "Financial Prices"}
        </Button>
      )}

      {chartData && (
        <div className="w-full max-w-6xl mx-auto mt-12">
          <div className="h-screen">
            <IgrFinancialChart
              width="100%"
              height="100%"
              chartType="Line"
              thickness={2}
              chartTitle={`${selected
                .map((item) => {
                  return item.instrument_name;
                })
                .join(" vs ")}`}
              subtitle=""
              yAxisMode={showPercentChange ? "PercentChange" : "Numeric"}
              yAxisTitle={
                showPercentChange ? "Percent Changed" : "Financial Prices"
              }
              dataSource={chartData}
            />
          </div>
        </div>
      )}

      {/* {(!chartData || !articles) && chartLoad && (
        <div className="flex gap-4">
          <CircleDashed className="animate-spin-slow" />
          Loading...
        </div>
      )} */}
    </div>
  );
}
