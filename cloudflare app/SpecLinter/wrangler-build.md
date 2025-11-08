# Deploying this project with Wrangler

This repository is a Cloudflare Worker project and must be deployed using the Wrangler CLI. It cannot be published by drag-and-dropping files into the Cloudflare dashboard or Pages UI.

Why

- The project contains source files and a Worker entry point that Wrangler needs to locate and upload. Wrangler uses a configuration file (`wrangler.toml` or `wrangler.jsonc`) that specifies a `main` entry (the Worker file) or an `assets` directory. Drag-and-drop in the Cloudflare UI is for static assets only and does not accept a Worker entry point.

What to check

- Ensure `wrangler.toml` exists in the project root and contains a `main` pointing to the Worker entry file. In this repository:

  - `wrangler.toml` contains:

    ```toml
    name = "kupcloudflareai"
    main = "src/worker.js"
    compatibility_date = "2025-11-08"
    ```

  - `src/worker.js` is present and exports the Worker fetch handler.

Deployment steps (local)

1. Open a terminal and change to the project root (where `wrangler.toml` is located):

```bash
cd "/Users/cyrilkups/Desktop/cloudflare app/SpecLinter"
```

2. (Optional) Verify you are authenticated with Cloudflare:

```bash
npx wrangler whoami
```

3. Run a dry run to confirm uploadable files and bindings:

```bash
npx wrangler deploy --dry-run
```

4. Deploy the Worker:

```bash
npx wrangler deploy
```

Notes

- If you prefer to run Wrangler from a different directory (for example, from a parent folder or CI job), use the `--config` flag to point to the `wrangler.toml` file:

```bash
npx wrangler deploy --config "./SpecLinter/wrangler.toml"
```

- Do not modify application logic in this repository. This document only clarifies the deployment workflow.

Contact / Troubleshooting

- If you see the error "Missing entry-point to Worker script or to assets directory", confirm you ran the `npx wrangler deploy` command from the directory containing `wrangler.toml` (or use `--config`), and that the `main` value in that file points to an existing Worker entry file (e.g., `src/worker.js`).
