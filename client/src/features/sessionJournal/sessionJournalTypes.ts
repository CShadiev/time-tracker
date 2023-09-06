export interface SessionJournalItem {
  key: string;
  duration: number; // in seconds
  task_id: string;
  task: string;
  project: string;
  completed_at: string; // iso string with timezone
  user: string; // username
}

export interface SessionJournalState {
  items: SessionJournalItem[];
}

export interface GroupedSessions {
  [key: string]: {
    project: string;
    task: string;
    sessions: SessionJournalItem[];
  };
}
