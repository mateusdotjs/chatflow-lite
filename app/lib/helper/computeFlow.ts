import type { Edge, Node } from "@xyflow/react";
import type { JsonData } from "~/types/chatbot";
import { NodeType, type Option } from "~/types/nodeTypes";

export default function computeFlow(
  nodes: Node[],
  edges: Edge[]
): JsonData[] {
  const flow = nodes
    .map((node) => {
      if (node.type === NodeType.MESSAGE || node.type === NodeType.INPUT) {
        let next: null | string = null;
        const nextEdge = edges.filter((edge) => edge.source === node.id);
        if (nextEdge.length === 0) next = null;
        if (nextEdge.length === 1) next = nextEdge[0].target;

        return {
          id: node.id,
          message: String(node.data.message),
          type: node.type,
          next,
        };
      } else if (node.type === NodeType.OPTIONS) {
        const options = (node.data.options as Option[]).map((option) => {
          let next: null | string = null;
          const nextEdge = edges.filter(
            (edge) => edge.sourceHandle === `handle-s-${option.id}`
          );
          if (nextEdge.length === 0) next = null;
          if (nextEdge.length === 1) next = nextEdge[0].target;
          return {
            id: option.id,
            text: option.text,
            next,
          };
        });

        return {
          id: node.id,
          message: String(node.data.message),
          options,
          type: node.type,
        };
      }
    })
    .filter((node) => node !== undefined);

  return flow;
}
