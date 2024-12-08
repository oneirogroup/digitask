import { atom } from "recoil";

import { Backend } from "../../../types";
import { fields } from "../../../utils";

export const meetingsAtom = atom<Backend.Meeting[]>({
  key: fields.meeting,
  default: []
});
