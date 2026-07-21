# Approval Bypass Audit Guide

## Vulnerability Patterns
- Check if approval workflows can be bypassed by manipulating environment variables.
- Verify that `require_approval` patterns in `config.yaml` are strictly enforced for sensitive tools (`terminal`, `github`, `email`).
- Look for race conditions in approval prompts where a command might execute before the UI prompt is acknowledged.

## Audit Workflow
1. Review `security.provenance` settings in `config.yaml`.
2. Ensure `approvals.mode` is set to `manual` or `smart`.
3. Check `denylist` entries for critical system paths.
