import { useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function FormSwitch({ active }: { active: boolean }) {
  const [isActive, setIsActive] = useState(active);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="active"
        name="active"
        checked={isActive}
        onClick={() => setIsActive(!isActive)}
      />
      <Label htmlFor="active">{isActive ? "Fluxo ativo" : "Fluxo desativado"}</Label>
    </div>
  );
}
