import { Backend } from "../../types";

export const useSendMessage = (cb: (message: Pick<Backend.Message, "content" | "room">) => void) => {
  return (message: Pick<Backend.Message, "content" | "room">) => {
    cb(message);
  };
};
