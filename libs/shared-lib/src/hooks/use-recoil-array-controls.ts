import { type RecoilState, useSetRecoilState } from "recoil";

export const useRecoilArrayControls = <T extends { id: string | number }>(atom: RecoilState<T[]>) => {
  const setState = useSetRecoilState(atom);

  return {
    add(item: T) {
      setState(prevArray => [...prevArray, item]);
    },
    update(id: T["id"], item: T) {
      setState(prevArray =>
        prevArray.map(existingItem => (existingItem.id === id ? { ...existingItem, ...item } : existingItem))
      );
    },
    removeById(id: T["id"]) {
      setState(prevArray => prevArray.filter(existingItem => existingItem.id !== id));
    },
    removeItem(item: T) {
      setState(prevArray => prevArray.filter(existingItem => existingItem !== item));
    },
    clear() {
      setState([]);
    }
  };
};
