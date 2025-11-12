# Prompt Charter CLI - Quick Reference

## Installation

```bash
# One-time use (no install)
npx prompt-charter install

# Global install
npm install -g prompt-charter
```

## Commands

```bash
prompt-charter install    # Interactive installer
prompt-charter list       # Show all rule sets
prompt-charter --help     # Show help
prompt-charter --version  # Show version
```

## What It Does

1. **Lists available domains** (frontend, backend, etc.)
2. **Guides through selection** (stack options)
3. **Downloads RULES.md** to `.prompt-charter/RULES.md`
4. **Shows usage examples**

## Example Session

```bash
$ npx prompt-charter install

🎯 Prompt Charter - Rule Set Installer

? Select a domain: frontend
? Select a stack/option: mst_react_mui

✅ Successfully downloaded RULES.md
📍 Location: .prompt-charter/RULES.md
   (311 lines)

📝 Sample Usage:

1. Code Generation:
   "Load and obey all rules in .prompt-charter/RULES.md.
   Task: Implement UserService with createUser() method."

2. Validation:
   "Load .prompt-charter/RULES.md.
   Validate src/services/UserService.ts for rule compliance."

3. Refactoring:
   "Follow .prompt-charter/RULES.md rules.
   Refactor ScheduleStore to use ScheduleService instead of direct API calls."
```

## File Structure

```
your-project/
├── .prompt-charter/
│   └── RULES.md          ← Downloaded here
├── src/
└── package.json
```

## Using with AI Tools

### GitHub Copilot Chat
```
Load .prompt-charter/RULES.md. Implement UserService.getUser(id: number).
```

### Claude / ChatGPT
```
Read .prompt-charter/RULES.md and follow all rules.
Task: Create PipelineStore with loadPipelines() action.
```

### Cursor / Windsurf
Paste RULES.md content into project context, then code normally.

## Behavior

- **Skips if exists**: Won't overwrite existing `.prompt-charter/RULES.md`
- **Only shows valid paths**: Filters out empty domains/folders
- **Validates before download**: Ensures RULES.md exists

## Links

- **Repo**: https://github.com/mpklu/ai_code_rail
- **npm**: https://www.npmjs.com/package/prompt-charter
- **Advanced Usage**: [PROMPT_INJECTION.md](https://github.com/mpklu/ai_code_rail/blob/main/templates/PROMPT_INJECTION.md)
- **Validation**: [VALIDATION_PROMPT.md](https://github.com/mpklu/ai_code_rail/blob/main/templates/VALIDATION_PROMPT.md)
