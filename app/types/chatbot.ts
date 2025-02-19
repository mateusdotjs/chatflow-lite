export type JsonData = {
  id: string;
  message: string;
  options?: {
    id: string;
    text: string;
    next: string | null;
  }[];
  type: string;
  next?: string | null;
};

export type PreviousMessageProps = Omit<JsonData, "next"> & {
  sender: "client" | "bot";
};
