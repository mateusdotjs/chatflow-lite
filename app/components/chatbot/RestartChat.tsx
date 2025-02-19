import { RotateCcwIcon } from "lucide-react";
import type { JsonData } from "../../types/chatbot";
import type { Dispatch, SetStateAction } from "react";

type RestartChatProps = {
  data: JsonData[];
  setCurrentMessage: Dispatch<SetStateAction<JsonData | null>>;
};

export default function RestartChat({
  data,
  setCurrentMessage,
}: RestartChatProps) {
  return (
    <div className="flex w-full items-center justify-center p-8">
      <div className="rounded-xl">
        <p className="mb-4 text-center">Atendimento Finalizado</p>
        <button
          className="flex gap-2 rounded-lg border-2 border-green-500 bg-green-500 p-2 font-semibold text-white hover:border-green-600"
          onClick={() => setCurrentMessage(data[0])}
        >
          <RotateCcwIcon /> Reiniciar conversa
        </button>
      </div>
    </div>
  );
}
