import { useAppStore } from "../../store";
import { NodeType } from "../../types/nodeTypes";
import { List, MessageSquare } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { Button } from "../ui/button";
import { Link, useFetcher, useParams } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import validateFlow from "~/lib/helper/validateFlow";

const sidebarItems = [
  {
    category: "Básico",
    items: [
      {
        text: "Mensagem",
        description: "Exibe uma mensagem",
        icon: <MessageSquare size={20} />,
        iconBackground: "bg-green-500",
        type: NodeType.MESSAGE,
      },
      {
        text: "Opções",
        description: "Exibe uma mensagem e opções de escolha",
        icon: <List size={20} />,
        iconBackground: "bg-blue-500",
        type: NodeType.OPTIONS,
      },
    ],
  },
];

export default function Sidebar() {
  const { nodes, edges } = useAppStore();
  const fetcher = useFetcher();
  let { id } = useParams();

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

  function handleSubmit() {
    const validate = validateFlow(nodes, edges);
    if (!validate.valid) {
      toast.error(validate.error);
      return;
    }

    const formData = new FormData();
    formData.append("nodes", JSON.stringify(nodes));
    formData.append("edges", JSON.stringify(edges));
    fetcher.submit(formData, { method: "PATCH" });
  }

  return (
    <aside className="flex flex-1 min-w-64 flex-col px-4 py-6 bg-neutral-50 border-r">
      <Button className="mb-6" variant={"outline"} asChild>
        <Link to={"/flows"}>Voltar para fluxos</Link>
      </Button>
      <div className="mb-5 flex-1 space-y-8">
        {sidebarItems.map((category) => {
          return (
            <div key={category.category} className="flex flex-wrap">
              <p className="mb-3 w-full text-lg font-semibold text-neutral-400">
                {category.category}
              </p>
              <div className="space-y-2 w-full">
                {category.items.map((item) => {
                  return (
                    <SidebarItem
                      key={item.text}
                      text={item.text}
                      description={item.description}
                      icon={item.icon}
                      iconBackground={item.iconBackground}
                      type={item.type}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <fetcher.Form action={`/editor/${id}`} onSubmit={handleSubmit}>
        <Button type="submit" className="w-full">
          Salvar
        </Button>
      </fetcher.Form>
    </aside>
  );
}
