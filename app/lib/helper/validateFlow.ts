import type { Edge, Node } from "@xyflow/react";
import type { Option } from "~/types/nodeTypes";

export default function validateFlow(nodes: Node[], edges: Edge[]) {

  const targets = new Set(edges.map((edge) => edge.target));
  const startNode = nodes.filter((node) => !targets.has(node.id));
  if (startNode.length > 1) {
    return {
      valid: false,
      error: "Não foi possível salvar pois há nodes desconectados do fluxo.",
    };
  }

  const nodesWithError = nodes
    .filter((node) => {
      if (node.data.message === "") {
        return true;
      }

      if (node.data.options) {
        return (node.data.options as Option[]).some(
          (option) => option.text === "",
        );
      }

      return false;
    })
    .map((node) => node.id);

  if (nodesWithError.length > 0) {
    return {
      valid: false,
      error: "Não foi possível salvar pois há nodes com campos em branco.",
      nodes: nodesWithError,
    };
  }

  return { valid: true, error: null };
}

// function buildAdjacencyList(edges: Edge[]) {
//   return edges.reduce((acc: Record<string, string[]>, edge) => {
//     if (!acc[edge.source]) acc[edge.source] = [];
//     acc[edge.source].push(edge.target);
//     return acc;
//   }, {});
// }

// function depthFirstSearch(
//   graph: Record<string, string[]>,
//   nodes: Node[],
//   start: string,
// ) {
//   const visited = new Set();
//   const queue = [start];

//   while (queue.length > 0) {
//     console.log(queue);
//     const currentNode = queue.pop()!;
//     console.log(currentNode);

//     if (visited.has(currentNode)) continue;
//     // console.log("Verificando node: " + currentNode);
//     visited.add(currentNode);

//     for (const neighbor of graph[currentNode] || []) {
//       queue.push(neighbor);
//     }
//   }
// }
