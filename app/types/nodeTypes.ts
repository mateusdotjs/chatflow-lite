import type { Edge, Node } from "@xyflow/react";

export type BaseNodeData = {
  label: string;
};

export type MessageNodeData = BaseNodeData & {
  message: string;
};

export type Option = {
  id: string;
  text: string;
};

export type OptionsNodeData = BaseNodeData &
  MessageNodeData & {
    options: Option[];
  };

export enum NodeType {
  MESSAGE = "message",
  OPTIONS = "options",
  INPUT = "message_input",
  VALIDATION = "validation",
}

export type GraphType = {
  nodes: Node[];
  edges: Edge[];
};