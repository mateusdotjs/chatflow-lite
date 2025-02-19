import { useEffect, useState } from "react";
import ChatbotFlow from "~/components/chatbot/ChatbotFlow";
import ChatHeader from "~/components/chatbot/ChatHeader";
import type { Route } from "./+types/chatbot";
import { prisma } from "~/db/prisma.server";
import computeFlow from "~/lib/helper/computeFlow";
import type { GraphType } from "~/types/nodeTypes";
import { Button } from "~/components/ui/button";
import { extractDomain } from "~/lib/helper/extractDomain";

export async function loader({ request }: Route.LoaderArgs) {
  const referer = String(request.headers.get("referer"));
  const domain = extractDomain(referer);
  const url = new URL(request.url);
  const chatbotId = url.searchParams.get("chatbotId");

  if (!chatbotId) {
    return { ok: false, error: "Chatbot não encontrado." };
  }

  const flow = await prisma.flow.findUnique({
    where: { id: chatbotId },
  });

  if (domain !== flow?.domain) {
    return { ok: false, error: "Não permitido." };
  }

  const { nodes, edges } = flow as unknown as GraphType;
  const graph = computeFlow(nodes, edges);

  return { ok: true, graph };
}

export default function ChatbotPage({ loaderData }: Route.ComponentProps) {
  const data = loaderData;
  const [start, setStart] = useState(false);

  return (
    <div className="pt-16 h-full items-center justify-center">
      <ChatHeader />
      <div className="h-full flex flex-1 items-center justify-center bg-gray-50 w-full">
        {!start && data.ok && (
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setStart(true)}
          >
            Iniciar conversa
          </Button>
        )}
        {!data.ok && <p>{data.error}</p>}
        {start && data.ok && data.graph && (
          <div className="h-full w-full flex">
            <ChatbotFlow data={data.graph} />
          </div>
        )}
      </div>
    </div>
  );
}
