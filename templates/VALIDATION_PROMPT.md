# Rule Validation Prompt Template

Use this prompt to have AI validate a codebase against domain-specific `RULES.md` files.

---

## Single-File Validation Prompt

```
Load and understand all rules in domains/<DOMAIN>/<SUBDOMAIN>/RULES.md.

Task: Inspect the file at <FILE_PATH> and validate compliance.

For each violation found, report:
1. Rule violated (quote the exact ✅ REQUIRED or ❌ FORBIDDEN item)
2. Line number(s) where violation occurs
3. Specific code snippet demonstrating the violation
4. Suggested fix (code only, no prose)

Format violations as:
```
VIOLATION: <Rule Category> - Line <X>
Rule: ❌ FORBIDDEN: <exact rule text>
Code: <snippet>
Fix: <corrected code>
```

If no violations found, respond: "✅ No violations detected in <FILE_PATH>"

Do NOT suggest improvements beyond rule compliance.
```

---

## Multi-File Validation Prompt

```
Load and understand all rules in domains/<DOMAIN>/<SUBDOMAIN>/RULES.md.

Task: Scan all files matching the pattern <GLOB_PATTERN> (e.g., src/services/**/*.ts) and validate compliance.

For each file with violations:
1. State the file path
2. List each violation with:
   - Rule violated (quote exact ✅/❌ text)
   - Line number(s)
   - Code snippet
   - Suggested fix

Format output as:
```
FILE: <path>
├─ VIOLATION 1: Line <X>
│  Rule: ❌ FORBIDDEN: <text>
│  Code: <snippet>
│  Fix: <corrected code>
├─ VIOLATION 2: Line <Y>
   ...

SUMMARY: <X> files scanned, <Y> files with violations, <Z> total violations
```

Skip files with no violations.
Do NOT suggest architectural changes beyond rule compliance.
```

---

## Architecture-Level Validation Prompt

```
Load and understand all rules in domains/<DOMAIN>/<SUBDOMAIN>/RULES.md.

Task: Analyze the overall architecture of <PROJECT_PATH> for systemic rule violations.

Focus on:
1. Data flow violations (e.g., components calling services directly)
2. Missing layer implementations (e.g., services without corresponding schemas)
3. Inconsistent patterns across similar files (e.g., 5 services follow rules, 2 don't)
4. File organization violations (wrong directory structure)

Report findings as:
```
SYSTEMIC ISSUE: <Category>
Rule: <exact rule text>
Affected files: <list>
Pattern: <describe the architectural problem>
Impact: <why this matters>
Fix strategy: <high-level approach, not code>
```

Prioritize violations by:
- CRITICAL: Breaks core data flow or safety guarantees
- HIGH: Inconsistent with majority pattern (technical debt)
- MEDIUM: Organizational/naming issues

Do NOT report individual syntax issues. Focus on structural patterns.
```

---

## Incremental Validation (Pre-Commit)

```
Load domains/<DOMAIN>/<SUBDOMAIN>/RULES.md.

Task: Validate ONLY the changes in these files:
<FILE_1>
<FILE_2>
...

For each changed file:
1. Identify which rules apply to this file type (Service/Store/Component/Schema)
2. Check ONLY the added/modified lines for violations
3. Report violations with context (3 lines before/after)

Format:
```
FILE: <path>
CHANGES: Lines <X>-<Y>
VIOLATION: <rule>
Context:
  <X-1>  <existing code>
  <X>    <violating code>  ← VIOLATION
  <X+1>  <existing code>
Fix: <corrected line>
```

If all changes comply: "✅ All changes comply with RULES.md"

This is meant for fast feedback loops. Do NOT analyze unchanged code.
```

---

## Validation with Auto-Fix

```
Load domains/<DOMAIN>/<SUBDOMAIN>/RULES.md.

Task: Validate <FILE_PATH> and automatically fix ALL violations.

Process:
1. Scan for violations
2. For each violation:
   a. Quote the violated rule
   b. Show original code
   c. Generate compliant replacement
3. Output the COMPLETE corrected file

Format final output as:
```
VIOLATIONS FIXED: <count>

1. Line <X>: <rule>
   Before: <original>
   After: <fixed>

2. Line <Y>: <rule>
   ...

---CORRECTED FILE---
<complete file content with all fixes applied>
```

Ensure:
- All fixes are minimal (change only what's necessary)
- No unrelated improvements
- Original logic preserved
- All rules now satisfied
```

---

## Cross-Domain Boundary Check

```
Load rules from MULTIPLE domains:
- domains/<DOMAIN_A>/<SUBDOMAIN>/RULES.md
- domains/<DOMAIN_B>/<SUBDOMAIN>/RULES.md

Task: Inspect <PROJECT_PATH> for cross-domain contamination.

Specifically check for:
❌ Domain A files importing from Domain B (domains should be independent)
❌ Mixed patterns (e.g., frontend rules applied in backend code)
❌ Shared utilities that violate either domain's rules

Report as:
```
BOUNDARY VIOLATION:
File: <path>
Domain: <should be A, but uses B>
Evidence: <import/pattern from wrong domain>
Impact: Breaks domain independence principle
Fix: <restructure or clarify domain boundaries>
```

This validation ensures rule sets remain portable and independent.
```

---

## Usage Examples

### Example 1: Validate React Service Layer
```
Load domains/frontend/mst_react_mui/RULES.md.
Task: Validate src/services/ScheduleService.ts.
[Use Single-File Validation Prompt]
```

### Example 2: Scan All Stores
```
Load domains/frontend/mst_react_mui/RULES.md.
Task: Scan all files matching src/stores/**/*.ts.
[Use Multi-File Validation Prompt]
```

### Example 3: Pre-Merge Check
```
Load domains/frontend/mst_react_mui/RULES.md.
Files changed in this PR:
- src/services/PipelineService.ts
- src/stores/models/Pipeline/PipelineStore.ts
[Use Incremental Validation Prompt]
```

---

## Notes

- **Scope control**: Always specify which rules file to load (full path)
- **Context matters**: For validation, AI needs to see the full file, not just snippets
- **Automation**: These prompts are designed for CI/CD integration or pre-commit hooks
- **False positives**: AI may flag valid patterns—treat output as suggestions requiring human review
- **Performance**: Multi-file validation can be slow; use glob patterns to limit scope

## Integration with AI Tools

### GitHub Copilot Chat
Paste validation prompt in chat, reference files by path.

### CLI with AI API
```bash
# Example: Validate all services
cat domains/frontend/mst_react_mui/RULES.md > /tmp/rules.txt
ls src/services/*.ts | while read f; do
  echo "Validating $f..."
  ai-cli --prompt "$(cat templates/VALIDATION_PROMPT.md section 1)" \
         --context "/tmp/rules.txt,$f"
done
```

### Pre-Commit Hook (Conceptual)
```bash
# .git/hooks/pre-commit
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.ts$')
for file in $CHANGED_FILES; do
  # Send file + RULES.md + validation prompt to AI
  # Parse output for violations
  # Block commit if violations found
done
```
