import * as React from "react";

import { cn } from "~/lib/utils";
import { useMediaQuery } from "~/hooks/useMediaQuery";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent } from "../ui/card";
import { Plus } from "lucide-react";
import { useFetcher } from "react-router";

export function CreateFlow() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Trigger />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Flow</DialogTitle>
            <DialogDescription>Crie um novo fluxo e salve</DialogDescription>
          </DialogHeader>
          <CreateFlowForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Trigger />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Criar Fluxo</DrawerTitle>
          <DrawerDescription>Crie um novo fluxo e salve</DrawerDescription>
        </DrawerHeader>
        <CreateFlowForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function CreateFlowForm({ className }: React.ComponentProps<"form">) {
  const fetcher = useFetcher();
  const error = fetcher.data?.error;

  return (
    <fetcher.Form
      className={cn("grid items-start gap-4", className)}
      action="/flows"
      method="post"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Nome do fluxo</Label>
        <Input type="text" id="name" name="name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="domain">Domínio</Label>
        <Input type="text" id="domain" name="domain" required />
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
      <Button type="submit">Criar novo fluxo</Button>
    </fetcher.Form>
  );
}

function Trigger() {
  return (
    <Card className="w-72 h-36 bg-neutral-900 text-neutral-100">
      <CardContent className="flex items-center justify-center w-full h-full p-0">
        <Plus className="mr-1" />
        Criar novo
      </CardContent>
    </Card>
  );
}
