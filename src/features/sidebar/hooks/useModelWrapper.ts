import { useEffect, useRef } from "react";
import ModelWrapper from "../../../utils/ai/ModelWrapper";
import { retrieveTranscript } from "../../../utils/scrape/retrieveTranscript";
// import { extractYouTubeDescription } from "../../../utils/scrape/extractDescription";
import { waitForDescription } from "../../../utils/scrape/extractDescription";

import { ApiKeys } from "@/interfaces";

export function useModelWrapper(
  apiKeys: ApiKeys,
  currentVideoId: string | null
) {
  const modelWrapper = useRef<ModelWrapper | null>(null);

  useEffect(() => {
    const initializeModelWrapper = async () => {
      try {
        // const description = extractYouTubeDescription();
        // console.log("Description:", description);
        // const { transcript } = await retrieveTranscript();
        // console.log("Transcript:", transcript.slice(0, 50));

        const [description, { transcript }] = await Promise.all([
          waitForDescription(10, 500),
          retrieveTranscript(),
        ]);

        console.log("Description length:", description?.length);
        console.log("Description:", description);
        console.log("Transcript:", transcript);

        const context = `Video Description: ${
          description || "No description available."
        }\n\nVideo Transcript: ${transcript}`;

        modelWrapper.current = new ModelWrapper(
          apiKeys.openAIKey,
          apiKeys.anthropicKey,
          context
        );
        console.log("ModelWrapper initialized");
      } catch (error) {
        console.error("Error initializing model wrapper:", error);
      }
    };

    if ((apiKeys.openAIKey || apiKeys.anthropicKey) && currentVideoId) {
      initializeModelWrapper();
    }
  }, [apiKeys, currentVideoId]);

  return modelWrapper;
}
