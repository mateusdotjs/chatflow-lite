import { useShallow } from "zustand/shallow";
import {
  type CustomActionsSlice,
  type ReactFlowSlice,
  useAppStore,
  useDndStore,
} from "../../store";
import {
  Background,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { NodeType, type GraphType } from "../../types/nodeTypes";

import { type DragEvent, useCallback } from "react";
import createNode from "~/lib/helper/createNode";
import MessageNode from "../nodes/message/MessageNode";
import OptionsNode from "../nodes/options/OptionsNode";
import InputNode from "../nodes/input/InputNode";

const selector = (state: ReactFlowSlice & CustomActionsSlice) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
});

const nodeTypes = {
  [NodeType.MESSAGE]: MessageNode,
  [NodeType.OPTIONS]: OptionsNode,
  // [NodeType.INPUT]: InputNode,
};

export default function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } =
    useAppStore(useShallow(selector));

  const { type } = useDndStore();

  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (!type) return;

      const newNode = createNode(type, position);
      addNode(newNode);
    },
    [screenToFlowPosition, type]
  );

  return (
    <div className="w-full bg-base-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        snapToGrid={true}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
