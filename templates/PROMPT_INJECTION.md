# Prompt Injection Guide

This guidelines uses [this React Frontend Architecture rules](../frontend/mst_react_mui/RULES.md) as example.

## Objective
Enforce architectural and process rules by injecting curated rule files (e.g., RULES.md) into AI assist sessions (Copilot, Claude, ChatGPT, etc.).

## Core Principle
ALWAYS load rules first, THEN give the task. NEVER ask AI to “be creative” or “suggest alternatives” unless explicitly allowed.

---

## 1. Minimal Prompt (Single Task)
"""
Read RULES.md and follow ALL ✅ REQUIRED / ❌ FORBIDDEN rules.
Task: Implement ScheduleService method: getSchedulePipelines(scheduleId: number).
Return only the TypeScript code. No commentary.
"""

## 2. Multi-File Change Prompt
"""
Load and obey rules from:
- RULES.md
Goal: Add UserService + UserStore with Zod schema (UserSchema) and converters.
Constraints:
- Service: validate responses, use errorService
- Store: MST flow actions, isLoading/error patterns
Deliverables:
1. user.ts (schema)
2. user.converters.ts
3. UserService.ts
4. UserModel.ts
5. UserStore.ts
Return code blocks with filepath comments. No extra text.
"""

## 3. Refactor Prompt
"""
Follow RULES.md rules.
Refactor ScheduleStore to remove direct apiClient usage and delegate to ScheduleService.
Preserve behavior; add errorService handling.
Output only changed regions.
"""

## 4. Copilot Inline Template
Place at top of file before coding:
```ts
/* AI RULES:
Load RULES.md. Follow ALL ✅ / ❌ directives.
Layer: Service.
Entity: Pipeline.
Task: add retryPipeline(pipelineId: number).
Validate response with PipelineSchema. Use errorService.handleServiceError.
*/
```

## 5. Pull Request Description Template
"""
AI Assistance Summary:
Rules applied: RULES.md
Scope: Add TaskTypeStore + integration.
Validation: Zod-only types, no raw interfaces.
Error Handling: service + store pattern enforced.
Request: Review adherence, not stylistic variance.
"""

## 6. Chat Session Bootstrap
First message:
"""
You must load and follow all rules in RULES.md. Acknowledge only: 'Rules loaded.' Then wait for my task.
"""

## 7. Forbidden Prompt Patterns
❌ “Feel free to improve architecture”  
❌ “Suggest alternative stack”  
❌ “Ignore rules for speed”  
❌ “Rewrite with different patterns”

## 8. Allowed Flexibility (When Explicit)
✅ “Extend ScheduleService with optional caching (still follow rules)”  
✅ “Propose indexing improvements without breaking data flow constraints”

## 9. Rule Enforcement Checklist (Pre-Prompt)
- [ ] RULES.md available?
- [ ] Domain identified?
- [ ] Scope narrow and explicit?
- [ ] Output format constrained?
- [ ] Creativity explicitly allowed? (If not, default to strict)

## 10. Output Formatting Rules To Instruct AI
"""
Format:
- Use 4 backticks for code blocks: ````ts
- Include // filepath: comments at top
- No explanatory prose
- No test stubs unless requested
"""

## 11. Failure Recovery Prompt
If output violates rules:
"""
Your previous output violated RULES.md (examples: missing validation / direct apiClient calls).
Re-read and regenerate ONLY corrected code blocks.
"""

## 12. Batch Generation Strategy
For large features:
1. Request schema & converters first.
2. Then service.
3. Then model + store.
4. Then component shell.
5. Then integration adjustments.
(Each step re-injects rule reminder.)

## 13. Version Pinning
Always specify rule version if versioned:
“Use RULES.md v1.0.3 exactly.”

## 14. Log Pattern (Optional)
Maintain a /logs/ai/SESSION.md summarizing:
- Timestamp
- Task
- Rule version
- Deviations fixed

## 15. Escalation Clause
If AI cannot comply twice:
"""
Stop generation. Provide a diff of what conflicted with rules for manual intervention.
"""

---

## Quick Copy Single-Line Variant
"Load RULES.md. Enforce all ✅/❌ rules. Task: <YOUR TASK>. Output: code only."

## Reference Rule Source
Primary rules: ./RULES.md
