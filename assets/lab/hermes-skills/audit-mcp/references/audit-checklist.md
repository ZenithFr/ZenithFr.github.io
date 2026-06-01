# MCP Security Audit Checklist

## Integrity Verification
- [ ] Check if the server is running as the expected user.
- [ ] Verify the allowlist contains only trusted origins.
- [ ] Ensure that `allow_sampling` is disabled for any untrusted or community-sourced MCP servers.

## Audit Command
When running the automated audit (scheduled via cron), verify:
1. List of MCP servers + trust levels.
2. Last update timestamp from GitHub/npm.
3. Flag any server with >90 days since last commit.
4. Flag any `trusted` server that has `allow_sampling: true` or reads from untrusted inputs.
