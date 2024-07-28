// src/utils/scrape/extractDescription.ts

// define types for the extracted description
type Description = string | null;

export async function extractYouTubeDescription(): Promise<Description> {
  // Function to decode Unicode escape sequences
  const decodeUnicode = (str) => {
    return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
    });
  };

  // Get the full HTML of the page
  const html = document.documentElement.outerHTML;

  // Regex pattern to find the description
  const pattern = /(?<=shortDescription":").*?(?=","isCrawlable)/;

  const match = html.match(pattern);

  if (match) {
    // Decode the matched string
    let description = decodeUnicode(match[0]);

    // Replace \\n with actual newlines
    description = description.replace(/\\n/g, "\n");

    // Unescape other characters
    description = description.replace(/\\"/g, '"').replace(/\\\\/g, "\\");

    return description;
  }

  return null;
}

// define type for what this will return

// Function to wait for the description to load
export function waitForDescription(
  maxAttempts = 15,
  interval = 1000
): Promise<Description> {
  return new Promise((resolve) => {
    let attempts = 0;

    const checkDescription = async () => {
      const description = await extractYouTubeDescription();
      if (description || attempts >= maxAttempts) {
        resolve(description);
      } else {
        attempts++;
        setTimeout(checkDescription, interval);
      }
    };

    checkDescription();
  });
}
