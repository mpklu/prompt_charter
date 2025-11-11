# Prompt Charter
Curated, enforceable architectural and process rule sets for guiding AI coding tools (GitHub Copilot, Claude, etc.) to produce consistent, non-chaotic output across project types.

## Purpose
- Prevent AI from generating ad‑hoc architectures.
- Provide deterministic constraints per domain (frontend apps, APIs, data pipelines, infra-as-code, conversations).
- Accelerate onboarding by reusing codified standards.
- Enable portable “prompt rule packs” you can drop into any repo.

## Core Principles
1. Rules are concise, binary (✅ REQUIRED / ❌ FORBIDDEN).
2. No inline code unless absolutely necessary (separate examples docs).
3. Single source of truth per domain (one file per rule set).
4. Versioned, review-gated changes (no silent drift).
5. AI consumption first: easily prepend to prompts.


## Authoring Rules
- One concept per bullet.
- Must start with ✅ or ❌.
- No speculative roadmap content inside rules.
- Avoid ambiguous verbs (prefer MUST / NEVER replaced by ✅ REQUIRED / ❌ FORBIDDEN).
- Keep domains independent—do not cross-link rules; use references section instead.

## Consumption Pattern
Example prompt header:
```
"Load and obey all rules in domains/frontend-react/RULES.md. Do not violate any ❌ items. Now implement a FeatureFlagService."
```

See more in  [PROMPT_INJECTION](./templates/PROMPT_INJECTION.md)

## Template

- [RULESET_TEMPLATE](./templates/RULESET_TEMPLATE.md)
- [PROMPT_INJECTION](./templates/PROMPT_INJECTION.md)


## Why This Matters
Without enforced guardrails, AI code assistance drifts architecture, duplicates patterns, and increases maintenance overhead. Prompt Leash constrains generation to explicit, auditable standards.

---
Maintainers: Add contact and governance details here.