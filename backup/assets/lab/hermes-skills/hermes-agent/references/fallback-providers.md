# Fallback Provider Configuration

To handle token exhaustion or model unavailability, you can configure fallback providers in your `config.yaml`.

## Configuration
Update the `fallback_providers` list in `~/.hermes/config.yaml`. Hermes will attempt these in order if the primary model fails or returns a 429 (Rate Limit).

Example for model escalation:

```yaml
model:
  default: deepseek/deepseek-v4-flash:free
  provider: openrouter
fallback_providers:
  - provider: openrouter
    model: google/gemini-2.0-flash-001
  - provider: openrouter
    model: google/gemini-flash-1.5
```

## Note
Ensure the models in your fallback list are available via the specified provider. If you encounter authentication issues, run `hermes auth add <provider>`.
