import { api, fields, meetingsAtom, useRecoilQuery } from "@digitask/shared-lib";

export const useMeetingsInit = () => {
  useRecoilQuery(meetingsAtom, {
    queryKey: [fields.meeting],
    queryFn: () => api.services.meetings.$get()
  });
};
