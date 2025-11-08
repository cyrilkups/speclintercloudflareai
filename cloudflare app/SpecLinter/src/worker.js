// Worker entry script for Cloudflare
// Wrangler (the Cloudflare Workers CLI) requires a `main` entry point
// which points to the file that exports the Worker (fetch handler).
// This file is intentionally minimal and does NOT change application
// logic in the repo — it's only an entry wrapper so Wrangler can deploy.
export default {
  async fetch(request, env) {
    return new Response("Hello world");
  },
};
