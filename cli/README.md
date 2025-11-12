# Prompt Charter CLI

> Install curated AI coding rule sets to guide GitHub Copilot, Claude, and other AI tools

## Installation

### Global Installation (Recommended)

```bash
npm install -g prompt-charter
```

### One-Time Use (npx)

```bash
npx prompt-charter install
```

## Usage

### Interactive Installation

Install a RULES.md file to your project:

```bash
prompt-charter install
```

This will:
1. Show available domains (frontend, backend, etc.)
2. Guide you through subdomain selection
3. Download RULES.md to `.prompt-charter/RULES.md`
4. Display usage examples

**Example session:**
```
? Select a domain: frontend
? Select a stack/option: mst_react_mui
✅ Successfully downloaded RULES.md
📍 Location: .prompt-charter/RULES.md
   (311 lines)
```

### List Available Rule Sets

See all available rule sets:

```bash
prompt-charter list
```

**Output:**
```
📋 Available Rule Sets

frontend/
  └─ mst_react_mui

backend/
  (coming soon)
```

### Getting Help

```bash
prompt-charter --help
prompt-charter install --help
```

### Local Testing (Development)

For testing unpushed changes or development:

```bash
cd cli
node src/index.js list --local        # Show local rule sets
node src/index.js install --local     # Install from local filesystem
```

See [LOCAL_TESTING.md](./LOCAL_TESTING.md) for details.

## What Gets Installed

The CLI downloads a `RULES.md` file to:
```
your-project/
├── .prompt-charter/
│   └── RULES.md       ← Downloaded here
├── src/
└── package.json
```

If `.prompt-charter/RULES.md` already exists, the installer will skip with a message.

## Using the Rules

After installation, use the rules in your AI prompts:

### 1. Code Generation
```
"Load and obey all rules in .prompt-charter/RULES.md.
Task: Implement UserService with createUser() method."
```

### 2. Validation
```
"Load .prompt-charter/RULES.md.
Validate src/services/UserService.ts for rule compliance."
```

### 3. Refactoring
```
"Follow .prompt-charter/RULES.md rules.
Refactor ScheduleStore to use ScheduleService instead of direct API calls."
```

## Available Rule Sets

Currently available:
- **frontend/mst_react_mui** - React 18 + MobX-State-Tree + Material-UI + Zod architecture

More coming soon:
- Backend API patterns
- Data engineering workflows
- Security baselines
- Conversation tone guides

## Learn More

- **Advanced Patterns**: [PROMPT_INJECTION.md](https://github.com/mpklu/ai_code_rail/blob/main/templates/PROMPT_INJECTION.md)
- **Validation Guide**: [VALIDATION_PROMPT.md](https://github.com/mpklu/ai_code_rail/blob/main/templates/VALIDATION_PROMPT.md)
- **Full Repository**: [github.com/mpklu/ai_code_rail](https://github.com/mpklu/ai_code_rail)

## Requirements

- Node.js 14.0.0 or higher
- Internet connection (fetches rules from GitHub)

## Troubleshooting

### "Failed to fetch domains"

Check your internet connection. The CLI uses GitHub API to fetch rule sets.

### "RULES.md already exists"

The installer won't overwrite existing files. To update:
1. Remove `.prompt-charter/RULES.md`
2. Run `prompt-charter install` again

### GitHub API Rate Limit

Unauthenticated requests are limited to 60/hour. If you hit the limit:
- Wait an hour
- Or authenticate with a GitHub token (future feature)

## Development

### Local Testing

```bash
cd cli
npm install
npm link
prompt-charter install
```

### Repository Structure

```
cli/
├── src/
│   ├── commands/
│   │   ├── install.js    # Interactive installer
│   │   └── list.js       # List command
│   ├── utils/
│   │   └── github.js     # GitHub API wrapper
│   └── index.js          # CLI entry point
├── package.json
└── README.md
```

## License

MIT

## Contributing

See the main [ai_code_rail](https://github.com/mpklu/ai_code_rail) repository for contribution guidelines.
