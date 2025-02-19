import type { ReactNode } from "react";
import { NodeType } from "../../types/nodeTypes";
import type { PreviousMessageProps } from "../../types/chatbot";

export function PreviousMessage({
  message,
  options,
  sender,
  type,
}: PreviousMessageProps) {
  switch (type) {
    case NodeType.MESSAGE:
      return (
        <MessageShell sender={sender}>
          <TextMessage text={message} sender={sender} />
        </MessageShell>
      );
    case NodeType.OPTIONS:
      return (
        <MessageShell sender={sender}>
          {sender === "bot" ? (
            <OptionsMessage text={message} options={options} />
          ) : (
            <TextMessage text={message} sender={sender} />
          )}
        </MessageShell>
      );
    default:
      return (
        <MessageShell sender={sender}>
          <TextMessage text={message} sender={sender} />
        </MessageShell>
      );
  }
}

function MessageShell({
  children,
  sender,
}: {
  children: ReactNode;
  sender: PreviousMessageProps["sender"];
}) {
  return (
    <div
      className={`flex w-full flex-col gap-2 ${
        sender === "bot" ? "items-start" : "items-end"
      }`}
    >
      {children}
    </div>
  );
}

function TextMessage({
  text,
  sender,
}: {
  text: string;
  sender: PreviousMessageProps["sender"];
}) {
  return (
    <div
      className={`rounded-md p-2 ${
        sender === "bot"
          ? "bg-gray-200"
          : "bg-green-500 font-semibold text-white"
      }`}
    >
      {text}
    </div>
  );
}

function OptionsMessage({
  text,
  options,
}: {
  text: string;
  options: PreviousMessageProps["options"];
}) {
  return (
    <>
      <div className="rounded-xl bg-gray-200 p-2 text-gray-900">{text}</div>
      <div className="flex flex-wrap gap-2">
        {options &&
          options.map((option) => {
            return (
              <button
                key={option.id}
                className="rounded-md border-2 border-green-500 bg-green-500 p-2 text-sm font-semibold text-white"
                disabled
              >
                {option.text}
              </button>
            );
          })}
      </div>
    </>
  );
}
