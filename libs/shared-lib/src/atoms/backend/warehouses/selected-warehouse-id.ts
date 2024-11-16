import { atom } from "recoil";

export const selectedWarehouseIdAtom = atom<number | null>({
  key: "selectedWarehouseId",
  default: null
});
