import { useEffect, useState } from "react";
import {
  format,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from "date-fns";
import type { TimeAgoProps } from "../types/type";

const TimeAgo = ({ timestamp }: TimeAgoProps) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const date = new Date(timestamp);

  let relative: string;
  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);
  const weeks = differenceInWeeks(now, date);
  const months = differenceInMonths(now, date);

  if (minutes < 1) {
    relative = "just now";
  } else if (minutes < 60) {
    relative = `${minutes}m ago`;
  } else if (hours < 24) {
    relative = `${hours}h ago`;
  } else if (days < 7) {
    relative = `${days}d ago`;
  } else if (weeks < 5) {
    relative = `${weeks}w ago`;
  } else if (months < 12) {
    relative = `${months}mo ago`;
  } else {
    relative = format(date, "MMM d, yyyy");
  }

  const absolute = format(date, "MMM d, yyyy h:mm a");

  return (
    <span className="text-gray-500" title={absolute}>
      {relative}
    </span>
  );
};

export default TimeAgo;
