import type { ReactNode } from "react";

export default function NodeShell({
  children,
  selected,
}: {
  children: ReactNode;
  selected: boolean | undefined;
}) {
  return (
    <div
      className={`border-2 rounded-lg ${
        selected ? "border-black" : "border-gray-200"
      } bg-white`}
    >
      {children}
    </div>
  );
}
