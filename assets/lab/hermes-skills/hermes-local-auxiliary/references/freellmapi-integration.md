# FreeLLMAPI Integration Reference

This document captures key insights about FreeLLMAPI discovered during implementation sessions.

## API Key Storage Pattern

FreeLLMAPI stores API keys in an encrypted SQLite database at `~/freellmapi/server/src/db/index.ts`. The storage follows this pattern:

### Environment Variables (`.env`)
- **`ENCRYPTION_KEY`**: 64-character hex key for encrypting API keys (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- **`PORT`**: Server port (default: 3001)
- **`HOST_BIND`**: Interface binding (default: 127.0.0.1)
- **`PROXY_RATE_LIMIT_RPM`**: Rate limiting (default: 120)
- **`DASHBOARD_ORIGINS`**: CORS origins for dashboard

### Database Schema (SQLite)
Table: `api_keys`
- `platform`: string (e.g., 'openai', 'google', 'custom')
- `label`: string (user-friendly name)
- `encrypted_key`: string (AES-GCM encrypted)
- `iv`: string (initialization vector)
- `auth_tag`: string (authentication tag)
- `status`: string ('unknown', 'active', 'error')
- `enabled`: boolean (1/0)
- `base_url`: string (for custom endpoints)

### Custom Endpoints
FreeLLMAPI supports custom OpenAI-compatible endpoints via:
- `POST /api/keys/custom` - Add custom endpoint
- Each custom endpoint is stored as one row with `platform = 'custom'`
- The endpoint URL and optional API key are encrypted
- Multiple models can route through the same custom endpoint

## Key Management API Endpoints
- `GET /api/keys` - List all keys (masked)
- `POST /api/keys` - Add API key for built-in provider
- `POST /api/keys/custom` - Add custom OpenAI-compatible endpoint
- `DELETE /api/keys/:id` - Remove key
- `PATCH /api/keys/:id` - Update label or enable/disable
- `PATCH /api/keys/platform/:platform` - Toggle all keys for platform

## Integration Workflow
When integrating FreeLLMAPI with Hermes auxiliary tasks:
1. Set up FreeLLMAPI with your preferred OpenAI-compatible endpoint
2. Store the endpoint's API key in FreeLLMAPI via `/api/keys/custom`
3. Configure Hermes to point to FreeLLMAPI's OpenAI-compatible endpoint
4. Test connectivity with auxiliary tasks

## Security Notes
- API keys are encrypted using the `ENCRYPTION_KEY` from `.env`
- The encryption key is never exposed in the database
- Custom endpoints use the same encryption as built-in providers
- Enable/disable flags allow quick toggling of providers without key removal