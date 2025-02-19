import { Link, redirect, useFetcher } from "react-router";
import { z } from "zod";
import { prisma } from "~/db/prisma.server";
import type { Route } from "./+types/_public.register";
import * as argon2 from "argon2";
import { getSession } from "~/auth/session.server";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";

const registerSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório" }),
  family_name: z.string().min(1, { message: "O sobrenome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userEmail")) {
    throw redirect("/flows");
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const family_name = formData.get("family_name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Validar os dados
  const result = registerSchema.safeParse({
    name,
    family_name,
    email,
    password,
  });

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

  // Verificar se o usuário já existe
  const existingUser = await prisma.auth.findUnique({ where: { email } });
  if (existingUser) {
    return {
      ok: false,
      error: {
        type: "business",
        message: "Usuário já cadastrado",
      },
    };
  }

  // Criptografar a senha e criar o usuário (auth) e perfil (profile)
  const hashedPassword = await argon2.hash(password!);
  const auth = await prisma.auth.create({
    data: { email: email!, pass: hashedPassword },
  });

  const profile = await prisma.profile.create({
    data: {
      name: name!,
      family_name: family_name!,
      email: email!,
      authId: auth.id,
    },
  });

  return redirect("/login");
}

export default function RegisterPage() {
  const fetcher = useFetcher();
  let error = fetcher.data?.error;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          Chatflow
        </a>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Registre-se</CardTitle>
              <CardDescription>Crie sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <fetcher.Form method="post">
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          type="text"
                          name="name"
                          placeholder="Seu nome"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="family_name">Sobrenome</Label>
                        <Input
                          id="family_name"
                          type="text"
                          name="family_name"
                          placeholder="Seu sobrenome"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="m@exemplo.com"
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
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                      Faça login
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
