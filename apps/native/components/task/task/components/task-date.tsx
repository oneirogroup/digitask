import { TaskDate as TaskDateProps } from "apps/native/components/task/task/task.types";

import { FC } from "react";
import { Text } from "react-native";

import { DateService } from "@digitask/shared-lib/src/services/date-service";

export const TaskDate: FC<TaskDateProps> = ({ start, end }) => {
  const startDate = DateService.from(start);
  const endDate = DateService.from(end);
  const dateParts: string[] = [];
  const isDatesInSameDay = startDate.isSame(endDate, "day");

  if (isDatesInSameDay) {
    dateParts.push("Bu gün,");
    dateParts.push(startDate.format("hh:mm"));
    if (endDate) {
      dateParts.push("-");
      dateParts.push(endDate.format("hh:mm"));
    }
  } else {
    dateParts.push(startDate.format("DD.MM.YYYY hh:mm"));
    dateParts.push("-");
    dateParts.push(endDate.format("DD.MM.YYYY hh:mm"));
  }

  return <Text>{dateParts.join(" ")}</Text>;
};
