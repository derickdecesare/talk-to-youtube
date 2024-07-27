import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

class ModelWrapper {
  private openAIModel: ChatOpenAI | null = null;
  private anthropicModel: ChatAnthropic | null = null;

  constructor(private openAIKey: string, private anthropicKey: string) {
    this.initModels();
  }

  private initModels() {
    if (this.openAIKey) {
      this.openAIModel = new ChatOpenAI({
        temperature: 0.9,
        model: "gpt-4o-mini",
        apiKey: this.openAIKey,
        streaming: true,
      });
    }
    if (this.anthropicKey) {
      this.anthropicModel = new ChatAnthropic({
        temperature: 0.9,
        model: "claude-3-5-sonnet-20240620",
        apiKey: this.anthropicKey,
        streamUsage: true,
        streaming: true,
      });
    }
  }

  async *chat(
    messages: string[],
    modelPreference: "openai" | "anthropic" = "openai"
  ): AsyncGenerator<string, void, unknown> {
    let model: ChatOpenAI | ChatAnthropic | null;

    if (modelPreference === "openai") {
      model = this.openAIModel;
    } else if (modelPreference === "anthropic") {
      model = this.anthropicModel;
    } else {
      model = null;
    }

    if (!model) {
      throw new Error("Preferred model not available");
    }

    const langchainMessages = messages.map((msg, index) =>
      index % 2 === 0 ? new HumanMessage(msg) : new AIMessage(msg)
    );

    // disable type checking for model.stream
    //@ts-ignore
    const stream = await model.stream(langchainMessages);

    for await (const chunk of stream) {
      if (typeof chunk.content === "string") {
        yield chunk.content;
      } else if (Array.isArray(chunk.content)) {
        // Map and join only items that have a 'text' property
        const textContent = chunk.content
          .filter((item): item is { text: string } => "text" in item)
          .map((item) => item.text)
          .join("");
        yield textContent;
      }
    }
  }
}

export default ModelWrapper;
