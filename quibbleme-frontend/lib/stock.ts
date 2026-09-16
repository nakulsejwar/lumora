import axios, { AxiosResponse } from "axios";

export async function getStockData(symbols: any): Promise<any> {
  const requests = symbols.map((item: any) =>
    axios.get(
      `https://api.twelvedata.com/time_series?symbol=${item.symbol}&interval=1day&outputsize=5000&apikey=${process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY}`
    )
  );

  try {
    const responses: AxiosResponse<any>[] = await axios.all(requests);
    const combinedData = responses.map((response, index) => {
      const convertedData = convertData(response.data.values);
      (convertedData as any).__dataIntents = {
        close: [`SeriesTitle/${symbols[index].name}`],
      };
      return convertedData.reverse();
    });

    return combinedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

function convertData(jsonData: any[]): StockItem[] {
  let stockItems: StockItem[] = [];

  for (let json of jsonData) {
    let originalDate;
    json?.date ? (originalDate = json.date) : (originalDate = json.datetime); // "2020-01-01"
    let item = new StockItem();

    item.date = new Date(originalDate);
    item.open = Number(json.open);
    item.high = Number(json.high);
    item.low = Number(json.low);
    item.close = Number(json.close);
    item.volume = Number(json.volume);
    stockItems.push(item);
  }

  return stockItems;
}

export class StockItem {
  public open?: number;
  public close?: number;
  public high?: number;
  public low?: number;
  public volume?: number;

  public date?: Date;
}
