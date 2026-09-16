import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FoodItem } from "./hooks/use-nutrients-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFoodItemCategory = (game: string, item: FoodItem) => {
  switch (game) {
    case "sugary-foods":
      if (item.HighSugar === 1) {
        return true;
      } else if (item.HighSugar === -1) {
        return false;
      }
      break;

    case "water-rich-foods":
      if (item.HighWater === 1) {
        return true;
      } else if (item.HighWater === -1) {
        return false;
      }
      break;
    case "calorie-dense-foods":
      if (item.HighCalories === 1) {
        return true;
      } else if (item.HighCalories === -1) {
        return false;
      }
      break;
    case "fibrous-foods":
      if (item.HighFiber === 1) {
        return true;
      } else if (item.HighFiber === -1) {
        return false;
      }
      break;
    case "fatty-foods":
      if (item.HighFat === 1) {
        return true;
      } else if (item.HighFat === -1) {
        return false;
      }
      break;
    case "protein-rich-foods":
      if (item.HighProtein === 1) {
        return true;
      } else if (item.HighProtein === -1) {
        return false;
      }
      break;
    case "carby-foods":
      if (item.HighCarbs === 1) {
        return true;
      } else if (item.HighCarbs === -1) {
        return false;
      }
      break;
    case "healthy-foods":
      if (item.IsHealthy === 1) {
        return true;
      } else if (item.IsHealthy === -1) {
        return false;
      }
      break;

    default:
      return false;
      break;
  }
};

export const getBgColorClass = (game: string, direction: "left" | "right") => {
  if (direction === "left") {
    return ["Healthy", "Water", "Fiber", "Protein"].includes(game)
      ? "bg-answerBad-500"
      : "bg-answerGood-500";
  } else {
    return ["Healthy", "Water", "Fiber", "Protein"].includes(game)
      ? "bg-answerGood-500"
      : ["Fat", "Carbs"].includes(game)
      ? "bg-blue-500"
      : "bg-answerBad-500";
  }
};
export function emphasizeText(
  gameName: string,
  input: string
): React.ReactNode {
  if (["Healthy", "Water", "Fiber", "Protein"].includes(gameName)) {
    return input
      .replace(
        /YES/g,
        '<span class="font-bold bg-answerGood-500 rounded-sm px-1 py-0.5">YES</span>'
      )
      .replace(
        /NO/g,
        '<span class="font-bold bg-answerBad-500 rounded-sm px-1 py-0.5">NO</span>'
      )
      .replace(/<pagebreak>/g, "<br />");
  } else if (["Fat", "Carbs"].includes(gameName)) {
    return input
      .replace(
        /YES/g,
        '<span class="font-bold bg-blue-500 rounded-sm px-1 py-0.5">YES</span>'
      )
      .replace(
        /NO/g,
        '<span class="font-bold bg-answerGood-500 rounded-sm px-1 py-0.5">NO</span>'
      )
      .replace(/<pagebreak>/g, "<br />");
  } else {
    return input
      .replace(
        /YES/g,
        '<span class="font-bold bg-answerBad-500  rounded-sm px-1 py-0.5">YES</span>'
      )
      .replace(
        /NO/g,
        '<span class="font-bold bg-answerGood-500 rounded-sm px-1 py-0.5">NO</span>'
      )
      .replace(/<pagebreak>/g, "<br />");
  }
}

export function formatTimeDelta(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const secs = Math.floor(seconds - hours * 3600 - minutes * 60);
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0) {
    parts.push(`${secs}s`);
  }
  return parts.join(" ");
}
