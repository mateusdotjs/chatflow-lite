import {
  Handle,
  type HandleProps,
  useNodeConnections,
} from "@xyflow/react";

export default function CustomHandle(props: HandleProps) {
  const connections = useNodeConnections({
    handleType: props.type,
    id: props.id,
  });

  const isConnectable = props.type === "target" ? true : connections.length < 1;

  return <Handle {...props} isConnectable={isConnectable} />;
}
