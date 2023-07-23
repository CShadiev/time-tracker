import axios from "axios";
import { apiBase } from "../app/config";
import { MenuItem, PanelMenuItem } from "../features/taskPanel/taskPanelTypes";

// get projects, including tasks and subtasks
export const getProjectsQuery = async (): Promise<PanelMenuItem[]> => {
  const response = await axios.get(apiBase + "/projects/?recursive=true");
  return response.data;
};

export const modifyItemMutationFn = async (params: {
  level: MenuItem["level"];
  key: string;
  label?: string;
  description?: string;
  expected_time?: number;
}) => {
  let url = apiBase;
  const { level, key, label, description, expected_time } = params;

  if (level === "project") {
    url += `/projects/${key}/modify/`;
  } else if (level === "task" || level === "subtask") {
    url += `/tasks/${key}/modify/`;
  }

  const body: any = {
    label: label,
  };
  if (label) {
    body.label = label;
  }
  if (description) {
    body.description = description;
  }
  if (expected_time) {
    body.expected_time = expected_time;
  }
  const resp = await axios.post(url, body);
  return resp;
};

export const deleteItemMutationFn = async (params: {
  level: MenuItem["level"];
  key: string;
}) => {
  const { level, key } = params;
  let url = apiBase;
  if (level === "project") {
    url += `/projects/${key}/archive/`;
  } else if (level === "task" || level === "subtask") {
    url += `/tasks/${key}/archive/`;
  }
  const resp = await axios.get(url);
  return resp;
};
