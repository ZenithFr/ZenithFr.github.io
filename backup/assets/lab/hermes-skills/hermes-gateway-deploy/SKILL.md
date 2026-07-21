---
name: hermes-gateway-deploy
description: "Deploy Hermes Agent gateway behind a reverse proxy (Nginx Proxy Manager, Caddy, etc.) with the OpenAI-compatible API server."
version: 1.0.1
author: Ares
license: MIT
platforms: [linux]
metadata:
  hermes:
    tags: [hermes, gateway, api-server, nginx, proxy, deployment, openai-compatible]
---

# Hermes Gateway Deployment

Configures Hermes Agent as a persistent gateway behind a reverse proxy, exposing an OpenAI-compatible API for external web UIs.

## Trigger Conditions

Use when the user wants to:
- Expose Hermes API behind nginx/Caddy/Traefik
- Connect Open WebUI or another OpenAI-compatible frontend to Hermes
- Set up Hermes with a public domain

## Critical Config: Api Server Platform

The API server is a **platform adapter** configured under `platforms.api_server` in `~/.hermes/config.yaml`.

### Correct Config

```yaml
platforms:
  api_server:
    enabled: true
    host: 0.0.0.0
    port: 8642
    key: your-secret-api-key
```

Set via CLI (preferred to avoid YAML errors):
```bash
hermes config set platforms.api_server.enabled true
hermes config set platforms.api_server.host 0.0.0.0
hermes config set platforms.api_server.port 8642
hermes config set platforms.api_server.key your-secret-key
```

⚠️ **Common mistakes:**
- **Wrong path**: `gateway.api_server` instead of `platforms.api_server` — silently ignored
- **Wrong key field**: `api_key` instead of `key` — the code reads `extra.get("key")`
- **Duplicate blocks**: Both `gateway.api_server` and `platforms.api_server` — unpredictable which wins
- **No key**: Gateway refuses to start API server without a key (even on loopback)

Verify with:
```bash
grep -n "api_server" ~/.hermes/config.yaml  # should show ONE block under platforms:
```

### Environment Variable Alternative

In `~/.hermes/.env`:
```bash
API_SERVER_ENABLED=true
API_SERVER_HOST=0.0.0.0
API_SERVER_PORT=8642
API_SERVER_KEY=your-secret-key
```

## Nginx Proxy Manager Setup

1. **Proxy Host**: domain → `http://<server-ip>:8642`
2. **SSL**: Let's Encrypt or Cloudflare origin cert
3. **Custom Nginx Config** (Advanced tab):
   ```nginx
   proxy_buffering off;
   proxy_cache off;
   chunked_transfer_encoding on;
   proxy_read_timeout 600s;
   proxy_send_timeout 600s;
   ```

## Cloudflare Setup (if applicable)

- A record → server IP
- SSL/TLS: Full (Strict) with origin cert, or Flexible
- Proxied (orange cloud) recommended

## Web UI Connection

In your OpenAI-compatible web UI:
- **Base URL**: `https://your-domain.com/v1`
- **API Key**: same key set in config
- **Model**: whatever Hermes default is (e.g., `openrouter/owl-alpha`)

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Port 8642 not listening | Config path wrong or key missing | Check `grep -n api_server config.yaml`, fix via `hermes config set` |
| "API_SERVER_KEY required" | Key not set or set under wrong field name | Use `hermes config set platforms.api_server.key <key>` |
| 502 from nginx | API server not running | Fix config, `hermes gateway restart` |
| Can't write config.yaml | File is protected credential store | Must use `hermes config set` CLI, not direct file writes |
| Duplicate api_server blocks | Old config not cleaned up | Remove wrong block manually |

## TTS Compatibility Notes

- `text_to_speech` returns `voice_compatible: false` for Edge TTS — Telegram expects OGG/Opus, not MP3
- Audio still delivers as file attachment, not voice bubble
- Edge TTS requires `ffmpeg` for MP3 encoding: `sudo apt install ffmpeg`
- For voice bubbles, try setting `hermes config set tts.format ogg` or use ElevenLabs/OpenAI TTS

## Important: Protected Files

`~/.hermes/config.yaml` and `~/.hermes/.env` **cannot be read or written via tools** (file tools, patch, write_file are all blocked). Always use:
- `hermes config set <path> <value>` for config changes
- `hermes config edit` for manual edits
- `hermes gateway restart` to apply

## Hermes Insights / Status

Check token usage and session stats:
```bash
hermes insights          # usage breakdown by model, platform, time
hermes status            # API key status, gateway state, sessions
```

Model usage from insights is per-session, not per-API-key. For per-provider quota checking, visit the provider dashboards directly (OpenRouter, Google Cloud Console, etc.) — Hermes cannot authenticate to those external dashboards.
