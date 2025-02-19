import { redirect } from "react-router";

export function loader() {
  throw redirect("/login")
}


export default function PublicIndex() {
  return <div className="flex-1">Index</div>;
}
