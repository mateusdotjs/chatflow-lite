import type { ReactNode } from "react";
import { NodeType } from "../../types/nodeTypes";
import type { JsonData } from "../../types/chatbot";

type CurrentMessageProps = {
  currentMessage: JsonData;
  handleMessageFlow: (optionId?: string) => void;
};

export function CurrentMessage({
  currentMessage,
  handleMessageFlow,
}: CurrentMessageProps) {
  switch (currentMessage.type) {
    case NodeType.MESSAGE:
      return (
        <MessageShell>
          <TextMessage text={currentMessage.message} />
        </MessageShell>
      );
    case NodeType.OPTIONS:
      return (
        <MessageShell>
          <OptionsMessage
            text={currentMessage.message}
            options={currentMessage.options}
            handleMessageFlow={handleMessageFlow}
          />
        </MessageShell>
      );
    default:
      return (
        <MessageShell>
          <TextMessage text={currentMessage.message} />
        </MessageShell>
      );
  }
}

function MessageShell({ children }: { children: ReactNode }) {
  return (
    <div className={`flex w-full flex-col items-start gap-2`}>{children}</div>
  );
}

function TextMessage({ text }: { text: string }) {
  return (
    <div className="rounded-md border-2 border-green-500 bg-gray-200 p-2 text-gray-900">
      {text}
    </div>
  );
}

type OptionsMessageProps = {
  text: string;
  options: JsonData["options"];
  handleMessageFlow: CurrentMessageProps["handleMessageFlow"];
};

function OptionsMessage({
  text,
  options,
  handleMessageFlow,
}: OptionsMessageProps) {
  return (
    <>
      <div className="900 rounded-md bg-gray-200 p-2 text-gray-900">{text}</div>
      <div className="flex flex-wrap gap-2">
        {options &&
          options.map((option) => {
            return (
              <button
                key={option.id}
                className="rounded-md border-2 border-green-500 bg-green-500 p-2 text-sm font-semibold text-white hover:border-green-600"
                onClick={() => {
                  handleMessageFlow(option.id);
                }}
              >
                {option.text}
              </button>
            );
          })}
      </div>
    </>
  );
}
