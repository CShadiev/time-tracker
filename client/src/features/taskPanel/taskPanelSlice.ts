import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  TaskPanelState,
  MenuItem,
  Task,
  Subtask,
  Project,
} from "./taskPanelTypes";
import { v4 as uuidv4 } from "uuid";
import { findNode, deleteNodes } from "../utils";
import { AppThunk, RootState } from "../../app/store";
import { validateCountDown } from "../countDownTimer/countDownSlice";
import { safeResetCountDown } from "../countDownTimer/countDownSlice";
import { UpdateItemPayload } from "./taskPanelTypes";

const initialState: TaskPanelState = {
  menuItems: [
    {
      key: "1",
      label: "Project One",
      level: "project",
      user_id: "1",
      description: "This is a project",
      completed_at: null,
      created_at: "2023-01-01 00:00:00",
      is_removed: false,
      children: [
        {
          key: "1-1",
          label: "Task One",
          level: "task",
          description: "",
          project_id: "1",
          created_at: "2023-01-01 00:00:00",
          expected_time: null,
          completed_at: null,
          is_removed: false,
        },
      ],
    },
  ],
  openKeys: [],
  renamingItem: null,
  selectedItem: null,
};

export const counterSlice = createSlice({
  name: "taskPanel",
  initialState,
  reducers: {
    setMenuItems: (
      state,
      action: PayloadAction<Project[]>
    ) => {
      state.menuItems = action.payload;
    },
    addProject: (state) => {
      const key = uuidv4();
      state.menuItems.push({
        key,
        label: "New Project",
        level: "project",
        description: "",
        user_id: "1",
        created_at: new Date().toISOString(),
        completed_at: null,
        is_removed: false,
      });
    },
    removeProject: (
      state,
      action: PayloadAction<string>
    ) => {
      state.menuItems = state.menuItems.filter(
        (item) => item.key !== action.payload
      );
    },
    addTask: (state, action: PayloadAction<string>) => {
      let node = null;

      for (let i = 0; i < state.menuItems.length; i++) {
        node = findNode(
          state.menuItems[i],
          (node: any) => node.key === action.payload
        );
        if (node) {
          break;
        }
      }

      if (node) {
        const level =
          node.level === "project" ? "task" : "subtask";
        if (!node.children) {
          node.children = [];
        }

        const key = uuidv4();
        node.children.push({
          key: key,
          label: `New ${level}`,
          level,
        });
        state.openKeys.push(node.key);
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      deleteNodes(
        state.menuItems,
        (j: any) => j.key === action.payload
      );
    },
    setRenamingItem: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.renamingItem = action.payload;
    },
    renameItem: (
      state,
      action: PayloadAction<{ key: string; label: string }>
    ) => {
      let node = null;

      for (let i = 0; i < state.menuItems.length; i++) {
        node = findNode(
          state.menuItems[i],
          (node: any) => node.key === action.payload.key
        );
        if (node) {
          break;
        }
      }

      if (node) {
        node.label = action.payload.label;
      }
    },
    setOpenKeys: (
      state,
      action: PayloadAction<string[]>
    ) => {
      state.openKeys = action.payload;
    },
    _selectItem: (state, action: PayloadAction<string>) => {
      state.selectedItem = action.payload;
    },
    updateItem: (
      state,
      action: PayloadAction<UpdateItemPayload>
    ) => {
      const node = findNode(
        state.menuItems,
        (node: Task | Subtask) =>
          node.key === action.payload.key
      );

      if (!node) {
        return;
      }

      Object.assign(node, action.payload);
    },
  },
});

export const {
  setMenuItems,
  addProject,
  addTask,
  setRenamingItem,
  renameItem,
  setOpenKeys,
  removeProject,
  removeTask,
  _selectItem,
  updateItem,
} = counterSlice.actions;

export const selectCurrentItem = (
  state: RootState
): Task | Subtask | null => {
  const id = state.taskPanel.selectedItem;
  if (!id) {
    return null;
  }
  const node = findNode(
    state.taskPanel.menuItems,
    (node: MenuItem) => node.key === id
  );
  return node;
};

/**
 * select task for the next session.
 * automatically checks if current session is finished.
 * if it is not, then it saves the current session, and
 * resets the timer before selecting the new task.
 */
export const selectItem = (id: string): AppThunk => {
  return (dispatch) => {
    dispatch(safeResetCountDown());
    dispatch(_selectItem(id));
    dispatch(validateCountDown());
  };
};

export const taskPanelReducer = counterSlice.reducer;
