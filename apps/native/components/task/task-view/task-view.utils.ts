import { TaskStatuses } from "@digitask/shared-lib";

export const statuses = [
  TaskStatuses.All,
  TaskStatuses.Waiting,
  TaskStatuses.Started,
  TaskStatuses.InProgress,
  TaskStatuses.Completed
];

export const translations = {
  [TaskStatuses.All]: "Hamısı",
  [TaskStatuses.Started]: "Başlanıb",
  [TaskStatuses.Waiting]: "Gözləmədə",
  [TaskStatuses.InProgress]: "Davam edir",
  [TaskStatuses.Completed]: "Bitmiş"
};
