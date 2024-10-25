import { useRecoilValue } from "recoil";

import { tasksAtom } from "@digitask/shared-lib/atoms/backend/services/tasks";
import { TasksWithStatuses } from "@digitask/shared-lib/components/task";
import { Status } from "@digitask/shared-lib/components/task/tasks-with-statuses.types";
import { uppercase } from "@digitask/shared-lib/utils/uppercase";
import { Block } from "@mdreal/ui-kit";

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
