import { useState } from "react";
import { useAppStore } from "../../../store";
import { X } from "lucide-react";
import { Position } from "@xyflow/react";
import CustomHandle from "../CustomHandle";
import { Input } from "../../ui/input";

type OptionInputProps = {
  optionId: string;
  text: string;
  parentNodeId: string;
};

export default function OptionInput({
  optionId,
  text,
  parentNodeId,
}: OptionInputProps) {
  const [value, setValue] = useState(text);
  const [isFocused, setIsFocused] = useState(false);
  const { editOption, removeOption } = useAppStore();

  function handleSave() {
    if (isFocused) setIsFocused(false);
    editOption(parentNodeId, optionId, value);
  }

  function handleRemove() {
    removeOption(parentNodeId, optionId);
  }

  return (
    <div className="relative flex w-full px-4">
      <div className="relative no-drag no-pan">
        <Input
          type="text"
          value={value}
          placeholder="Sua opção aqui"
          onFocus={() => setIsFocused(true)}
          onBlur={handleSave}
          onChange={(e) => setValue(e.target.value)}
        />
        {isFocused && (
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
      <CustomHandle
        id={`handle-s-${optionId}`}
        className="h-[10px] w-[10px] rounded-full"
        type="source"
        position={Position.Right}
      />
    </div>
  );
}
