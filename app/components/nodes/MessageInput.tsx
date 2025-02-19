import { useState } from "react";
import { useAppStore } from "../../store";
import { Textarea } from "../ui/textarea";
import CustomHandle from "./CustomHandle";
import { Position } from "@xyflow/react";

type MessageInputProps = {
  text: string;
  parentNodeId: string;
  handle?: boolean;
};

export default function MessageInput({
  text,
  parentNodeId,
  handle = true,
}: MessageInputProps) {
  const [value, setValue] = useState(text);
  const [isFocused, setIsFocused] = useState(false);
  const { editMessage } = useAppStore();

  function handleSave() {
    if (isFocused) setIsFocused(false);
    editMessage(parentNodeId, value);
  }

  return (
    <div className="relative flex w-full gap-3 px-4">
      <div className="relative no-drag no-pan w-full">
        <Textarea
          className="w-full"
          value={value}
          placeholder="Sua mensagem aqui"
          onFocus={() => setIsFocused(true)}
          onBlur={handleSave}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      {handle && (
        <CustomHandle
          id={`handle-s-${parentNodeId}`}
          className="h-[10px] w-[10px] rounded-full"
          type="source"
          position={Position.Right}
        />
      )}
    </div>
  );
}
