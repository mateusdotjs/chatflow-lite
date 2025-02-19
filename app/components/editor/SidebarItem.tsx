import type { DragEvent, ReactNode } from "react";
import { useDndStore } from "../../store";
import { NodeType } from "../../types/nodeTypes";

export default function SidebarItem({
  text,
  description,
  type,
  icon,
  iconBackground,
}: {
  text: string;
  description: string;
  type: NodeType;
  icon: ReactNode;
  iconBackground: string;
}) {
  const { setType } = useDndStore();

  const onDragStart = (event: DragEvent<HTMLDivElement>, type: NodeType) => {
    setType(type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="w-full flex gap-2 bg-white border border- rounded-lg p-2"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div
        className={`flex justify-center items-center rounded-md ${iconBackground} p-4 text-white`}
      >
        {icon}
      </div>
      <div>
        <p className="mb-1">{text}</p>
        <p className="text-muted-foreground text-xs line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}
