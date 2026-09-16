"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircleDashed } from "lucide-react";
import { IgrFinancialChart } from "igniteui-react-charts";
import { IgrFinancialChartModule } from "igniteui-react-charts";
import { useDebounce } from "use-debounce";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import { MultiSelect } from "./MultiSelect";

IgrFinancialChartModule.register();

const TickersSchema = z.object({
  symbol: z.string(),
  name: z.string(),
});

const MultiSelectSchema = z.object({
  selected: z.array(z.string()),
  options: z.array(TickersSchema),
});

const FormSchema = z.object({
  symbol: z.string({
    required_error: "Please select a symbol.",
  }),
});

export default function Dashboard() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState(true);

  const [allData, setAllData] = useState(null);

  async function getData() {
    const data = await fetch("/api/tickers");
    const stockTicers = await data.json();
    setAllData(stockTicers.response);
  }

  // useEffect(() => {
  //   if (!allData) {
  //     getData();
  //   }
  // }, [allData]);

  const [tickers, setTickers] = useState<any>([]);
  const [symbol, setSymbol] = useState("");
  const [chartData, setChartData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [query] = useDebounce(text, 1000);

  function handleChange(event: any) {
    const input = event;
    setText(input);
  }

  useEffect(() => {
    async function fetchSuggestions(input: string) {
      setLoading(true);
      try {
        const tickers: any = await axios
          .post(`/api/suggestions?input=${input}`)
          .catch(function (error) {
            console.log(error);
          });

        const data = await tickers.data.results;
        setTickers(data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    if (query) {
      fetchSuggestions(query);
    }
  }, [query]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setChartData(null);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    const chartResponse = await fetch(
      `/api/stock?symbol=${symbol}&interval=daily`
    );
    const data2 = await chartResponse.json();
    const chartData = data2.data;

    setChartData(chartData);
  }

  // useEffect(() => {
  //   (async function () {
  //     const data = await getMultipleStocks();
  //     setChartData(data);
  //   })();
  // }, []);


  return (
    <div className={` w-full max-w-7xl mx-auto px-20`}>
      <div className="grid place-content-center p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field: {} }) => (
                  <FormItem className="flex flex-col">
                    {/* <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl id=":R7kracq:-form-item-description">
                          <Button
                            id=":R7kracq:-form-item"
                            aria-describedby=":R7kracq:-form-item-description"
                            aria-controls="radix-:R2nkracq:"
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-64 md:w-96 justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value || "Select Symbol"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 md:w-96 p-0">
                        <Command>
                          <CommandInput
                            onValueChange={(event) => {
                              handleChange(event);
                            }}
                            placeholder="Search symbol or name..."
                          />

                          <CommandList>
                            <CommandEmpty>
                              {loading ? " Loading...:" : "Not found "}
                            </CommandEmpty>
                            <CommandGroup>
                              {tickers?.map((ticker: any) => (
                                <CommandItem
                                  value={ticker.smybol}
                                  key={ticker.symbol}
                                  onSelect={() => {
                                    form.setValue("symbol", ticker.symbol);
                                    setSymbol(ticker.symbol);
                                    // console.log(ticker.symbol);
                                    setOpen(false);
                                  }}
                                >
                                  {`${ticker.name} (${ticker.currency})`}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover> */}

                    {/* <MultiSelect selected={field.value} /> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="outline" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>

        {/* <div className="flex gap-4">
            <CircleDashed className="animate-spin-slow" />
            Loading...
          </div> */}
      </div>

      {chartData && (
        <div className="bg-gray-100 w-full max-w-5xl mx-auto">
          <div className="h-[550px]">
            <IgrFinancialChart
              width="100%"
              height="100%"
              chartType="Line"
              thickness={2}
              chartTitle=""
              subtitle=""
              yAxisMode="PercentChange"
              yAxisTitle="Percent Changed"
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
