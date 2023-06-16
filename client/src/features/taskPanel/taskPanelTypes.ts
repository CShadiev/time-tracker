// high-order abstraction of panel menu items
export interface MenuItem {
  key: string;
  label: string; // max_len = 32
  level: "project" | "task" | "subtask";
  children?: MenuItem[];
}

export interface Project extends MenuItem {
  description: string | null; // max_len = 512
  created_at: string;
  is_archived: boolean;
  children?: Task[];
}

export interface Task extends MenuItem {
  description: string | null;
  project_id: string;
  created_at: string;
  completed_at: string | null;
  expected_time: number | null; // in seconds
  is_archived: boolean;
  level: "task";
  children?: Subtask[];
}

export interface Subtask extends Omit<Task, "level" | "children"> {
  parent_task_id: string;
  level: "subtask";
}

export interface TaskPanelState {
  menuItems: Project[];
  openKeys: string[];
  renamingItem: string | null;
  selectedItem: string | null;
}

export type TaskOrSubtask = Task | Subtask;

export type UpdateItemPayload = Partial<TaskOrSubtask> & {
  key: string;
};
