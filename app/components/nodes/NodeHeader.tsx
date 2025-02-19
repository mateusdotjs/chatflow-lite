import { Position } from "@xyflow/react";
import CustomHandle from "./CustomHandle";

export default function NodeHeader({
  label,
  color,
  id,
}: {
  label: string;
  color: string;
  id: string;
}) {
  return (
    <div
      className={`relative ${color} rounded-t-md py-1 text-center text-base capitalize text-white`}
    >
      {label}
      <CustomHandle
        id={`handle-t-${id}`}
        className="h-[10px] w-[10px] rounded-full"
        type="target"
        position={Position.Left}
      />
    </div>
  );
}
