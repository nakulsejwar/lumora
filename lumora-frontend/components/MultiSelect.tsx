"use client";
import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "use-debounce";
import axios, { AxiosError } from "axios";

export type OptionType = Record<
  "symbol" | "instrument_name" | "exchange",
  string
>;

interface MultiSelectProps {
  selected: Record<"symbol" | "instrument_name" | "exchange", string>[];
  onChange: React.Dispatch<
    React.SetStateAction<
      Record<"symbol" | "instrument_name" | "exchange", string>[]
    >
  >;
  className?: string;
  placeholder?: string;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({ selected, onChange, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);

    const handleUnselect = (
      item: Record<"symbol" | "instrument_name", string>
    ) => {
      onChange(selected.filter((i) => i.symbol !== item.symbol));
    };

    const [tickers, setTickers] = React.useState<any>([]);
    const [symbol, setSymbol] = React.useState("");
    const [chartData, setChartData] = React.useState<any[] | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [text, setText] = React.useState("");
    const [query] = useDebounce(text, 1000);

    function handleChange(event: any) {
      const input = event;
      setText(input);
    }

    React.useEffect(() => {
      async function fetchSuggestions(input: string) {
        setLoading(true);
        try {
          const { data: tickers } = await axios.post(
            `/api/suggestions?input=${input}`
          );

          // console.log(tickers.results);
          setTickers(tickers.results);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      }
      if (query) {
        fetchSuggestions(query);
      }
    }, [query]);

    // console.log(tickers);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className={className}>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-64 md:w-96 group  justify-between ${
              selected.length > 1 ? "h-full" : "h-10"
            }`}
            onClick={() => setOpen(!open)}
          >
            <div className="flex flex-wrap items-center gap-1">
              {selected.map((item) => (
                <Badge
                  variant="outline"
                  key={item.symbol}
                  className="flex items-center gap-1 group-hover:bg-background"
                  onClick={() => handleUnselect(item)}
                >
                  {item.symbol}
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="border-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </Button>
                </Badge>
              ))}
              {selected.length === 0 && (
                <span>{props.placeholder ?? "Select Symbol"}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 md:w-96 p-0">
          <Command className={className}>
            <CommandInput
              onValueChange={(event) => {
                handleChange(event);
              }}
              placeholder="Search symbol or name..."
              className="w-64 md:w-96"
            />
            <CommandEmpty>
              {loading ? " Loading...:" : "Not found "}
            </CommandEmpty>
            <CommandGroup className="max-h-64  overflow-auto">
              {!loading &&
                tickers.map((ticker: any) => (
                  <CommandItem
                    key={`${ticker.symbol}-${ticker.exchange}`}
                    onSelect={() => {
                      onChange(
                        selected.some((item) => item.symbol === ticker.symbol)
                          ? selected.filter(
                              (item) =>
                                item.symbol !== ticker.symbol &&
                                item.exchange !== ticker.exchange
                            )
                          : [...selected, ticker]
                      );
                      setOpen(true);
                    }}
                    className={`flex w-full items-center py-0.5 gap-1 text-xs ${
                      ticker.access.plan !== "Basic" ? "text-gray-200" : ""
                    }`}
                    disabled={ticker.access.plan !== "Basic"}
                  >
                    {`${ticker.symbol} - ${ticker.instrument_name} (${ticker.currency})`}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
