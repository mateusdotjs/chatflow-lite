import { getSession } from "~/auth/session.server";
import type { Route } from "./+types/_app.flows._index";
import { Link, redirect, useNavigate, useSearchParams } from "react-router";
import { prisma } from "~/db/prisma.server";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import FlowTitle from "~/components/flows/Title";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) {
    throw redirect("/login");
  }
  const id = session.get("userEmail");
  const profile = await prisma.profile.findUnique({
    where: {
      email: id,
    },
  });

  const flows = await prisma.flow.findMany({
    where: {
      profileId: profile?.id,
    },
  });

  return flows;
}

export default function FlowsIndexPage({ loaderData }: Route.ComponentProps) {
  const flows = loaderData;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("toast");
    const state = searchParams.get("state");

    if (message) {
      if (state === "success") toast.success(message, { id: message });
      else if (state === "fail") toast.error(message, { id: message });
      else toast(message, { id: message });
      navigate("/flows", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="p-6">
      <FlowTitle>Fluxos</FlowTitle>
      <ul className="flex flex-wrap gap-4">
        {flows?.map((flow) => (
          <Link key={flow.id} to={`${flow.id}`}>
            <Card className="w-72 h-36 p-4">
              <CardTitle className="line-clamp-2">{flow.name}</CardTitle>
              <CardDescription>
                Atualizado em {formatDate(flow.updatedAt)}
              </CardDescription>
              <CardContent className="pt-2 px-0">
                <p>Domínio: {flow.domain}</p>
                <p>Ativo: {flow.active ? "Sim" : "Não"}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        <Link to={"create"}>
          <Card className="w-72 h-36 bg-neutral-900 text-neutral-100">
            <CardContent className="flex items-center justify-center w-full h-full p-0">
              <Plus className="mr-1" />
              Criar novo
            </CardContent>
          </Card>
        </Link>
      </ul>
    </div>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}
