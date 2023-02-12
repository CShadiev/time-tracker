export interface SessionJournalItem {
  id: string;
  expected_time: number | null; // in seconds
  time: number; // in seconds
  task_id: string;
  finished_at: string; // iso string with timezone
}

export interface SessionJournalState {
  items: SessionJournalItem[];
}
