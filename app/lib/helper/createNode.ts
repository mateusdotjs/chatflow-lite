import type { Node } from "@xyflow/react";
import { nanoid } from "nanoid";
import {
  type MessageNodeData,
  NodeType,
  type OptionsNodeData,
} from "~/types/nodeTypes";

type Position = {
  x: number;
  y: number;
};

export default function createNode(
  type: NodeType,
  position: Position
): Node<MessageNodeData | OptionsNodeData> {
  const baseNode = {
    id: nanoid(),
    position,
    type,
  };

  switch (type) {
    case NodeType.MESSAGE:
      return {
        ...baseNode,
        data: {
          label: "Mensagem",
          message: "",
        },
      };
    case NodeType.OPTIONS:
      return {
        ...baseNode,
        data: {
          label: "Opções",
          message: "",
          options: [
            {
              id: nanoid(),
              text: "",
            },
          ],
        },
      };
    case NodeType.INPUT:
      return {
        ...baseNode,
        data: {
          label: "Input",
          message: "",
        },
      };
    default:
      return {
        ...baseNode,
        data: {
          label: "Message",
          message: "",
        },
      };
  }
}
