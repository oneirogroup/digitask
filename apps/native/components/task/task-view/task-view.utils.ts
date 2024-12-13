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
  [TaskStatuses.Waiting]: "Gözləyir",
  [TaskStatuses.InProgress]: "Qəbul edilib",
  [TaskStatuses.Started]: "Başlanıb",
  [TaskStatuses.Completed]: "Tamamlandı"
};

export const buttonTranslations = {
  [TaskStatuses.Waiting]: "Başla",
  [TaskStatuses.InProgress]: "Qəbul et",
  [TaskStatuses.Started]: "Tamamla",
  [TaskStatuses.Completed]: "Tamamlandı"
};
