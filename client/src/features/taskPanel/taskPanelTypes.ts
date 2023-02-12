// high-order abstraction of panel menu items
export interface MenuItem {
  key: string;
  label: string;
  level: "project" | "task" | "subtask";
  children?: MenuItem[];
}

export interface Project extends MenuItem {
  user_id: string;
  description: string | null;
  created_at: string;
  completed_at: string | null;
  is_removed: boolean;
  children?: Task[];
}

export interface Task extends MenuItem {
  description: string | null;
  project_id: string;
  created_at: string;
  completed_at: string | null;
  expected_time: number | null; // in seconds
  is_removed: boolean;
  level: "task";
  children?: Subtask[];
}

export interface Subtask
  extends Omit<Task, "level" | "children"> {
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
