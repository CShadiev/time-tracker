import { useQuery } from "@tanstack/react-query";
import {
  differenceInDays,
  endOfDay,
  format,
  parseISO,
  startOfDay,
  subDays,
} from "date-fns";
import { getSessionsQueryFn } from "../../api/sessions";
import {
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "antd";
import { useMemo, useState } from "react";
import { useEventListener, useLocalStorage } from "usehooks-ts";

const parseStartDay = (lookbackDays: number) => {
  return subDays(startOfDay(new Date()), lookbackDays);
};

export const PerformanceChart = () => {

  const [lookbackDays, setLookbackDays] = useLocalStorage('performanceChartLookbackDays', 6);
  const start = useMemo(() => parseStartDay(lookbackDays), [lookbackDays]);
  const end = endOfDay(new Date());
  const { data } = useQuery(["sessions", { start, end }], getSessionsQueryFn);
  const [isHovered, setIsHovered] = useState(false);
  const wheelEventListener = useEventListener(
    "wheel",
    (e) => isHovered && e.preventDefault(),
    undefined,
    { passive: false }
  );

  let index = 0;
  const days = new Map<string, number>();
  const sessionsByDay = data?.reduce((acc, session) => {
    const _day = format(parseISO(session.completed_at), "dd.MM");
    if (!days.has(_day)) {
      days.set(_day, index);
      acc.push({ day: _day, minutes: 0 });
      index++;
    }

    const _i = days.get(_day);
    if (_i !== undefined) {
      acc[_i].minutes += Math.floor(session.duration / 60);
    }

    return acc;
  }, [] as { day: string; minutes: number }[]);

  const handelWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      if (differenceInDays(end, start) > 30) return;
      setLookbackDays(lookbackDays + 1);
    } else {
      if (differenceInDays(end, start) < 14) return;
      setLookbackDays(lookbackDays - 1);
    }
  };

  return (
    <Card title={"Performance"} bodyStyle={{ padding: "0" }}>
      {/* {sessionsByDay && sessionsByDay.length === 0 && (
        <div style={{ padding: "2rem", color: "GrayText" }}>No data yet</div>
      )} */}

      <div
        onWheelCapture={handelWheel}
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart
            data={sessionsByDay}
            style={{ fontSize: ".8rem" }}
            margin={{
              bottom: 0,
              left: 14,
              right: 14,
              top: 8,
            }}
          >
            <XAxis dataKey="day" interval={1} fontSize={".6rem"} />
            <YAxis dataKey="minutes" hide />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="#2e7e1d"
              fill="#2e7e1d"
            />
            <Tooltip />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
