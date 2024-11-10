import { api, fields, tasksAtom, useRecoilQuery } from "@digitask/shared-lib";

export const useTasksInit = (type: "connection" | "problem") => {
  useRecoilQuery(tasksAtom(type), {
    queryKey: [fields.tasks],
    queryFn: () => api.services.tasks.$get
  });
};
