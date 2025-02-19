import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { create, type StateCreator } from "zustand";
import type { NodeType, Option } from "./types/nodeTypes";
import editOption from "~/lib/helper/editOption";
import removeOption from "~/lib/helper/removeOption";
import { nanoid } from "nanoid";

type AppNode = Node;

export type ReactFlowSlice = {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes?: (nodes: AppNode[]) => void;
  setEdges?: (edges: Edge[]) => void;
};

export type CustomActionsSlice = {
  initializeState: (nodes: Node[], edges: Edge[]) => void;
  addNode: (node: AppNode) => void;
  editMessage: (id: string, newMessage: string) => void;
  addOption: (id: string) => void;
  editOption: (parentNodeId: string, id: string, newData: string) => void;
  removeOption: (parentNodeId: string, id: string) => void;
};

const createReactFlowSlice: StateCreator<
  ReactFlowSlice & CustomActionsSlice,
  [],
  [],
  ReactFlowSlice
> = (set) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) =>
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
  onEdgesChange: (changes) =>
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  onConnect: (connection) => {
    if (connection.target !== connection.source) {
      set((state) => ({
        edges: addEdge({ ...connection, type: "smoothstep" }, state.edges),
      }));
    }
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
});

const createCustomActionsSlice: StateCreator<
  ReactFlowSlice & CustomActionsSlice,
  [],
  [],
  CustomActionsSlice
> = (set) => ({
  initializeState: (nodes, edges) => set({ nodes, edges }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  editMessage: (id, newMessage) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        return node.id === id
          ? { ...node, data: { ...node.data, message: newMessage } }
          : node;
      }),
    })),

  addOption: (id) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        return node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                options: [
                  ...(node.data.options as Option[]),
                  { id: nanoid(), text: "" },
                ],
              },
            }
          : node;
      }),
    })),

  editOption: (parentNodeId, id, newText) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        return node.id === parentNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                options: editOption(node.data.options as Option[], id, newText),
              },
            }
          : node;
      }),
    })),

  removeOption: (parentNodeId, id) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        return node.id === parentNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                options: removeOption(node.data.options as Option[], id),
              },
            }
          : node;
      }),
    })),
});

export const useAppStore = create<ReactFlowSlice & CustomActionsSlice>()(
  (...a) => ({
    ...createReactFlowSlice(...a),
    ...createCustomActionsSlice(...a),
  })
);

export type DndStore = {
  type: null | NodeType;
  setType: (type: NodeType) => void;
};

export const useDndStore = create<DndStore>()((set) => ({
  type: null,
  setType: (type) => set({ type }),
}));
