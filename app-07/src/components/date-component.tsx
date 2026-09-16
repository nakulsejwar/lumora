import React from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(relativeTime);
const timeZone = dayjs.tz.guess();
function DateComponent({
  datetime,
  type = "date",
}: {
  datetime: string;
  type?: "date" | "datetime" | "relative";
}) {
  return (
    <>
      {type === "date" &&
        dayjs.utc(datetime).tz(timeZone).format("DD MMM YYYY")}
      {type === "datetime" &&
        dayjs.utc(datetime).tz(timeZone).format("DD MMM YYYY HH:mm A")}
      {type === "relative" && dayjs.utc(datetime).tz(timeZone).fromNow()}
    </>
  );
}

export default DateComponent;
