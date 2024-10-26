import { Message } from "./message";

export interface PreviousMessages {
  count: number;
  next: string | null;
  previous: string | null;
  results: Message[];
}
