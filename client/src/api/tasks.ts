import axios from "axios";
import { apiBase } from "../app/config";

export interface ApiProject {
  key: string;
  user: string;
  label: string;
  description: string;
  created_at: string;
  level: "project";
  is_archived: boolean;
}

// get projects, including tasks and subtasks
export const getProjects = async (): Promise<ApiProject[]> => {
  const response = await axios.get(apiBase + "/projects");
  return response.data;
};
