import { Link, redirect, useFetcher } from "react-router";
import { z } from "zod";
import { prisma } from "~/db/prisma.server";
import type { Route } from "./+types/_public.login";
import * as argon2 from "argon2";
import { commitSession, getSession } from "~/auth/session.server";
import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userEmail")) {
    throw redirect("/flows");
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    return {
      ok: false,
      error: {
        type: "validation",
        message: "Erro de validação nos campos",
        details: result.error.flatten(), // Usando flatten para pegar os detalhes de erro
      },
    };
  }

  // Procurar o usuário no banco de dados
  const user = await prisma.auth.findUnique({ where: { email } });
  if (!user) {
    return {
      ok: false,
      error: { type: "business", message: "Email ou senha inválidos" },
    };
  }

  // Verificar se a senha está correta
  const isPasswordCorrect = await argon2.verify(user.pass, password!);
  if (!isPasswordCorrect) {
    return {
      ok: false,
      error: { type: "business", message: "Email ou senha inválidos" },
    };
  }

  // Criar a sessão
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userEmail", user.email);
  return redirect("/flows", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function LoginPage() {
  const fetcher = useFetcher();
  const error = fetcher.data?.error;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          Chatflow
        </a>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Bem vindo</CardTitle>
              <CardDescription>Faça login com email e senha</CardDescription>
            </CardHeader>
            <CardContent>
              <fetcher.Form method="post">
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Senha</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        name="password"
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
                              <p key={message} className="text-red-600">{message}</p>
                            ))
                          )}
                      </div>
                    )}
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Não tem uma conta?{" "}
                    <Link to={'/register'} className="underline underline-offset-4">
                      Registre-se
                    </Link>
                  </div>
                </div>
              </fetcher.Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            Clicando em continuar, você está de acordo com nossos{" "}
            <span className="underline">Termos de serviço</span> e{" "}
            <span className="underline">Política de Privacidade</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
