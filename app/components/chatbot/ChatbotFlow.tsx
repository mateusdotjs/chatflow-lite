import { useEffect, useRef, useState } from "react";
import type { JsonData, PreviousMessageProps } from "~/types/chatbot";
import { NodeType } from "~/types/nodeTypes";
import { PreviousMessage } from "./PreviousMessage";
import { CurrentMessage } from "./CurrentMessage";
import RestartChat from "./RestartChat";
import ChatInput from "./ChatInput";

export default function ChatbotFlow({ data }: { data: JsonData[] }) {
  const [value, setValue] = useState<string>("");
  const [previousMessages, setPreviousMessages] = useState<
    PreviousMessageProps[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState<JsonData | null>(
    data[0]
  );
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentMessage?.type === NodeType.MESSAGE) {
      if (isFirstRender === true) {
        setIsFirstRender(false);
        return;
      }
      setTimeout(() => {
        handleMessageFlow();
      }, 1000);
    }
  }, [currentMessage, isFirstRender]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [previousMessages, currentMessage]);

  // async function handleData() {
  //   if (value !== "") return;
  //   try {
  //     await fetch(process.env.HTTPS_DOMAIN + "/leads", {
  //       method: "post",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(value),
  //     });
  //   } catch (error) {
  //   } finally {
  //   }

  //   handleMessageFlow();
  // }

  function addUserMessageToPrevious(optionId?: string) {
    if (currentMessage?.type === NodeType.OPTIONS) {
      let currentOption = currentMessage.options!.find(
        (option) => option.id === optionId
      );
      if (currentOption) {
        setPreviousMessages((state) => [
          ...state,
          {
            id: currentOption.id,
            message: currentOption.text,
            sender: "client",
            options: currentMessage.options,
            type: NodeType.OPTIONS,
          },
        ]);
      }
    } else if (currentMessage?.type === NodeType.INPUT) {
      setPreviousMessages((state) => [
        ...state,
        {
          id: currentMessage.id,
          message: value,
          sender: "client",
          type: NodeType.MESSAGE,
        },
      ]);
    }
  }

  function addCurrentMessageToPrevious() {
    if (!currentMessage) return;
    setPreviousMessages((state) => [
      ...state,
      { ...currentMessage, sender: "bot" },
    ]);
  }

  function handleMessageFlow(optionId?: string) {
    let nextMessage: JsonData | undefined;
    setLoading(true);

    addCurrentMessageToPrevious();

    if (currentMessage?.type === NodeType.OPTIONS) {
      addUserMessageToPrevious(optionId);
      let currentOption = currentMessage.options?.find(
        (option) => option.id === optionId
      );

      if (currentOption && currentOption.next) {
        nextMessage = data.find((message) => message.id === currentOption.next);
      }
    } else if (currentMessage?.type === NodeType.INPUT) {
      addUserMessageToPrevious();
      if (currentMessage.next) {
        nextMessage = data.find(
          (message) => message.id === currentMessage.next
        );
      }
    } else {
      if (currentMessage && currentMessage.next)
        nextMessage = data.find(
          (message) => message.id === currentMessage.next
        );
    }

    if (!nextMessage) {
      setCurrentMessage(null);
      return;
    }

    setLoading(false);
    setCurrentMessage(nextMessage);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-4 bg-gray-50 px-4 py-4">
        {previousMessages &&
          previousMessages.map((previousMessage, i) => {
            return (
              <PreviousMessage
                key={previousMessage.id + i}
                id={previousMessage.id}
                message={previousMessage.message}
                options={previousMessage.options}
                sender={previousMessage.sender}
                type={previousMessage.type}
              />
            );
          })}
        {/* Renderiza indicador de loading se estiver carregando */}
        {loading && currentMessage && (
          <div className="text-center">Carregando...</div>
        )}
        {currentMessage && !loading && (
          <CurrentMessage
            currentMessage={currentMessage}
            handleMessageFlow={handleMessageFlow}
          />
        )}
        {currentMessage === null && (
          <RestartChat data={data} setCurrentMessage={setCurrentMessage} />
        )}
      </div>
      {/* {currentMessage && (
        <ChatInput
          value={value}
          setValue={setValue}
          handleData={handleData}
          disabled={currentMessage.type !== NodeType.INPUT}
        />
      )} */}
      <div ref={messagesEndRef} />
    </div>
  );
}
