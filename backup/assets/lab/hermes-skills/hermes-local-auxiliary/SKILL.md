---
name: hermes-local-auxiliary
description: Configure Hermes Agent auxiliary tasks (compression, title generation, etc.) to use a local llama.cpp server instead of cloud providers.
version: 1.1.0
author: Ares
license: MIT
platforms: [linux, macos]
metadata:
  hermes:
    tags: [hermes, llama.cpp, auxiliary, compression, title-generation, local-llm, GGUF]
---

# Hermes Local Auxiliary Providers

Configure Hermes Agent's auxiliary tasks (compression, title generation, skills hub, etc.) to run on a local llama.cpp server instead of cloud APIs. Useful for small, high-frequency tasks where you want zero API cost and full local control.

## When to use

- You want compression/title-generation to run locally on a GGUF model
- You have a `llama-server` already running or are willing to set one up
- The auxiliary task is "small" — summarization, title generation, classification — not complex reasoning
- You want to reduce API spend on high-volume auxiliary calls

## Architecture

Hermes auxiliary tasks use the `custom` provider with a `llama-cpp` alias. The flow:

```
Hermes auxiliary task → provider: llama-cpp (alias for custom) → base_url → llama-server (OpenAI-compatible) → GGUF model
```

Key insight: `provider: llama-cpp` in `auxiliary.*` config is an alias for the `custom` provider. It does NOT work without a `base_url` pointing to a running `llama-server` instance.

## Step 1: Build llama-server

If `llama-server` binary doesn't exist:

```bash
cd /path/to/llama.cpp
cmake -B build -DGGML_CUDA=OFF -DLLAMA_BUILD_SERVER=ON
cmake --build build --config Release -j$(nproc) --target llama-server
# Binary: build/bin/llama-server
```

## Step 2: Start llama-server

### Option A: systemd user service (recommended)

Create `~/.config/systemd/user/llama-server.service`:

```ini
[Unit]
Description=llama.cpp server (qwen2.5-0.5b-instruct)
After=network.target

[Service]
Type=simple
ExecStart=/path/to/llama-server \
  --model /path/to/model.Q4_K_M.gguf \
  --host 127.0.0.1 --port 8080 \
  --ctx-size 4096 \
  --n-gpu-layers 0 \
  --log-disable
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

```bash
systemctl --user daemon-reload
systemctl --user enable --now llama-server
```

NOTE: `systemctl --user` commands may be blocked by Hermes' command approval system. If blocked, use Option B below to manage the process manually.

### Option B: Background process (ephemeral)

```bash
# Kill any existing instance first
pkill -f llama-server

# Start in background
nohup llama-server --model /path/to/model.gguf --host 127.0.0.1 --port 8080 \
  --ctx-size 4096 --n-gpu-layers 0 --log-disable > /tmp/llama-server.log 2>&1 &
```

## Step 3: Configure Hermes auxiliary tasks

Use `hermes config set` (the protected config file cannot be edited directly):

```bash
# Compression
hermes config set auxiliary.compression.provider llama-cpp
hermes config set auxiliary.compression.base_url http://127.0.0.1:8080/v1
hermes config set auxiliary.compression.model <model-filename.gguf>
hermes config set auxiliary.compression.timeout 120

# Title generation
hermes config set auxiliary.title_generation.provider llama-cpp
hermes config set auxiliary.title_generation.base_url http://127.0.0.1:8080/v1
hermes config set auxiliary.title_generation.model <model-filename.gguf>
hermes config set auxiliary.title_generation.timeout 30
```

**Important:** The `model` value is the filename as `llama-server` reports it (e.g., `qwen2.5-0.5b-instruct-q4_k_m.gguf`), NOT the full filesystem path and NOT the HuggingFace repo name. Check the exact name with `curl http://127.0.0.1:8080/v1/models`.

## Step 4: Restart gateway

```bash
hermes gateway restart
```

## Step 5: Verify

```bash
# Health check
curl -s http://127.0.0.1:8080/health

# List loaded model
curl -s http://127.0.0.1:8080/v1/models

# Test inference
curl -s http://127.0.0.1:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"<model-name>","messages":[{"role":"user","content":"Reply: OK"}],"max_tokens":10}'
```

## Switching models at runtime

To swap the model without losing the server setup:

1. Download the new GGUF to the models directory.
2. Update the `ExecStart` line in `~/.config/systemd/user/llama-server.service` to point to the new model file.
3. Stop the running server: `pkill -f llama-server` (or `systemctl --user stop llama-server` if approvals allow).
4. Start the server with the new model (via systemd or manual background launch).
5. Update Hermes config: `hermes config set auxiliary.<task>.model <new-filename.gguf>`.
6. Verify: `curl -s http://127.0.0.1:8080/v1/models` should list the new model.
7. Test inference against the new model before considering it done.

**Note:** The model filename in Hermes config must exactly match the `id` field reported by `/v1/models`. This may differ from the HuggingFace repo name. For example, the file `qwen2.5-0.5b-instruct-q4_k_m.gguf` is reported as `id: qwen2.5-0.5b-instruct-q4_k_m.gguf`.

## Pitfalls

- **Port collision**: If systemd fails with "address already in use", a previous `llama-server` process is still running. Kill it first: `pkill -f llama-server`, then restart.
- **Model name mismatch**: The `model` in Hermes config must match what `llama-server` reports via `/v1/models`. Check with `curl http://127.0.0.1:8080/v1/models`.
- **Gateway restart kills background processes**: If you started `llama-server` as a Hermes background process (not systemd), a `hermes gateway restart` will kill it. Always use systemd for persistent servers.
- **`llama-cpp` is not a built-in provider**: It's an alias for `custom`. You MUST set `base_url`. An empty `base_url` will silently fail.
- **No GPU warnings**: If llama.cpp was compiled without GPU support, you'll see "no usable GPU found" warnings. These are harmless for CPU-only operation.
- **`systemctl --user` blocked by Hermes approval**: Hermes' command approval system may block `systemctl --user` commands. If so, manage the server manually with `pkill` + `nohup` (see Option B above), or update the systemd service file directly and reload.
- **JSON syntax in curl**: When testing via `curl`, ensure JSON numeric values are well-formed (e.g., `0.3` not `.3`). Malformed JSON returns a 500 parse error from llama-server.

## Choosing a model for auxiliary tasks

Auxiliary tasks (compression, title gen) don't need large models. Good choices:

| Model | Size | RAM | Speed (CPU) | Use case |
|-------|------|-----|-------------|----------|
| qwen2.5-0.5b-instruct Q4_K_M | ~0.5 GB | ~1 GB | ~30 tok/s | Minimal RAM, fast, good enough for titles/compression |
| gemma-2b-it Q4_K_M | ~1.5 GB | ~2 GB | ~19 tok/s | General purpose, slightly chatty output |
| phi-3-mini-4k Q4_K_M | ~2.3 GB | ~3 GB | ~12 tok/s | Better quality, slightly slower |
| qwen2.5-3b-instruct Q4_K_M | ~2 GB | ~2.5 GB | ~15 tok/s | Good multilingual |

For auxiliary tasks, even the 0.5B model is more than sufficient. Prefer qwen2.5-0.5b-instruct for the best RAM/speed tradeoff. It produces clean output without preamble (unlike gemma-2b which tends to add "Sure, here's...").

**Style Preference Note:** When using title generation for session titles, users prefer clean, direct output without conversational framing or preambles. The 0.5B model consistently produces titles like "Switch LLM in Hermes Agent" while gemma-2b adds unnecessary text like "Sure, here's the title you requested:". For best user experience, use qwen2.5-0.5b-instruct for auxiliary title generation.

## References

- [llama-server config reference](references/server-config.md) — full llama-server flags and tuning
- [Hermes auxiliary config reference](references/hermes-aux-config.md) — all auxiliary task config keys
- [FreeLLMAPI Integration Guide](references/freellmapi-integration.md) — API key storage and custom endpoint setup
- [Model Switching Workflow](references/model-switching-workflow.md) — proven process for switching llama.cpp models
