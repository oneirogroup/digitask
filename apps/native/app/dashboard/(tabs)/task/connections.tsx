import { useState } from "react";

import { Block } from "@mdreal/ui-kit";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../../api";
import { TasksWithStatuses } from "../../../../components/task";
import { Status } from "../../../../components/task/task-list-with-tags.types";
import { cache } from "../../../../utils/cache";
import { uppercase } from "../../../../utils/uppercase";

export default function Connections() {
  const [statuses, setStatuses] = useState<Status[]>([]);

  const { data: tasks = [] } = useQuery({
    queryKey: [cache.user.profile.tasks],
    queryFn: () => api.services.tasks.$get,
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
