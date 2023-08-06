import axios from "axios";
import { apiBase } from "../app/config";

export const saveSessionMutationFn = async (params: {
  initialCount: number;
  taskId: string;
}) => {
  const { initialCount, taskId } = params;
  axios.post(apiBase + "/session/add", {
    task_id: taskId,
    completed_at: new Date().toISOString(),
    duration: initialCount,
  });
};
