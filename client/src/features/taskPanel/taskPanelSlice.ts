import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TaskPanelState,
  Task,
  Subtask,
  Project,
  MenuItem,
} from "./taskPanelTypes";
import { v4 as uuidv4 } from "uuid";
import { findNode, deleteNodes } from "../utils";
import { AppThunk, RootState } from "../../app/store";
import { validateCountDown } from "../countDownTimer/countDownSlice";
import { safeResetCountDown } from "../countDownTimer/countDownSlice";
import { UpdateItemPayload } from "./taskPanelTypes";

const initialState: TaskPanelState = {
  aboutDrawerOpen: false,
  menuItems: [],
  openKeys: [],
  renamingItem: null,
  selectedItem: null,
  selectedLevel: null,
};

export const counterSlice = createSlice({
  name: "taskPanel",
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<Project[]>) => {
      state.menuItems = action.payload;
    },
    addProject: (state) => {
      const key = uuidv4();
      state.menuItems.push({
        key,
        label: "New Project",
        level: "project",
        description: "",
        created_at: new Date().toISOString(),
        is_archived: false,
      });
    },
    removeProject: (state, action: PayloadAction<string>) => {
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
        const level = node.level === "project" ? "task" : "subtask";
        if (!node.children) {
          node.children = [];
        }

        const key = uuidv4();
        node.children.push({
          key: key,
          label: `New ${level}`,
          level,
          created_at: new Date().toISOString(),
          is_removed: false,
          expected_time: null,
          description: null,
        });
        state.openKeys.push(node.key);
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      deleteNodes(state.menuItems, (j: any) => j.key === action.payload);
    },
    setRenamingItem: (state, action: PayloadAction<string | null>) => {
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
    setOpenKeys: (state, action: PayloadAction<string[]>) => {
      state.openKeys = action.payload;
    },
    _selectItem: (state, action: PayloadAction<string>) => {
      state.selectedItem = action.payload;
    },
    _selectLevel: (state, action: PayloadAction<MenuItem["level"]>) => {
      state.selectedLevel = action.payload;
    },
    updateItem: (state, action: PayloadAction<UpdateItemPayload>) => {
      const node = findNode(
        state.menuItems,
        (node: Task | Subtask) => node.key === action.payload.key
      );

      if (!node) {
        return;
      }

      Object.assign(node, action.payload);
    },
    setAboutDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.aboutDrawerOpen = action.payload;
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
  _selectLevel,
  updateItem,
  setAboutDrawerOpen,
} = counterSlice.actions;

export const selectCurrentItem = (state: RootState): string | null => {
  const id = state.taskPanel.selectedItem;
  if (!id) {
    return null;
  }
  return id;
};

/**
 * select task for the next session.
 * automatically checks if current session is finished.
 * if it is not, then it saves the current session, and
 * resets the timer before selecting the new task.
 */
export const selectItem = (id: string, keyPath: string[]): AppThunk => {
  return (dispatch) => {
    let level: MenuItem["level"] = "project";
    if (keyPath.length > 1) {
      level = keyPath.length === 2 ? "task" : "subtask";
    }
    dispatch(safeResetCountDown());
    dispatch(_selectLevel(level));
    dispatch(_selectItem(id));
    dispatch(validateCountDown());
  };
};

export const taskPanelReducer = counterSlice.reducer;
