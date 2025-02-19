import { NavLink, Outlet, redirect } from "react-router";
import { getSession } from "~/auth/session.server";
import type { Route } from "./+types/_app.flows";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userEmail")) {
    throw redirect("/login");
  }
}

export default function FlowsPage() {
  return (
    <div className="h-full flex">
      <aside className="min-w-64 h-full border-r p-4 space-y-1 bg-neutral-100">
        <NavLink
          to={"/flows"}
          className={({ isActive }) => {
            return `p-2 w-full inline-block rounded-md ${
              isActive ? "bg-neutral-300 text-black" : "hover:bg-neutral-300"
            }`;
          }}
        >
          Flows
        </NavLink>
      </aside>
      <Outlet />
    </div>
  );
}
