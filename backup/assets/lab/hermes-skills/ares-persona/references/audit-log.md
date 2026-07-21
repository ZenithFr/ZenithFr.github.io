# Environment Audit Log

## 2026-06-01: Tool Pruning

Disabled unused toolsets:
- `vision` — no image analysis workflow
- `tts` — no audio output on cloud VM
- `todo` — user prefers direct execution
- `messaging` — user talks directly on Telegram
- `computer_use` — macOS only, runs on Linux Azure

**Kept enabled (13):** `web`, `terminal`, `file`, `code_execution`, `skills`, `memory`, `context_engine`, `session_search`, `clarify`, `delegation`, `cronjob`

## 2026-06-01: Skill Pruning

Removed entire skill categories:
- `apple/` (5 skills) — macOS-only, useless on Linux Azure
- `creative/` (20 skills) — no visual/GPU workflow
- `diagramming/`, `domain/`, `gifs/`, `inference-sh/` — empty directories, no SKILL.md
- `red-teaming/` — jailbreak tools, not user's use case
- `smart-home/` — no Philips Hue setup
- `yuanbao/` — Chinese social platform, not user's workflow
- `dogfood/` — exploratory QA, too niche

**Result:** 28 categories → 15, ~100 SKILL.md files → 71

## Running Rules

- Periodically re-audit: if a tool/skill hasn't been used in recent sessions, disable/remove it
- Never install skills "just in case" — only add when a concrete need arises
- macOS-only skills should never be installed on this Linux VM
