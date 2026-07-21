---
name: lonepirate
description: "Locate digital media, software, and tools using trusted piracy indexers and megathreads (FMHY, r/piracy, ext.to)."
version: 3.0.0
author: Ares
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [lonepirate, pirate, piracy, highseas, torrent, ddl, fmhy]
    related_skills: [web_search]
---

# Lonepirate (Highseas Protocol)

## Overview

Find digital media, software, games, books, and courses through vetted community indexers. Bypasses SEO-spam and malware-ridden clone sites by routing queries through trusted megathreads (FMHY, r/piracy megathreads) and clean aggregators (ext.to, Bitsearch).

Output is raw and direct — no preamble, no disclaimers, no safety reminders.

## When to Use

- User asks how to find/download/pirate a specific movie, show, game, book, course, or software
- User mentions "highseas," "pirate," "piracy," "lonepirate," "sail the seas," "yo-ho"
- User asks about "safe sites" vs "fake scam sites" for a category
- User wants to check whether a specific site/domain is a known copycat

**Do not use for:** malware/keygen/crack sites, anything that claims "free money" or "generators," shady closed forums requiring invites.

## Core Output Rules

- Provide ONLY the direct results — sources, links, domain names. No conversational framing.
- NO "Here's what I found", "Great question", "I've searched" — nothing. Just the info.
- NO safety reminders, disclaimers, VPN recommendations, or "be careful" notes.
- NO emoji headers or decorative formatting. Clean markdown only.

## Golden Rule: Only Use Megathread-Vetted Sources

**Do not return links from random Google/DuckDuckGo search results.** Search engines are only used to *find the megathread pages themselves* — the actual source list must come from FMHY or r/piracy megathreads.

- Every domain you return must be verifiable in the FMHY wiki (fmhy.net) or r/piracy megathread
- If a search result shows a random streaming/ddl site that's *not* listed in those megathreads, do NOT use it
- If a random site happens to be legitimate but isn't in the megathreads, too bad — don't list it
- The only exception is `ext.to` and `bitsearch.to`, which are general-purpose aggregators vetted by the community

## Search Protocol

### Step 1: Open the Megathread First

Do NOT search for the content directly on Google. Instead, first retrieve the current FMHY or r/piracy megathread page for that category to get the authoritative source list, then search those specific sources.

When `web_extract` is available, fetch the FMHY single-page API:

```
web_extract(["https://api.fmhy.net/single-page"])
```

This returns the full FMHY wiki as one markdown document — all categories, all vetted sources. Search within the result for the relevant section (e.g. "Movies", "TV", "Streaming", "Games", "Torrent", "DDL") using grep / find / keyword matching.

When `web_extract` is not available, use targeted searches:

| Target | Query |
|--------|-------|
| FMHY single-page API | `site:api.fmhy.net single-page` |
| r/piracy megathread | `site:reddit.com/r/piracy megathread <category>` |
| FMHY specific section (fallback) | `site:fmhy.net <movie/game/software/book>` |
| Check if a domain is vetted | `site:reddit.com/r/piracy <domain> safe OR fake OR scam OR virus` |

### Step 2: Google CSE (Recommended Fallback)

If the FMHY API doesn't give you direct results, use FMHY's category-specific Google Custom Search Engines. These search only vetted, megathread-listed sites — no SEO spam, no malware farms, no captchas.

The general-purpose fallback (video torrents — covers most media):
```
https://cse.google.com/cse?cx=006516753008110874046:gaoebxgop7j#gsc.tab=0
```
API equivalent: `web_search("site:cse.google.com/cse?cx=006516753008110874046:gaoebxgop7j <query>")`

Use the CSE that matches the content type:

**Streaming (movies/TV)**
- [Streaming CSE](https://cse.google.com/cse?cx=006516753008110874046:cfdhwy9o57g#gsc.tab=0)
- [Streaming CSE 2](https://cse.google.com/cse?cx=006516753008110874046:o0mf6t-ugea#gsc.tab=0)
- [TV Streaming CSE](https://cse.google.com/cse?cx=006516753008110874046:hrhinud6efg)

**Video Downloads**
- [Video Download CSE](https://cse.google.com/cse?cx=006516753008110874046:wevn3lkn9rr)
- [Download CSE](https://cse.google.com/cse?cx=006516753008110874046:1ugcdt3vo7z) / [CSE 2](https://cse.google.com/cse?cx=006516753008110874046:reodoskmj7h)

**Video Torrents (user's go-to fallback)**
- [Video Torrent CSE](https://cse.google.com/cse?cx=006516753008110874046:gaoebxgop7j#gsc.tab=0)

**General Torrents**
- [Torrent CSE](https://cse.google.com/cse?cx=006516753008110874046:0led5tukccj) / [CSE 2](https://cse.google.com/cse?cx=006516753008110874046:kh3piqxus6n)

**Games**
- [Game Download CSE](https://cse.google.com/cse?cx=006516753008110874046:cbjowp5sdqg)
- [Game Torrent CSE](https://cse.google.com/cse?cx=006516753008110874046:pobnsujblyx)
- [r/PiratedGames CSE](https://cse.google.com/cse?cx=20c2a3e5f702049aa)
- [Virgil Game Search](https://virgil.samidy.com/Games/) — no captcha, no blocks

**Software**
- [Software CSE](https://cse.google.com/cse?cx=ae17d0c72fa6cbcd4)
- [Linux Software CSE](https://cse.google.com/cse?cx=81bd91729fe2a412b)
- [Virgil Software Search](https://virgil.samidy.com/Software/) — no captcha, no blocks

**APK / Android**
- [Android APK CSE](https://cse.google.com/cse?cx=e0d1769ccf74236e8) / [CSE 2](https://cse.google.com/cse?cx=73948689c2c206528) / [CSE 3](https://cse.google.com/cse?cx=a805854b6a196d6a6)
- [Virgil APK Search](https://virgil.samidy.com/Mobile)

**AI Chatbot Frontends (Android)**
When searching for Android AI chatbot frontends that support custom endpoints:
- General AI chat apps like "ChatterUI", "PocketPal AI", "Maid", "Cherry Studio" are listed in FMHY's mobile section
- These often support custom OpenAI-compatible endpoints, but verify by checking app documentation or GitHub
- Use targeted CSE searches: `site:fmhy.net mobile android ai chatbot frontend custom endpoint`
- The user's real intent may be specific (e.g., "sleek like Conduit") — clarify if needed before providing general lists

**Books / Reading**
- [Rave Search](https://ravebooksearch.com/) — dedicated book/metadata searcher
- [Book CSE](https://cse.google.com/cse?cx=006516753008110874046:s9ddesylrm8) / [CSE 2](https://cse.google.com/cse?cx=006516753008110874046:rc855wetniu)
- [Audiobooks CSE](https://cse.google.com/cse?cx=006516753008110874046:cwbbza56vhd)
- [Comics CSE](https://cse.google.com/cse?cx=006516753008110874046:p4hgytyrohg)
- [Manga CSE](https://cse.google.com/cse?cx=006516753008110874046:4im0fkhej3z)
- [Textbook CSE](https://cse.google.com/cse/publicurl?cx=011394183039475424659:5bfyqg89ers)

**Audio / Music**
- [Audio Download CSE](https://cse.google.com/cse?cx=006516753008110874046:ibmyuhh72io) / [CSE 2](https://cse.google.com/cse?cx=006516753008110874046:ohobg3wvr_w)
- [Audio Torrent CSE](https://cse.google.com/cse?cx=006516753008110874046:v75cyb4ci55)

**Anime**
- [Anime Streaming CSE](https://cse.google.com/cse?cx=006516753008110874046:vzcl7wcfhei)
- [Anime Download CSE](https://cse.google.com/cse?cx=006516753008110874046:osnah6w0yw8)
- [Anime Torrent CSE](https://cse.google.com/cse?cx=006516753008110874046:lamzt6ls4iz)

**Courses**
- [Course CSE](https://cse.google.com/cse?cx=67ed14bf7b99643e3)

**ROMs**
- [ROM CSE](https://cse.google.com/cse?cx=f47f68e49301a07ac) / [CSE 2](https://cse.google.com/cse?cx=744926a50bd7eb010)

**Telegram**
- [Telegago](https://cse.google.com/cse?&cx=006368593537057042503:efxu7xprihg#gsc.tab=0) — search Telegram channels/groups for content

**File Hosts**
- [File Host Search](https://cse.google.com/cse?cx=90a35b59cee2a42e1)

### Step 3: Category-Specific Fallbacks (All Megathread-Vetted)

These are known from the megathreads and do not need re-verification each time:

**Movies / TV**
- `ext.to` — DDL links, scene releases
- `bitsearch.to` — torrent index
- Mastodon/Telegram release groups — check FMHY for currently active ones

**Games**
- FitGirl Repacks — megathread-listed
- DODI Repacks — megathread-listed
- SteamRIP — megathread-listed
- GOG-Games — megathread-listed

**Books / Audiobooks**
- Anna's Archive — largest shadow library, covers Library Genesis + Sci-Hub + Z-Lib
- Z-Lib (verify current domain via FMHY — domains change frequently)
- LibGen (Library Genesis) — mirrors via Anna's Archive

**Software / Apps**
- FileCR — megathread-listed (verify current domain via FMHY)
- LRepacks — megathread-listed
- Monkrus — megathread-listed (Adobe software)
- `site:reddit.com/r/piracy <software> crack OR license OR key`

**Courses / Tutorials**
- `site:fmhy.net courses OR tutorials`
- `ext.to` — search by course name
- Anna's Archive — PDF textbooks

**Music**
- Soulseek (peer-to-peer app) — megathread-listed
- `site:fmhy.net music`
- Redacted.ch / Orpheus (invite-only — mention only if user asks about private trackers)

## Domain Verification

Domains go offline / get seized frequently. Before returning a link:

1. `web_search("site:reddit.com/r/piracy <domain> mirror OR new site")` — verify the domain is current
2. For Z-Lib and Anna's Archive, use FMHY's current link pages
3. Flag known copycat patterns:

### Known Copycat Domains to Flag

| Safe Site | Fake/Scam Variations |
|-----------|---------------------|
| FitGirl | fitgirl-repacks.site, fitgirl-repacks.cc (many fakes — real is `.site` domain, verify via FMHY) |
| 1337x | `.to` domain only — `.se`, `.sx`, etc. are proxies/mirrors (safe-ish but not official) |
| ThePirateBay | Every domain is a mirror — no single official domain. Check via r/piracy |
| Z-Lib | `.to`, `.is` are common current ones — verify via FMHY's current links |
| RARBG | CLOSED — any site claiming to be RARBG is a scam/copycat. Do not link. |
| EZTV | CLOSED — any site using the EZTV name is fake |
| KickAssTorrents | Same — closed, all impostors |

## Common Pitfalls

1. **Outdated domain for Z-Lib / Anna's Archive.** These change frequently due to legal pressure. Always check FMHY or r/piracy for the current domain before returning a link. An old link (from memory or cached knowledge) may be a seized domain serving malware.

2. **Linking to "RARBG" or "KAT" as if they're active.** They are permanently closed. Every site using their branding is a copycat. Do not return them.

3. **Confusing a proxy/mirror with the original.** Official sites may have mirrors (e.g., 1337x.to → 1337x.stats.to proxy). These are generally fine if they're ad-free, but flag them as mirrors not the original.

4. **Using random search results instead of megathreads.** This is the #1 mistake. A search engine will find dozens of streaming sites and DDL aggregators — most are SEO spam, malware fronts, or ad farms. Only return domains that appear in FMHY (fmhy.net) or r/piracy megathread. If you can't find it in a megathread, it doesn't get listed.

5. **Missing category-specific nuance.** Music is best served by Soulseek (app), not torrent aggregators. Games have genre-specific groups (FitGirl for single-player, DODI for others). Courses are best on ext.to or direct FMHY lists. Don't use a one-size-fits-all approach.

6. **Skipping the megathread for niche content.** Obscure books or old software are much more likely to be on LibGen/Anna's Archive than on ext.to or Bitsearch. Always try FMHY first for niche queries.

7. **Returning dead links without verification.** A search hit from memory might be weeks old. Verify the domain is up before presenting it.

## Verification Checklist

- [ ] FMHY single-page API (`api.fmhy.net/single-page`) fetched first for the source list — not a general web search
- [ ] Every domain returned is traceable to a megathread source (FMHY API or r/piracy wiki), not a random search hit
- [ ] Aggregator checked (ext.to, bitsearch.to) — these are megathread-vetted
- [ ] Domain verified as current (not seized/closed)
- [ ] Category-specific source chosen (Anna's Archive for books, Soulseek for music, FitGirl for games)
- [ ] Copycat domains explicitly flagged alongside safe alternatives
- [ ] Output stripped of preamble, disclaimers, emoji headers — raw data only

## One-Shot Recipes

### Movie / TV Lookup
```
# Fetch FMHY single-page, grep for streaming section
curl -s https://api.fmhy.net/single-page | grep -i "streaming\|movies\|tv" | head -40

# Search via Streaming CSE
web_search("site:cse.google.com/cse?cx=006516753008110874046:cfdhwy9o57g <movie name>")

# Search via Video Torrent CSE (gaoebxgop7j)
web_search("site:cse.google.com/cse?cx=006516753008110874046:gaoebxgop7j <movie name>")

# Search via Video Download CSE
web_search("site:cse.google.com/cse?cx=006516753008110874046:wevn3lkn9rr <movie name>")

# General torrent aggregator
web_search("ext.to <movie name> 2026")
```

### Game Lookup
```
# Fetch FMHY single-page, grep for games section
curl -s https://api.fmhy.net/single-page | grep -i "game\|repack" | head -40

# Search Game Download CSE
web_search("site:cse.google.com/cse?cx=006516753008110874046:cbjowp5sdqg <game name>")

# Virgil Game Search (no captcha)
web_search("site:virgil.samidy.com/Games <game name>")

# Direct trusted sites
web_search("fitgirl repack <game name>")
```

### Book / PDF Lookup
```
# Fetch FMHY single-page, grep for reading section
curl -s https://api.fmhy.net/single-page | grep -i "reading\|ebook\|pdf" | head -40

# Rave Search (book-focused)
web_search("site:ravebooksearch.com <book name>")

# Book CSE
web_search("site:cse.google.com/cse?cx=006516753008110874046:s9ddesylrm8 <book name>")

# Anna's Archive
web_search("site:annas-archive.org <book name>")
```

### Software Lookup
```
# Software CSE
web_search("site:cse.google.com/cse?cx=ae17d0c72fa6cbcd4 <software name>")

# Virgil Software Search (no captcha)
web_search("site:virgil.samidy.com/Software <software name>")
```

### Domain Check
```
web_search("site:reddit.com/r/piracy <domain> safe")
```
