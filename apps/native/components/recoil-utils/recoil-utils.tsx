import { RecoilState, RecoilValue, Snapshot, useRecoilCallback, useRecoilSnapshot } from "recoil";

let __snapshot: Snapshot = null as any;
let __set: <T>(recoilVal: RecoilState<T>, valOrUpdater: ((currVal: T) => T) | T) => void = null as any;

export const recoilExternals = {
  set<TData>(recoilVal: RecoilState<TData>, valOrUpdater: ((currVal: TData) => TData) | TData) {
    __set(recoilVal, valOrUpdater);
  },
  getLoadable<TData>(recoilValue: RecoilValue<TData>) {
    return __snapshot.getLoadable(recoilValue);
  }
};

export function RecoilUtils() {
  __snapshot = useRecoilSnapshot();

  useRecoilCallback(({ set }) => {
    __set = set;
    return async () => {};
  })();

  return <></>;
}
