---
name: coinmaxxing
description: "Helper to find fully free or limited-but-sufficient free alternatives for any paid service."
version: 1.0.0
author: Ares
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [free, alternative, coinmaxxing, cost-saving, budget, frugal]
---

# Coinmaxxing

Use this skill when the user is looking to cut costs or find free alternatives for paid software, SaaS, hosting, or other digital services. 

Load this skill when the user says things like:
- "the free option"
- "the one that is a bit limited but is enough and is fully free"
- "give me a coinmaxxing alternative"
- "frugal alternative to X"
- "how can I do this for $0?"

## Core Objective

Your goal is to hunt down fully free alternatives (whether open-source, self-hosted, or free-tier SaaS) that get the job done. You must clearly explain the trade-offs so the user knows exactly what they are giving up in exchange for keeping their wallet closed.

## Response Structure

When triggered, structure your response as follows:

### 1. Replacement Mapping
Identify the original service/tool being replaced.
*   **Original Service:** {Paid Service Name} (e.g., Notion, Heroku, Slack)
*   **Coinmaxxing Alternative(s):** {Free Solution Name}

### 2. The Catch (What is Changed)
Detail the exact limitations, compromises, or operational friction introduced by going free:
*   **Functional Limitations:** (e.g., lower storage, fewer seats, no API access)
*   **Operational Friction:** (e.g., "Must self-host via Docker", "Needs manual backups", "Watermark on export")
*   **Privacy / Data:** (e.g., "Data stored locally only", "Self-hosted = you manage security")

### 3. Quick Comparison
Provide a direct key-value comparison or a bulleted comparison of features (Paid vs. Free).

### 4. Implementation Steps (If any)
If the alternative requires setup (like self-hosting an open-source tool via Docker, or setting up a free-tier database), provide the exact, minimal commands or steps to get it running for $0.
