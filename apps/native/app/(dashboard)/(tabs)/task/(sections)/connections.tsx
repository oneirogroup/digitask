import { useRecoilValue } from "recoil";

import { Block } from "@mdreal/ui-kit";

import { tasksAtom } from "../../../../../atoms/backend/services/tasks";
import { TasksWithStatuses } from "../../../../../components/task";
import { Status } from "../../../../../components/task/task-list-with-tags.types";
import { uppercase } from "../../../../../utils/uppercase";

export default function Connections() {
  const tasks = useRecoilValue(tasksAtom);
  const statuses = Array.from(new Set(tasks.map(task => task.status))).map<Status>(status => ({
    name: uppercase(status),
    status
  }));

  return (
    <Block.Scroll>
      <TasksWithStatuses
        className="my-6"
        statuses={statuses}
        tasks={tasks}
        onActiveStatusChange={console.log.bind(console, "digitask.native:dashboard:connections:active-tag")}
      />
    </Block.Scroll>
  );
}
