interface VideoMetadata {
  title: string;
  duration: string;
  author: string;
  views: string;
}

interface TranscriptResult {
  transcript: string;
  metadata: VideoMetadata;
}
// export function retrieveTranscript(): Promise<TranscriptResult> {
//   return new Promise((resolve, reject) => {
//     console.log("Starting transcript retrieval...");

//     const videoId = new URLSearchParams(window.location.search).get("v");
//     console.log("Video ID:", videoId);

//     if (!videoId) {
//       console.error("No video ID found in URL");
//       reject(
//         "Unable to find video ID. Make sure you're on a YouTube video page."
//       );
//       return;
//     }

//     const YT_INITIAL_PLAYER_RESPONSE_RE =
//       /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/;

//     // Function to extract player data
//     const extractPlayerData = () => {
//       let player = (window as any).ytInitialPlayerResponse;

//       if (!player) {
//         console.log(
//           "ytInitialPlayerResponse not found, searching in page source..."
//         );
//         const pageSource = document.body.innerHTML;
//         const match = pageSource.match(YT_INITIAL_PLAYER_RESPONSE_RE);
//         if (match && match[1]) {
//           try {
//             player = JSON.parse(match[1]);
//           } catch (e) {
//             console.error(
//               "Error parsing ytInitialPlayerResponse from page source:",
//               e
//             );
//           }
//         }
//       }

//       return player;
//     };

//     // Try to get player data, with retries
//     let retries = 0;
//     const maxRetries = 5;
//     const retryInterval = 1000; // 1 second

//     const attemptExtraction = () => {
//       const player = extractPlayerData();
//       console.log("Extracted player data:", player);

//       if (
//         player &&
//         player.captions &&
//         player.captions.playerCaptionsTracklistRenderer
//       ) {
//         // Continue with the rest of your function here...
//         const metadata: VideoMetadata = {
//           title: player.videoDetails.title,
//           duration: player.videoDetails.lengthSeconds,
//           author: player.videoDetails.author,
//           views: player.videoDetails.viewCount,
//         };
//         console.log("Video metadata:", metadata);

//         const tracks =
//           player.captions.playerCaptionsTracklistRenderer.captionTracks;
//         console.log("Caption tracks:", tracks);

//         if (!tracks || tracks.length === 0) {
//           console.error("No caption tracks found");
//           reject("No caption tracks found for this video.");
//           return;
//         }

//         console.log("Sorting caption tracks...");
//         tracks.sort((a: any, b: any) =>
//           a.languageCode === "en" ? -1 : b.languageCode === "en" ? 1 : 0
//         );
//         console.log("Sorted tracks:", tracks);

//         console.log(
//           "Fetching transcript from URL:",
//           tracks[0].baseUrl + "&fmt=json3"
//         );
//         fetch(tracks[0].baseUrl + "&fmt=json3")
//           .then((response) => response.json())
//           .then((transcript) => {
//             console.log("Raw transcript data:", transcript);
//             const parsedTranscript = transcript.events
//               .filter((x: any) => x.segs)
//               .map((x: any) => x.segs.map((y: any) => y.utf8).join(" "))
//               .join(" ")
//               .replace(/[\u200B-\u200D\uFEFF]/g, "")
//               .replace(/\s+/g, " ");

//             console.log(
//               "Parsed transcript (first 100 chars):",
//               parsedTranscript.slice(0, 100)
//             );
//             resolve({ transcript: parsedTranscript, metadata });
//           })
//           .catch((error) => {
//             console.error("Error fetching transcript:", error);
//             reject("Error fetching transcript: " + error);
//           });
//       } else if (retries < maxRetries) {
//         console.log(
//           `Player data not found. Retrying in ${retryInterval}ms... (Attempt ${
//             retries + 1
//           }/${maxRetries})`
//         );
//         retries++;
//         setTimeout(attemptExtraction, retryInterval);
//       } else {
//         console.error("Max retries reached. Unable to find player data.");
//         reject(
//           "Unable to find player data after multiple attempts. The video might not have captions, or there might be an issue with the page."
//         );
//       }
//     };

//     attemptExtraction();
//   });
// }

export function retrieveTranscript(): Promise<TranscriptResult> {
  return new Promise((resolve, reject) => {
    console.log("Starting transcript retrieval...");

    const videoId = new URLSearchParams(window.location.search).get("v");
    console.log("Video ID:", videoId);

    if (!videoId) {
      console.error("No video ID found in URL");
      reject(
        "Unable to find video ID. Make sure you're on a YouTube video page."
      );
      return;
    }

    // Fetch the current page HTML
    fetch(window.location.href)
      .then((response) => response.text())
      .then((html) => {
        // Create a new document from the fetched HTML
        const parser = new DOMParser();
        const freshDocument = parser.parseFromString(html, "text/html");

        const YT_INITIAL_PLAYER_RESPONSE_RE =
          /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+(?:meta|head)|<\/script|\n)/;

        // Function to extract player data
        const extractPlayerData = () => {
          let player;
          const scriptTags = freshDocument.getElementsByTagName("script");
          for (let i = 0; i < scriptTags.length; i++) {
            const scriptContent = scriptTags[i].textContent;
            if (scriptContent) {
              const match = scriptContent.match(YT_INITIAL_PLAYER_RESPONSE_RE);
              if (match && match[1]) {
                try {
                  player = JSON.parse(match[1]);
                  break;
                } catch (e) {
                  console.error("Error parsing ytInitialPlayerResponse:", e);
                }
              }
            }
          }
          return player;
        };

        // Try to get player data, with retries
        let retries = 0;
        const maxRetries = 5;
        const retryInterval = 1000; // 1 second

        const attemptExtraction = () => {
          const player = extractPlayerData();
          console.log("Extracted player data:", player);

          if (
            player &&
            player.captions &&
            player.captions.playerCaptionsTracklistRenderer
          ) {
            const metadata: VideoMetadata = {
              title: player.videoDetails.title,
              duration: player.videoDetails.lengthSeconds,
              author: player.videoDetails.author,
              views: player.videoDetails.viewCount,
            };
            console.log("Video metadata:", metadata);

            const tracks =
              player.captions.playerCaptionsTracklistRenderer.captionTracks;
            console.log("Caption tracks:", tracks);

            if (!tracks || tracks.length === 0) {
              console.error("No caption tracks found");
              reject("No caption tracks found for this video.");
              return;
            }

            console.log("Sorting caption tracks...");
            tracks.sort((a: any, b: any) =>
              a.languageCode === "en" ? -1 : b.languageCode === "en" ? 1 : 0
            );
            console.log("Sorted tracks:", tracks);

            console.log(
              "Fetching transcript from URL:",
              tracks[0].baseUrl + "&fmt=json3"
            );
            fetch(tracks[0].baseUrl + "&fmt=json3")
              .then((response) => response.json())
              .then((transcript) => {
                console.log("Raw transcript data:", transcript);
                const parsedTranscript = transcript.events
                  .filter((x: any) => x.segs)
                  .map((x: any) => x.segs.map((y: any) => y.utf8).join(" "))
                  .join(" ")
                  .replace(/[\u200B-\u200D\uFEFF]/g, "")
                  .replace(/\s+/g, " ");

                console.log(
                  "Parsed transcript (first 100 chars):",
                  parsedTranscript.slice(0, 100)
                );
                resolve({ transcript: parsedTranscript, metadata });
              })
              .catch((error) => {
                console.error("Error fetching transcript:", error);
                reject("Error fetching transcript: " + error);
              });
          } else if (retries < maxRetries) {
            console.log(
              `Player data not found. Retrying in ${retryInterval}ms... (Attempt ${
                retries + 1
              }/${maxRetries})`
            );
            retries++;
            setTimeout(attemptExtraction, retryInterval);
          } else {
            console.error("Max retries reached. Unable to find player data.");
            reject(
              "Unable to find player data after multiple attempts. The video might not have captions, or there might be an issue with the page."
            );
          }
        };

        attemptExtraction();
      })
      .catch((error) => {
        console.error("Error fetching current page:", error);
        reject("Error fetching current page: " + error);
      });
  });
}
