import type { Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type ChatInputProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  handleData: () => void;
  disabled: boolean;
};

export default function ChatInput({
  setValue,
  handleData,
  disabled,
}: ChatInputProps) {
  return (
    <div className="flex gap-2 border p-4">
      <Input
        type="text"
        placeholder="Digite aqui quando necessário"
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        required
      />
      <Button
        className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
        disabled={disabled}
        type="submit"
      >
        Enviar
      </Button>
    </div>
  );
}
