import { FC } from "react";

import { Text } from "@oneiro/ui-kit";

import { DateService } from "../../../services/date-service";
import { TaskDate as TaskDateProps } from "../task.types";

export const TaskDate: FC<TaskDateProps> = ({ start, end }) => {
  const startDate = DateService.from(start);
  const endDate = end ? DateService.from(end) : null;
  const diff = endDate ? startDate.diff(endDate) : null;
  const isDiffInNextDay =
    !endDate || (diff && endDate && diff.seconds > 0 && diff.days < 1 && endDate.getDay() !== startDate.getDay());

  const dateParts = [];
  dateParts.push(`${startDate.format("pr")},`);
  if (isDiffInNextDay) {
    dateParts.push(startDate.format("hh:mm"));
    if (endDate) {
      dateParts.push("-");
      dateParts.push(endDate.format("pr, hh:mm"));
    }
  } else {
    dateParts.push(startDate.format("hh:mm"));
    if (endDate) {
      dateParts.push("-");
      dateParts.push(endDate.format("hh:mm"));
    }
  }

  return <Text>{dateParts.join(" ")}</Text>;
};
