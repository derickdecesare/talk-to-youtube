import { useState, useRef, useCallback, useEffect } from "react";
import ModelWrapper from "../../../utils/ai/ModelWrapper";
import { Message } from "@/interfaces";
import { getYouTubeTimestamp } from "@/utils/video/getYoutubeTimestamp";

export function useChat(
  modelWrapperRef: React.RefObject<ModelWrapper | null>,
  currentVideoId: string | null
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Clear messages when video ID changes
  useEffect(() => {
    setMessages([]);
  }, [currentVideoId]);

  const sendMessage = useCallback(async () => {
    if (inputMessage.trim() && modelWrapperRef.current) {
      const timestamp = getYouTubeTimestamp();

      // Message visible to the user
      const userMessage: Message = { role: "user", content: inputMessage };
      setMessages((prev) => [...prev, userMessage]);

      setInputMessage("");
      setIsStreaming(true);

      const assistantMessage: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        // Use regular messages for context, but add timestamp to the last message
        const llmContext = [
          ...messages.map((msg) => msg.content),
          `[At video timestamp ${timestamp}] ${inputMessage}`,
        ];

        console.log("llmContext", llmContext);

        const stream = modelWrapperRef.current.chat(
          llmContext,
          "openai" // or "anthropic", depending on your preference
        );

        for await (const chunk of stream) {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: lastMessage.content + chunk },
              ];
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Error in AI response:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      } finally {
        setIsStreaming(false);
      }
    }
  }, [inputMessage, messages, modelWrapperRef]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isStreaming,
    sendMessage,
  };
}
