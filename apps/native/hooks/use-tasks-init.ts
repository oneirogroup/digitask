import { api, fields, tasksAtom, useRecoilQuery } from "@digitask/shared-lib";

export const useTasksInit = () => {
  useRecoilQuery(tasksAtom, {
    queryKey: [fields.tasks],
    queryFn: () => api.services.tasks.$get
  });
};
