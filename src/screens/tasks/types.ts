export type TaskStatus = 'TODO' | 'DOING' | 'REVIEW' | 'DONE';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type Task = {
  id: string;
  title: string;
  note?: string;
  status: TaskStatus;
  priority?: Priority;
  dueISO?: string;
  comments?: number;
  attachments?: number;
  assignees?: number;
};
