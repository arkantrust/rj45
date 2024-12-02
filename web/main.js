import { $ } from "bun";

const path = "./app/api/apis.js";

// Read environment variables
const api = Bun.env.API_URL || "http://localhost:8080";
const analytics = Bun.env.ANALYTICS_URL || "http://localhost:8000";

// Create a js file with the URLs
const apis = `export const API_URL = "${api}";
export const ANALYTICS_URL = "${analytics}";`;

// Write the object to a file
await Bun.write(path, apis);

// Check if the file was written
const exists = await Bun.file(path).exists;
if (!exists) {
    throw new Error(`Failed to write the content to ${path}`);
}

// Log the result
console.log(`Wrote the following content to ${path}:
  - API_URL: ${api}
  - ANALYTICS_URL: ${analytics}
`);

// Start development server
const prod = Bun.env.PROD;
if (!prod) {
    await $`bunx serve app`;
}