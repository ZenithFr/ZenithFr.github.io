# Hermes Agent Optimization Guide

Configuration and operational patterns for maximizing Hermes efficiency — fewer tokens per turn, faster responses, and less context bloat. Derived from real-world troubleshooting sessions.

## Fallback Providers (Critical)

An empty `fallback_providers: []` means rate-limited models get retried in-place, wasting tokens. Always configure a chain:

```yaml
fallback_providers:
  - provider: openrouter
    model: <fast-cheap-primary>
  - provider: openrouter
    model: <fast-cheap-secondary>
```

Models should be available (authenticated) or Hermes will skip to the next entry. Run `hermes auth reset <provider>` to clear exhaustion flags after a 429.

## Toolset Thinning

Every enabled tool injects its JSON schema into every turn's system prompt. Disabled tools cost zero tokens.

**Safe to disable for most users:**
- `browser` — unless you browse the web regularly through Hermes
- `image_gen` — unless you generate images often
- `video` / `video_gen` — unless you analyze/generate video
- `spotify` — unless you control Spotify playback
- `computer_use` — rarely needed; standard `terminal` covers most tasks
- `homeassistant` — smart-home only
- `kanban` — multi-agent workflows only

**Keep enabled:** `web`, `search`, `terminal`, `file`, `code_execution`, `vision`, `skills`, `memory`, `session_search`, `delegation`, `cronjob`, `todo`.

Disable via `hermes tools disable <name>` or edit `config.yaml` → `disabled_toolsets`.

## Memory and Profile Budgets

System-injected memory consumes context every turn. Keep lean:
- `memory.memory_char_limit`: default 2200 — reduce to 1500 if not using many procedural notes
- `memory.user_char_limit`: default 1375 — reduce to 800 unless you need long user profiles

Periodically audit with the `memory` tool: remove entries that are stale, one-off task details, or easily rediscovered facts. Save durable preferences (tone, workflow) to skills — not memory.

## Compression Tuning

```yaml
compression:
  enabled: true
  threshold: 0.65      # compress at 65% context fill (was 0.50 default)
  target_ratio: 0.25   # compress to 25% of original
  protect_first_n: 2   # protect first 2 messages (instructions + first user turn)
  hygiene_hard_message_limit: 300  # cap compressed history length
```

Earlier compression with a tighter target keeps the effective context window smaller across long sessions.

## Model Selection for Instruction Adherence

Lighter models "steer away" from initial commands — they interpret, expand, and add preamble. For direct task execution:

**Best:** `deepseek-coder-v4-flash`, `gemini-2.5-flash-lite`
**Avoid for complex tasks:** free-tier models (nemotron-free, etc.)

```bash
hermes config set model.default "openrouter/deepseek-coder-v4-flash"
hermes config set model.provider openrouter
```

## Agent Behavior Tuning

```yaml
agent:
  reasoning_effort: low     # was 'medium' — reduces tangential thinking
  max_turns: 30             # was 90 — prevents long meandering sessions
```

## Reducing Per-Turn Overhead

```bash
# Skip shell init if you don't need env vars in every command
hermes config set terminal.auto_source_bashrc false

# Cap tool output before it enters context
hermes config set tool_output.max_bytes 25000   # was 50KB
hermes config set tool_output.max_lines 1000     # was 2000

# Disable unused integrations
hermes config set stt.enabled false   # unless you use voice input
hermes config set lsp.enabled false   # unless editing code
hermes config set display.show_reasoning false  # already default
```

## Cron Jobs

Keep `deliver: "local"` for background monitoring jobs — they run silently and don't push notifications. Only use `deliver: "origin"` when the user wants to see results inline.

## Quick Config Version Check

```bash
hermes config check   # shows version drift and missing options
hermes config migrate # pull in new config options
```
