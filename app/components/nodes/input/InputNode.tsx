import { type NodeProps, Position } from "@xyflow/react";
import { type MessageNodeData, NodeType } from "../../../types/nodeTypes";
import NodeShell from "../NodeShell";
import NodeHeader from "../NodeHeader";
import MessageInput from "../MessageInput";

type InputNodeProps = NodeProps & { data: MessageNodeData };

export default function InputNode({ data, id, selected }: InputNodeProps) {
  return (
    <NodeShell selected={selected}>
      <NodeHeader label={data.label} color="bg-amber-500" id={id} />
      <div className="nodrag py-4">
        <MessageInput
          parentNodeId={id}
          text={data.message}
        />
      </div>
    </NodeShell>
  );
}
