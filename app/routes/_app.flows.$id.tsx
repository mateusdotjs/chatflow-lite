import { Label } from "@radix-ui/react-label";
import { Link, redirect, useFetcher } from "react-router";
import FlowTitle from "~/components/flows/Title";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/_app.flows.$id";
import { getSession } from "~/auth/session.server";
import { prisma } from "~/db/prisma.server";
import { z } from "zod";
import FormSwitch from "~/components/flows/FormSwitch";
import { toast } from "sonner";
import { useEffect } from "react";
import { Textarea } from "~/components/ui/textarea";

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) {
    throw redirect("/login");
  }

  const { id } = params;
  const flow = await prisma.flow.findUnique({
    where: {
      id,
    },
  });

  return flow;
}

const patchSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  domain: z.string().min(1, { message: "Domínio é obrigatório" }),
  active: z
    .string()
    .optional()
    .refine((val) => val === "on" || val === undefined, {
      message: 'O atributo "active" deve ser "on" ou não enviado',
    }),
});

export async function action({ request, params }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) {
    throw redirect("/login");
  }
  const { id } = params;

  if (request.method === "PATCH") {
    const formData = await request.formData();
    const domain = formData.get("domain")?.toString();
    const name = formData.get("name")?.toString();
    const active = formData.get("active")?.toString();

    const result = patchSchema.safeParse({ name, domain, active });
    if (!result.success) {
      return {
        ok: false,
        error: {
          type: "validation",
          message: "Erro de validação nos campos",
          details: result.error.flatten(),
        },
      };
    }

    const flow = await prisma.flow.update({
      where: { id },
      data: {
        domain,
        name,
      },
    });

    return {
      ok: true,
      message: "Mudanças salvas.",
      flow,
    };
  } else if (request.method === "DELETE") {
    await prisma.flow.delete({
      where: { id },
    });

    return redirect("/flows?toast=Excluído com sucesso&state=success");
  }
}

export default function FlowIdPage({ loaderData }: Route.ComponentProps) {
  const flow = loaderData;
  const fetcher = useFetcher();
  const error = fetcher.data?.error;

  useEffect(() => {
    const message = fetcher.data?.message;
    if (message && fetcher.state === "idle") {
      if (fetcher.data.ok) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  }, [fetcher]);

  return (
    <div className="p-6 w-full">
      <FlowTitle>Dados do fluxo</FlowTitle>
      <p className="text-muted-foreground mb-6 w-full inline-block">
        Edite os dados se desejar
      </p>
      <div className="flex gap-48">
        <fetcher.Form method="patch" className="space-y-4 w-96">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Nome do fluxo</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Nome"
              defaultValue={flow?.name}
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="domain">Domínio</Label>
            <Input
              id="domain"
              type="text"
              name="domain"
              placeholder="Domínio"
              defaultValue={flow?.domain}
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="flowId">ID</Label>
            <Input
              id="flowId"
              type="text"
              disabled
              defaultValue={flow?.id}
              required
            />
          </div>
          {error && error.type === "business" && (
            <p className="text-red-600">{error.message}</p>
          )}
          {error && error.type === "validation" && (
            <div className="space-y-1">
              {error.details?.fieldErrors &&
                Object.values(error.details.fieldErrors as string[][]).flatMap(
                  (messages) =>
                    messages.map((message) => (
                      <p key={message} className="text-red-600">
                        {message}
                      </p>
                    ))
                )}
            </div>
          )}
          <Button type="submit" className="w-full">
            Salvar alterações
          </Button>
        </fetcher.Form>
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="scriptTag">
              Cole isto na tag script do seu index.html:
            </Label>
            <Textarea
              id="scriptTag"
              className="min-h-24"
              disabled
              defaultValue={`<script src="${
                import.meta.env.VITE_DOMAIN
                  ? import.meta.env.VITE_DOMAIN
                  : "http://locahost:5173"
              }/chatflow-loader" data-id="${flow?.id}"></script>`}
              required
            />
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-500" asChild>
            <Link to={`/editor/${flow?.id}`}>Criar/modificar nós do fluxo</Link>
          </Button>
          <Button variant={"outline"} className="w-full" asChild>
            <Link to={"/flows"}>Voltar para flows</Link>
          </Button>
          <fetcher.Form method="delete">
            <Button type="submit" variant={"destructive"} className="w-full">
              Excluir fluxo
            </Button>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}
