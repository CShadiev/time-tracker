import { Project } from "../taskPanel/taskPanelTypes";

export const menuItemsData: Project[] = [
  {
    key: "1",
    label: "Project One",
    level: "project",
    description: "This is a project",
    created_at: "2023-01-01T00:00:00",
    is_archived: false,
    children: [
      {
        key: "1-1",
        label: "My Brand New Task",
        level: "task",
        description: "",
        project_id: "1",
        created_at: "2023-01-01T00:00:00",
        expected_time: 360 * 60,
        completed_at: null,
        is_archived: false,
      },
      {
        key: "1-2",
        label: "Elon's Tusk",
        level: "task",
        description: "This is a short description.\n\n\n\n\n...\n\nOr is it?",
        project_id: "1",
        created_at: "2023-01-01T00:00:00",
        expected_time: 360 * 60,
        completed_at: null,
        is_archived: false,
      },
    ],
  },
  {
    key: "2",
    label: "Some Other Project",
    level: "project",
    description: "This is a project",
    created_at: "2023-01-01T00:00:00",
    is_archived: false,
    children: [
      {
        key: "2-1",
        label: "Yet Another Task",
        level: "task",
        description: "",
        project_id: "1",
        created_at: "2023-01-01T00:00:00",
        expected_time: 360,
        completed_at: null,
        is_archived: false,
      },
      {
        key: "2-2",
        label: "Very Complex Task",
        level: "task",
        description: "",
        project_id: "1",
        created_at: "2023-01-01T00:00:00",
        expected_time: 360,
        completed_at: null,
        is_archived: false,
        children: [
          {
            key: "2-2-1",
            parent_task_id: "2-2",
            level: "subtask",
            label: "Part One of the Grand Plan",
            description: "Uhm...",
            project_id: "1",
            created_at: "2023-01-01T00:00:00",
            completed_at: null,
            expected_time: null,
            is_archived: false,
          },
          {
            key: "2-2-2",
            parent_task_id: "2-2",
            level: "subtask",
            label: "Final Part of the Grand Plan... or Something",
            description: "Uhm...",
            project_id: "1",
            created_at: "2023-01-01T00:00:00",
            completed_at: null,
            expected_time: null,
            is_archived: false,
          },
        ],
      },
    ],
  },
];
