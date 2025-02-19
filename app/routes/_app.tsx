import { Outlet } from "react-router";
import Footer from "~/components/globalLayout/Footer";
import Header from "~/components/globalLayout/Header";

export default function AppLayout() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 flex flex-col">
        <Header />
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
