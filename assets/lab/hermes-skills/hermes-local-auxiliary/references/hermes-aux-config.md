# Hermes Auxiliary Task Configuration Reference

All `auxiliary.*` tasks that accept `provider`, `model`, `base_url`, `api_key`, `extra_body`, `timeout`:

| Task | Config path | Typical timeout | Notes |
|------|------------|----------------|-------|
| Compression | `auxiliary.compression` | 120s | Summarizes conversation turns; small model fine |
| Title generation | `auxiliary.title_generation` | 30s | Session titles; very small model OK |
| Skills hub | `auxiliary.skills_hub` | 30s | Skill search/matching |
| Curator | `auxiliary.curator` | 600s | Skill curation; needs more context |
| Approval | `auxiliary.approval` | 30s | Dangerous command classification |
| MCP dispatch | `auxiliary.mcp` | 30s | MCP tool routing |
| Vision | `auxiliary.vision` | 120s | Image analysis; needs vision model |
| Web extract | `auxiliary.web_extract` | 360s | Page summarization |
| Kanban decomposer | `auxiliary.kanban_decomposer` | 180s | Task decomposition |
| Profile describer | `auxiliary.profile_describer` | 60s | Profile summarization |
| Triage specifier | `auxiliary.triage_specifier` | 120s | Issue triage |

## Valid provider values

Built-in: `openrouter`, `openai-codex`, `copilot`, `anthropic`, `gemini`, `deepseek`, `nous`, `nvidia`, `huggingface`, `ollama-cloud`, `alibaba`, `kimi-coding`, `minimax`, `zai`, `arcee`, `xai`, `xiaomi`, `kilocode`, `opencode-zen`, `opencode-go`, `novita`, `stepfun`, `azure-foundry`, `bedrock`, `gmi`, `qwen-oauth`, `copilot-acp`

Local/compatible: `custom` (aliases: `ollama`, `local`, `vllm`, `llamacpp`, `llama.cpp`, `llama-cpp`)

Use `auto` (default) to let Hermes pick based on main model provider.

## Compression top-level keys

Top-level `compression:` (not `auxiliary.compression:`):

```yaml
compression:
  enabled: true
  threshold: 0.55          # Fraction of context that triggers compression
  target_ratio: 0.25       # How much of threshold to keep as tail
  protect_last_n: 20       # Always keep last N messages
  hygiene_hard_message_limit: 400
  abort_on_summary_failure: false
```

`auxiliary.compression.*` controls **which model** does summarization.
Top-level `compression.*` controls **when/how** compression triggers.
