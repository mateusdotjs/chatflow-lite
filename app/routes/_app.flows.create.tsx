import { Label } from "@radix-ui/react-label";
import { Link, redirect, useFetcher } from "react-router";
import { getSession } from "~/auth/session.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { prisma } from "~/db/prisma.server";
import type { Route } from "./+types/_app.flows.create";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const postSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  domain: z.string().min(1, { message: "Domínio é obrigatório" }),
});

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) return;
  if (request.method === "POST") {
    const formData = await request.formData();
    const domain = formData.get("domain")?.toString();
    const name = formData.get("name")?.toString();

    const result = postSchema.safeParse({ name, domain });
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

    const email = session.get("userEmail");
    const profile = await prisma.profile.findUnique({ where: { email } });
    if (!profile) return;
    const flow = await prisma.flow.create({
      data: {
        name: name!,
        domain: domain!,
        profileId: profile.id,
      },
    });

    return redirect(`/flows/${flow.id}?toast=Fluxo criado com sucesso&state=success`);
  }
}

export default function FlowsCreatePage() {
  const fetcher = useFetcher();
  const error = fetcher.data?.error;

  return (
    <div className="w-full flex justify-center items-center gap-4 h-full">
      <Card className="w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Criar novo fluxo</CardTitle>
          <CardDescription>
            Escolha um nome e indique o domínio do chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form method="post">
            <div className="grid gap-4">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do fluxo</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Nome"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="domain">Domínio</Label>
                  </div>
                  <Input
                    id="domain"
                    type="text"
                    name="domain"
                    placeholder="Domínio"
                    required
                  />
                </div>
                {error && error.type === "business" && (
                  <p className="text-red-600">{error.message}</p>
                )}
                {error && error.type === "validation" && (
                  <div className="space-y-1">
                    {error.details?.fieldErrors &&
                      Object.values(
                        error.details.fieldErrors as string[][]
                      ).flatMap((messages) =>
                        messages.map((message) => (
                          <p key={message} className="text-red-600">
                            {message}
                          </p>
                        ))
                      )}
                  </div>
                )}
                <Button type="submit">Criar</Button>
              </div>
              <Button variant={"outline"} asChild>
                <Link to={"/flows"}>Cancelar</Link>
              </Button>
            </div>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
