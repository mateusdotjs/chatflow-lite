import { type NodeProps } from "@xyflow/react";
import { type OptionsNodeData } from "../../../types/nodeTypes";
import { PlusIcon } from "lucide-react";
import { useAppStore } from "../../../store";
import NodeShell from "../NodeShell";
import { Button } from "../../ui/button";
import NodeHeader from "../NodeHeader";
import MessageInput from "../MessageInput";
import OptionInput from "./OptionInput";

type OptionsNodeProps = NodeProps & { data: OptionsNodeData };

export default function OptionsNode({
  data,
  id,
  type,
  selected,
}: OptionsNodeProps) {
  const { addOption } = useAppStore();

  function handleCreate() {
    addOption(id);
  }

  return (
    <NodeShell selected={selected}>
      <NodeHeader label={data.label} color="bg-blue-500" id={id} />
      <div className="nodrag">
        <div className="border-b-[2px] pb-4">
          <div className="mb-4 flex justify-center bg-gray-100 py-1 text-gray-400">
            Mensagem
          </div>
          <MessageInput parentNodeId={id} text={data.message} handle={false} />
        </div>
        <div>
          <div className="mb-4 flex justify-center bg-gray-100 py-1 text-gray-400">
            Opções
          </div>
          <ul className="space-y-2 pb-4">
            {data.options.map((option) => (
              <OptionInput
                key={option.id}
                optionId={option.id}
                parentNodeId={id}
                text={option.text}
              />
            ))}
          </ul>
        </div>
        <div className="px-4 pb-4">
          <div
            className="flex items-center justify-center"
            onClick={handleCreate}
          >
            <Button className="w-full bg-gray-200 text-gray-500 hover:bg-gray-100">
              <PlusIcon size={16} />
            </Button>
          </div>
        </div>
      </div>
    </NodeShell>
  );
}
