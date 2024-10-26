import { FC, useState } from "react";
import { View } from "react-native";

import { Block, cn } from "@mdreal/ui-kit";

import { getTags } from "../../utils/get-tags";
import { TagButton } from "./components/tag-button";
import { Task } from "./task";
import { Status, TaskListWithTagsProps } from "./tasks-with-statuses.types";

const allStatus: Status = { name: "All", status: "all" };

export const TasksWithStatuses: FC<TaskListWithTagsProps> = ({
  className,
  statuses,
  tasks,
  checkTag,
  onActiveStatusChange
}) => {
  const [activeStatus, setActiveStatus] = useState<Status | null>(allStatus);

  const handleTagButtonClick = (status: Status) => {
    setActiveStatus(status);
    onActiveStatusChange?.(status);
  };

  const filteredTasks =
    !activeStatus || activeStatus.status === allStatus.status
      ? tasks
      : tasks.filter(task => checkTag?.(task, activeStatus));

  return (
    <View className={cn(className, "flex gap-6")}>
      <Block.Scroll horizontal showsHorizontalScrollIndicator={false} contentClassName="flex flex-row gap-4">
        <View />
        <TagButton
          status={allStatus}
          isActive={activeStatus?.status === allStatus.status}
          onClick={handleTagButtonClick}
        />
        {statuses.map(status => (
          <TagButton
            key={status.status}
            status={status}
            isActive={activeStatus?.status === status.status}
            onClick={handleTagButtonClick}
          />
        ))}
        <View />
      </Block.Scroll>

      <Block className="flex gap-6 p-6">
        {filteredTasks.slice(0, 12).map(task => (
          <Task key={task.id} task={task} tags={getTags(task)} />
        ))}
      </Block>
    </View>
  );
};
