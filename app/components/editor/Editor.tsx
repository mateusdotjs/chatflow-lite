import { ReactFlowProvider, type Node } from "@xyflow/react";
import Sidebar from "./Sidebar";
import Flow from "./Flow";
import { useEffect } from "react";
import { useAppStore } from "~/store";
import type { GraphType } from "~/types/nodeTypes";

export default function Editor({ nodes, edges }: GraphType) {
  const { initializeState } = useAppStore();

  useEffect(() => {
    initializeState(nodes, edges);
  }, [nodes, edges]);

  return (
    <div className="flex flex-1 w-full h-full">
      <ReactFlowProvider>
        <Sidebar />
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}
