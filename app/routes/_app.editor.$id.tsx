import { getSession } from "~/auth/session.server";
import { redirect } from "react-router";
import { prisma } from "~/db/prisma.server";
import type { GraphType } from "~/types/nodeTypes";
import type { Route } from "./+types/_app.editor.$id";
import { ReactFlowProvider } from "@xyflow/react";
import Sidebar from "~/components/editor/Sidebar";
import Flow from "~/components/editor/Flow";
import { useAppStore } from "~/store";
import { useEffect } from "react";
import validateFlow from "~/lib/helper/validateFlow";

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) {
    throw redirect("/login");
  }

  const flowId = params.id;

  const flow = await prisma.flow.findUnique({
    where: {
      id: flowId,
    },
  });

  if (!flow) {
    throw redirect("/login");
  }

  const { nodes, edges } = flow as unknown as GraphType;

  if (!nodes || !edges) {
    return {
      nodes: [],
      edges: [],
    };
  }

  return { nodes, edges };
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) {
    throw redirect("/login");
  }
  const userId = session.get("userEmail");
  const flowId = params.id;

  const user = prisma.profile.findUnique({ where: { email: userId } });

  if (request.method === "PATCH") {
    const formData = await request.formData();
    const nodes = JSON.parse(formData.get("nodes")?.toString() ?? "[]");
    const edges = JSON.parse(formData.get("edges")?.toString() ?? "[]");

    const validate = validateFlow(nodes, edges);

    if (!validate.valid) {
      return {
        ok: false,
        message: validate.error,
      };
    }

    const result = await prisma.flow.update({
      where: {
        id: flowId,
      },
      data: {
        nodes,
        edges,
      },
    });

    return {
      ok: true,
      message: "Fluxo salvo.",
    };
  }
}

export default function EditorPage({ loaderData }: Route.ComponentProps) {
  const { nodes, edges } = loaderData as unknown as GraphType;
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
