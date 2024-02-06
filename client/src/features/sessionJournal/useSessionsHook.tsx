import { useQuery } from "@tanstack/react-query";
import { addDays, differenceInSeconds, endOfDay, startOfDay } from "date-fns";
import { getSessionsQueryFn } from "../../api/sessions";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

// calculate seconds to the next day
const getSecondsToNextDay = (today: Date) => {
    const tomorrow = addDays(startOfDay(today), 1);
    return differenceInSeconds(tomorrow, new Date());
}

export const useSessions = () => {
    const [targetDate, setTargetDate] = useState(startOfDay(new Date()));
    const { data: sessions } = useQuery(
        ["sessions", { start: targetDate, end: endOfDay(targetDate) }],
        getSessionsQueryFn
      );

    // schedule update of the target date
    useInterval(() => {
        setTargetDate(startOfDay(new Date()));
    }, Math.min((getSecondsToNextDay(targetDate) + 1), 1) * 1000);

    return sessions;
}
