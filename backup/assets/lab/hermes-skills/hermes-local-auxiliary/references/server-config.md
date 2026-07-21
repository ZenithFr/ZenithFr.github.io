# llama-server Configuration Reference

## Full flag reference (common flags)

```bash
llama-server \
  --model /path/to/model.gguf \
  --host 127.0.0.1 \
  --port 8080 \
  --ctx-size 4096 \
  --n-gpu-layers 0 \
  --threads 8 \
  --batch-size 512 \
  --connections 10 \
  --log-disable \
  --timeout 60
```

## Building with specific backends

```bash
# CPU only
cmake -B build -DLLAMA_BUILD_SERVER=ON
cmake --build build --config Release -j$(nproc) --target llama-server

# CUDA
cmake -B build -DLLAMA_BUILD_SERVER=ON -DGGML_CUDA=on
cmake --build build --config Release -j$(nproc) --target llama-server

# Metal (Apple Silicon)
cmake -B build -DLLAMA_BUILD_SERVER=ON -DGGML_METAL=on
cmake --build build --config Release -j$(nproc) --target llama-server
```

## Server endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /v1/models` | List loaded models |
| `POST /v1/chat/completions` | OpenAI-compatible chat |
| `POST /v1/embeddings` | Embeddings (if --embedding flag) |

## Context window sizing for auxiliary tasks

| ctx-size | Approx RAM (Q4, 2B model) |
|----------|--------------------------|
| 2048 | ~1.5 GB |
| 4096 | ~2 GB |
| 8192 | ~3 GB |

For compression-only use, 2048 is often sufficient. 4096 is a safe default.

## Performance tuning

- `--threads N`: Set to number of physical CPU cores
- `--batch-size 512`: Good default for prompt processing
- `--connections 5`: Plenty for auxiliary use (one request at a time)
