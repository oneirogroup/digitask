import { type RecoilState, useRecoilValue } from "recoil";

import { useRecoilArrayControls } from "./use-recoil-array-controls";

export const useRecoilArray = <T>(atom: RecoilState<T[]>) => {
  const state = useRecoilValue(atom);
  const controls = useRecoilArrayControls(atom);
  return [state, controls] as const;
};
