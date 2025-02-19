import type React from "react";

export default function FlowTitle({ children }: { children: React.ReactNode }) {
  return <h1 className={"text-5xl font-semibold mb-4 w-full inline-block"}>{children}</h1>;
}
