import { Outlet } from "react-router";
import type { Route } from "./+types/_public";
import Footer from "~/components/globalLayout/Footer";
import Header from "~/components/globalLayout/Header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chatflow" },
    {
      name: "description",
      content: "Construa chatbots sem precisar escrever código.",
    },
  ];
}

export default function PublicLayout() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 flex flex-col">
        {/* <Header /> */}
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
