import { useState } from "react";
import { useAppStore } from "../../store";
import { X } from "lucide-react";
import { Position } from "@xyflow/react";
import { NodeType } from "../../types/nodeTypes";
import CustomHandle from "./CustomHandle";
import { Input } from "../ui/input";

type NodeItemProps = {
  optionId?: string;
  text: string;
  parentNodeId: string;
  type: string;
  handle?: boolean;
};

export default function NodeItem({
  optionId,
  text,
  parentNodeId,
  type,
  handle = true,
}: NodeItemProps) {
  const [value, setValue] = useState(text);
  const [isFocused, setIsFocused] = useState(false);
  const { editMessage, editOption, removeOption } = useAppStore();

  function handleSave() {
    if (isFocused) setIsFocused(false);
    if (type === NodeType.MESSAGE) {
      editMessage(parentNodeId, value);
    } else if (type === NodeType.OPTIONS && optionId) {
      editOption(parentNodeId, optionId, value);
    }
  }

  function handleRemove() {
    if (type === NodeType.OPTIONS && optionId) {
      removeOption(parentNodeId, optionId);
    }
  }

  return (
    <div className="relative flex w-full gap-3 px-4">
      <div className="relative no-drag no-pan">
        <Input
          type="text"
          value={value}
          placeholder="Write something here..."
          onFocus={() => setIsFocused(true)}
          onBlur={handleSave}
          onChange={(e) => setValue(e.target.value)}
        />
        {isFocused && type === NodeType.OPTIONS && (
          <div
            className={`p-1 rounded-full bg-red-400 absolute -right-2 -top-2 z-50 ${
              isFocused ? "block" : "hidden"
            }`}
            onClick={handleRemove}
            onMouseDown={(e) => {
              e.preventDefault();
              handleRemove;
            }}
          >
            <X size={15} />
          </div>
        )}
      </div>
      {handle && (
        <CustomHandle
          id={optionId ? `handle-s-${optionId}` : `handle-s-${parentNodeId}`}
          className="h-[10px] w-[10px] rounded-full"
          type="source"
          position={Position.Right}
        />
      )}
    </div>
  );
}
