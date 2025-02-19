import { Link } from "react-router";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="p-4 border-b flex items-center justify-between">
      <div>
        <span className="font-semibold text-lg">ChatFlow</span>
      </div>
      {/* <div className="md:hidden">
        <Drawer>
          <DrawerTrigger>
            <Button>Open</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerFooter>
              <nav className="">
                <ul className="flex flex-col px-2">
                  <li className="py-2">
                    <Link to={"/flows"}>Ir para fluxos</Link>
                  </li>
                  <li className="py-2">
                    <Link to={"/logout"}>Logout</Link>
                  </li>
                </ul>
              </nav>
              <DrawerClose className="px-2">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div> */}
      <nav className="">
        <ul className="flex gap-4 items-center">
          <li>
            <Button asChild>
              <Link to={"/flows"}>Ir para fluxos</Link>
            </Button>
          </li>
          <li>
            <form action="/logout" method="post">
              <Button variant={"outline"}>
                Logout
              </Button>
            </form>
          </li>
        </ul>
      </nav>
    </header>
  );
}
