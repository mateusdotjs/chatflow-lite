import { prisma } from "~/db/prisma.server";
import type { Route } from "./+types/graph";
import computeFlow from "~/lib/helper/computeFlow";
import type { GraphType } from "~/types/nodeTypes";

export async function loader({ request }: Route.LoaderArgs) {
//   console.log(request.headers.get("host"));
  const url = new URL(request.url);
  const chatbotId = url.searchParams.get("chatbotId");
  const domain = url.searchParams.get("domain");
  console.log(chatbotId, domain);

  if (!chatbotId || !domain) {
    return Response.json(
      { error: "Erro na requisição" },
      {
        status: 400,
      }
    );
  }

  const flow = await prisma.flow.findUnique({
    where: { id: chatbotId },
  });

  if (!flow)
    return Response.json(
      { error: "Chatbot não encontrado" },
      {
        status: 400,
      }
    );

  const { nodes, edges } = flow as unknown as GraphType;
  const graph = computeFlow(nodes, edges);
  return Response.json(graph, { status: 200 });
}
