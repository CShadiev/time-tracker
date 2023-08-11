import axios from "axios";
import { apiBase } from "../app/config";
import { QueryFunction } from "@tanstack/react-query";
import { SessionJournalItem } from "../features/sessionJournal/sessionJournalTypes";

export const getSessionsQueryFn: QueryFunction<
  SessionJournalItem[],
  [string, { start: Date; end: Date }]
> = async (queryContext) => {
  const [_key, { start, end }] = queryContext.queryKey;
  const resp = await axios.post(apiBase + "/session/", {
    ts_start: start.toISOString(),
    ts_end: end.toISOString(),
  });
  const data = resp.data;
  return data;
};

export const saveSessionMutationFn = async (params: {
  initialCount: number;
  taskId: string;
}) => {
  const { initialCount, taskId } = params;
  return axios.post(apiBase + "/session/add", {
    task_id: taskId,
    completed_at: new Date().toISOString(),
    duration: initialCount,
  });
};
