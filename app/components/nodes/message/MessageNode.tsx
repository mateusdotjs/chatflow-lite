import { type NodeProps, Position } from "@xyflow/react";
import { type MessageNodeData } from "../../../types/nodeTypes";
import NodeItem from "../NodeItem";
import CustomHandle from "../CustomHandle";
import NodeShell from "../NodeShell";
import NodeHeader from "../NodeHeader";
import MessageInput from "../MessageInput";

type MessageNodeProps = NodeProps & { data: MessageNodeData };

export default function MessageNode({
  data,
  id,
  type,
  selected,
}: MessageNodeProps) {
  return (
    <NodeShell selected={selected}>
      <NodeHeader label={data.label} color="bg-green-500" id={id} />
      <div className="nodrag py-4">
        <MessageInput parentNodeId={id} text={data.message}/>
      </div>
    </NodeShell>
  );
}
