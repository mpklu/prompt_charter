# AI Agent Pre-flight Checklist

Before submitting a Pull Request or concluding a task, you must verify your work against these guardrails.

## Priority Levels
- **MUST:** Non-negotiable requirements (security, correctness, data safety)
- **SHOULD:** Strong expectations unless justified exception (testing, documentation)
- **CONSIDER:** Quality improvements to evaluate (refactoring, optimization)

---

## 1. Principles Validation

### Single Source of Truth (DRY)
- **SHOULD** eliminate duplicate logic when the same concept appears 3+ times AND changes together
- **MUST NOT** unify code that represents different business concepts, even if implementation looks similar
- **Challenge yourself:** Does this abstraction reduce or increase cognitive load?

### Single Responsibility
- **SHOULD** ensure each component has one reason to change
- **Test:** Can you describe its purpose in one sentence without using "and"?
- **If multiple responsibilities exist:** Split into separate components

### Explicit Side Effects
- **MUST** make I/O operations, state changes, and external calls obvious from function names or signatures
- **SHOULD** document unexpected side effects in comments
- **Examples:** `saveAndNotifyUser()` is better than `saveUser()` if it sends emails

### Minimal Viable Solution (KISS)
- **MUST** implement only requested requirements—no speculative features
- **Challenge yourself:** Could this be accomplished with 50% less code?
- **CONSIDER:** Is there a simpler pattern already used in this codebase?

### Dependency Management
- **SHOULD** decouple high-level business logic from low-level details (databases, APIs, external services)
- **MUST** use existing project patterns/libraries before introducing new dependencies
- **CONSIDER:** Does this change introduce a new library when an existing one suffices?

---

## 2. Security & Data Safety (MUST)

### Input Validation
- **MUST** validate and sanitize all external inputs (user data, API responses, file uploads)
- **MUST** use allowlists over denylists where possible
- **Check:** SQL injection, XSS, path traversal vulnerabilities

### Secrets Management
- **MUST** externalize all credentials, API keys, tokens, and sensitive configuration
- **MUST** check git history to ensure secrets were never committed
- **MUST** use environment variables or secure vaults

### Authorization & Access Control
- **MUST** respect existing authentication/authorization patterns
- **MUST** verify user permissions before sensitive operations
- **Check:** Can unauthorized users access this endpoint or data?

### Data Privacy & Compliance
- **MUST** consider PII, GDPR, HIPAA, or other regulatory requirements
- **MUST** document what personal data is collected, processed, or stored
- **SHOULD** implement data retention and deletion policies where applicable

---

## 3. Proof of Work & Testing (MUST/SHOULD)

### Manual Verification Evidence Required
You **MUST** exercise the change yourself before submitting:

- **Backend/API:** Provide command sequence, API requests/responses, or execution logs
- **Frontend/UI:** Provide screenshot or screen recording showing the working feature
- **CLI Tools:** Provide terminal output demonstrating the commands and results
- **Refactoring:** Provide test suite results proving behavior is unchanged
- **Config/Docs Only:** Note "No behavioral change—documentation only" in PR description

### Automated Testing
- **MUST** include automated tests for all behavioral changes (new features, bug fixes, logic changes)
- **MUST** ensure tests fail when the implementation is removed (proves they test the right thing)
- **SHOULD** follow existing test patterns and naming conventions in the codebase
- **Exception:** Pure documentation, configuration, or formatting changes without logic impact

### Test Quality Checklist
- [ ] Tests the actual requirement, not implementation details
- [ ] Uses realistic data and scenarios
- [ ] Covers edge cases and error conditions
- [ ] Has clear, descriptive test names
- [ ] Runs quickly (unit tests < 100ms, integration tests < 5s)

---

## 4. Production Readiness (MUST/SHOULD)

### Error Handling
- **MUST** handle all expected error cases gracefully
- **MUST** provide actionable error messages (what happened, why, what to do)
- **SHOULD** log errors with sufficient context for debugging
- **Check:** What happens if the database is down? API times out? File doesn't exist?

### Observability
- **SHOULD** add logging at key decision points and state changes
- **SHOULD** include relevant context in logs (user ID, request ID, transaction ID)
- **CONSIDER** adding metrics for performance-critical paths
- **Check:** Can you debug this in production with only logs and metrics?

### Performance & Scalability
- **SHOULD** test with realistic data volumes (not just 10 test records)
- **MUST** avoid N+1 queries, unbounded loops, or memory leaks
- **CONSIDER** caching strategies for expensive operations
- **Check:** What happens with 10x, 100x, or 1000x current data volume?

### Backwards Compatibility
- **MUST** maintain compatibility with existing integrations, APIs, and data formats
- **MUST** provide migration path if breaking changes are necessary
- **SHOULD** version APIs when introducing incompatible changes
- **Check:** Will this break existing clients or require data migration?

### Rollback Plan
- **MUST** ensure changes can be safely reverted (feature flags, database migrations)
- **SHOULD** document rollback procedure for risky changes
- **CONSIDER** deploying behind feature flag for gradual rollout

---

## 5. Documentation (SHOULD)

### Code Documentation
- **MUST** document complex algorithms or non-obvious logic
- **SHOULD** document public APIs with expected inputs, outputs, and side effects
- **SHOULD** update existing documentation affected by your changes
- **Example:** "Why" comments are more valuable than "what" comments

### Migration Guides
- **MUST** provide migration guide for breaking changes
- **SHOULD** include before/after code examples
- **SHOULD** document deprecated features and their replacements

### Decision Records
- **CONSIDER** documenting architectural decisions (why this approach over alternatives)
- **SHOULD** include trade-offs and constraints that influenced the decision
- **Useful for:** Future maintainers understanding context

---

## 6. Context Engineering & Planning

### Specification Before Implementation
- **SHOULD** create brief design document for non-trivial changes covering:
  - Problem statement (what are we solving?)
  - Proposed approach (how will we solve it?)
  - Alternatives considered (what else did we evaluate?)
  - Acceptance criteria (how do we know it works?)
- **Exception:** Simple bug fixes or minor tweaks—use judgment
- **MUST** get human approval before implementing large architectural changes

### Scope Management
- **MUST** break large tasks into manageable, iterative chunks
- **SHOULD** complete one focused change per PR (avoid "mega PRs")
- **Challenge yourself:** Can this be split into 2-3 smaller PRs?
- **Benefit:** Easier review, safer rollback, clearer git history

### Relevant Context Only
- **SHOULD** include only necessary files and documentation in your context
- **MUST** explicitly state which parts of the codebase are out of sco