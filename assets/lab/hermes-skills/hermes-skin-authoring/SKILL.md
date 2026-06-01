---
name: hermes-skin-authoring
description: "Create and customize Hermes CLI skins — color palettes, spinners, branding, tool emojis"
version: 1.0.0
author: Ares
tags: [hermes, skin, theme, customization, cli]
---

# Hermes Skin Authoring

Create and customize visual themes for the Hermes Agent CLI. Skins are YAML files in `~/.hermes/skins/<name>.yaml`. Activate with `/skin <name>` in the CLI, or set `display.skin: <name>` in config.yaml for persistence.

## Skin YAML Schema

All fields are optional. Missing values inherit from the `default` skin.

```yaml
name: mytheme                  # Unique skin name (lowercase, hyphens ok)
description: Short description # Shown in /skin listing
```

### Colors

Hex values for Rich markup (banner, UI, response box, TUI).

```yaml
colors:
  # Banner panel
  banner_border: "#CD7F32"     # Panel border color
  banner_title: "#FFD700"      # Panel title text color
  banner_accent: "#FFBF00"     # Section headers (Available Tools, etc.)
  banner_dim: "#B8860B"        # Dim/muted text (separators, labels)
  banner_text: "#FFF8DC"       # Body text (tool names, skill names)

  # General UI
  ui_accent: "#FFBF00"         # General UI accent
  ui_label: "#DAA520"          # UI labels
  ui_ok: "#4caf50"             # Success indicators
  ui_error: "#ef5350"          # Error indicators
  ui_warn: "#ffa726"           # Warning indicators

  # Prompt & Input
  prompt: "#FFF8DC"            # Prompt text color (where user types)
  input_rule: "#CD7F32"        # Input area horizontal rule

  # Response box (ANSI terminal output)
  response_border: "#FFD700"   # Response box border

  # Status bar (bottom of TUI)
  status_bar_bg: "#1a1a2e"     # Status bar background
  status_bar_text: "#C0C0C0"   # Status bar default text
  status_bar_strong: "#FFD700" # Status bar highlighted/strong text
  status_bar_dim: "#8B8682"    # Status bar separators/muted text
  status_bar_good: "#8FBC8F"   # Healthy context usage
  status_bar_warn: "#FFD700"   # Warning context usage
  status_bar_bad: "#FF8C00"    # High context usage
  status_bar_critical: "#FF6B6B" # Critical context usage

  # Session display
  session_label: "#DAA520"     # Session label color
  session_border: "#8B8682"    # Session ID dim color

  # TUI-specific interactivity
  voice_status_bg: "#1a1a2e"   # TUI voice status background
  selection_bg: "#333355"      # TUI mouse-selection highlight background
  completion_menu_bg: "#1a1a2e"      # Completion menu background
  completion_menu_current_bg: "#333355"   # Active completion row background
  completion_menu_meta_bg: "#1a1a2e"      # Completion meta column background
  completion_menu_meta_current_bg: "#333355" # Active completion meta background
```

### Spinner

Animated spinner during API calls — faces, verbs, and wing decorations.

```yaml
spinner:
  waiting_faces: ["(⚔)", "(⛨)"]        # Faces shown while waiting for API
  thinking_faces: ["(⌁)", "(<>)"]       # Faces shown during reasoning
  thinking_verbs: ["forging", "plotting"]# Verbs for spinner messages
  wings:                                # Optional [left, right] decorations
    - ["⟪⚔", "⚔⟫"]
    - ["⟪▲", "▲⟫"]
```

### Branding

Text strings used throughout the CLI interface.

```yaml
branding:
  agent_name: "Hermes Agent"         # Banner title, status display
  welcome: "Welcome message"         # Shown at CLI startup
  goodbye: "Goodbye! ⚕"            # Shown on exit
  response_label: " ⚕ Hermes "     # Response box header label
  prompt_symbol: "❯"               # Input prompt symbol (renderer adds trailing space)
  help_header: "(^_^)? Commands"     # /help header text
```

### Tool Settings

```yaml
tool_prefix: "┊"                     # Character for tool output lines
tool_emojis:                          # Override default emoji per tool
  terminal: "⚔"
  web_search: "🔮"
  # Any tool not listed uses its registry default
```

### Banner Art (Optional)

Two Rich-markup strings for ASCII art in the banner:

```yaml
banner_logo: "[bold #FFD700]...[/]"  # Rich-markup ASCII art logo
banner_hero: "[#9F1C1C]...[/]"      # Rich-markup hero art
```

These replace `HERMES_AGENT_LOGO` and `HERMES_CADUCEUS` constants. Line-by-line Rich markup with hex colors.

## What Skins CANNOT Control (Terminal-Emulator Native)

These are NOT Hermes skin properties — they're controlled by your terminal emulator:

- **Scrollbar style/color** — terminal emulator renders its own (Kitty, iTerm2, WezTerm, ghostty, Alacritty, etc.)
- **Font family/size** — terminal emulator setting
- **Cursor style/color** — terminal emulator setting
- **Window transparency/blur** — terminal emulator setting
- **Terminal background opacity** — terminal emulator setting

## Activation

```bash
# In-session (temporary)
/skin catppucin

# Persistent config
hermes config set display.skin catppucin

# Available skins: default (gold), ares (crimson), mono (grayscale),
# slate (blue), daylight (light), warm-lightmode, poseidon (ocean),
# sisyphus, charizard, catppucin (user), cyberpunk (user)
```

## Pitfalls

- **Scrollbar**: Users often ask to color the scrollbar — it's terminal-emulator native, not a skin property. Offer to write their terminal emulator config for them.
- **Gray text complaints**: The `#cdd6f4` Catppuccin "Text" color reads as light blue-gray on dark backgrounds. Users who want punchier text prefer Catppuccin Mauve (`#cba6f7`), Rosewater (`#f5e0dc`), or Lavender (`#b4befe`) for strong non-gray readability.
- **Contrast**: When a user asks for "more contrast", step up dim/separator colors by one Catppuccin overlay level (e.g. Surface2→Overlay1, Surface1→Surface2) and brighten borders to a lighter shade.
- **YAML validation**: Use plain hex strings (quoted or unquoted). No trailing commas.
- **Skin not showing**: Check the file is in `~/.hermes/skins/<name>.yaml` and the `name` field in YAML matches the filename (minus extension).

## Catppuccin Mocha Reference Palette

Standard hex values for the Catppuccin Mocha palette, useful for skin authoring:

| Role | Hex | Name |
|------|-----|------|
| Background | `#1e1e2e` | Base |
| Darker bg | `#181825` | Mantle |
| Darkest bg | `#11111b` | Crust |
| Subtle bg | `#313244` | Surface0 |
| Subtle bg+ | `#45475a` | Surface1 |
| Subtle bg++ | `#585b70` | Surface2 |
| Muted | `#6c7086` | Overlay0 |
| Muted+ | `#7f849c` | Overlay1 |
| Muted++ | `#9399b2` | Overlay2 |
| Subtext | `#a6adc8` | Subtext0 |
| Subtext+ | `#bac2de` | Subtext1 |
| **Text** | `#cdd6f4` | Text (can read gray) |
| **Mauve** | `#cba6f7` | Strong purple, good body text |
| **Rosewater** | `#f5e0dc` | Warm pink, good body text |
| **Lavender** | `#b4befe` | Light purple-blue |
| Red | `#f38ba8` | Error/danger |
| Peach | `#fab387` | Warning |
| Yellow | `#f9e2af` | Accent/warn |
| Green | `#a6e3a1` | Success |
| **Teal** | `#94e2d5` | Borders/accent |
| Sky | `#89dceb` | Info highlight |
| Blue | `#89b4fa` | Primary accent |
| Pink | `#f5c2e7` | Accent |
| Flamingo | `#f2cdcd` | Accent |
| Maroon | `#eba0ac` | Medium red |
