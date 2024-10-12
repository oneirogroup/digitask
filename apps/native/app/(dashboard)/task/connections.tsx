import { useState } from "react";

import { AuthHttp, Block } from "@oneiro/ui-kit";
import { useQuery } from "@tanstack/react-query";

import { TasksWithStatuses } from "../../../components/task";
import { Status } from "../../../components/task/task-list-with-tags.types";
import { Task } from "../../../types/backend/task";

const uppercase = (str: string) => str[0]?.toUpperCase() + str.slice(1);

export default function Connections() {
  const [statuses, setStatuses] = useState<Status[]>([]);

  const { data: tasks = [] } = useQuery({
    queryKey: ["digitask.native:dashboard:connections"],
    queryFn: () => AuthHttp.instance().get<Task[]>("/services/tasks"),
    select(tasks) {
      const states = Array.from(new Set(tasks.map(task => task.status)));
      const statuses = states.map<Status>(status => ({ name: uppercase(status), status }));
      setStatuses(statuses);
      return tasks;
    }
  });

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
