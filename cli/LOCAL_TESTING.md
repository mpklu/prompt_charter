# Local Testing Guide

## Problem

The CLI fetches rule sets from GitHub's `main` branch. If you're developing new RULES.md files locally but haven't pushed them yet, the CLI won't see them.

## Solution

Use the `--local` flag to test against your local filesystem instead of GitHub.

## Usage

### List Local Rule Sets

```bash
cd cli
node src/index.js list --local
```

**Output:**
```
📋 Available Rule Sets
(Local filesystem mode)

✔ Found 2 rule set(s)

backend/
  └─ vapor_swift

frontend/
  └─ mst_react_mui
```

### Install from Local

```bash
cd cli
cd /tmp/test-project  # Or any test directory
node /path/to/prompt_charter/cli/src/index.js install --local
```

This will:
1. Read from your local `domains/` directory
2. Show all locally available rule sets (including unpushed changes)
3. Copy RULES.md to `.prompt-charter/RULES.md`

## When to Use

### Use `--local` for:
- ✅ Testing new RULES.md files before pushing
- ✅ Development and iteration
- ✅ Verifying changes work correctly
- ✅ No internet connection

### Use without `--local` (default) for:
- ✅ Normal user workflow
- ✅ Testing published content
- ✅ Verifying what users will see
- ✅ Production usage

## Comparison

| Aspect | Default (GitHub) | `--local` Flag |
|--------|------------------|----------------|
| Source | GitHub `main` branch | Local filesystem |
| Internet | Required | Not required |
| Shows unpushed changes | ❌ No | ✅ Yes |
| Use case | Production/users | Development/testing |

## Example Workflow

### 1. Create New Rule Set

```bash
# Create new domain
mkdir -p domains/backend/vapor_swift
echo "# Vapor Swift Rules" > domains/backend/vapor_swift/RULES.md

# Add content to RULES.md
vim domains/backend/vapor_swift/RULES.md
```

### 2. Test Locally

```bash
cd cli

# See if it's detected
node src/index.js list --local

# Output shows:
# backend/
#   └─ vapor_swift  ← Your new rule set!
```

### 3. Test Installation

```bash
mkdir /tmp/test-project
cd /tmp/test-project

# Install using local filesystem
node /path/to/prompt_charter/cli/src/index.js install --local

# Select: backend > vapor_swift
# ✅ Successfully downloaded RULES.md
```

### 4. Verify

```bash
cat /tmp/test-project/.prompt-charter/RULES.md
# Should show your content
```

### 5. Push When Ready

```bash
cd /path/to/prompt_charter
git add domains/backend/
git commit -m "Add backend/vapor_swift RULES.md"
git push
```

### 6. Verify on GitHub

```bash
# Now test without --local
cd cli
node src/index.js list

# Output should now include backend
# backend/
#   └─ vapor_swift
```

## Implementation Notes

The `--local` flag:
- Uses `src/utils/local.js` instead of `src/utils/github.js`
- Reads from `../../../domains/` relative to CLI location
- Requires CLI to be run from within the repository
- No API rate limits (reads filesystem directly)

## Troubleshooting

### "Found 0 rule sets" with --local

**Problem:** CLI can't find local rule sets.

**Solution:** Ensure you're running from within the repository:
```bash
# Wrong (won't work)
cd /tmp
node /path/to/cli/src/index.js list --local

# Right (will work)
cd /path/to/prompt_charter/cli
node src/index.js list --local
```

### Local vs Remote Show Different Results

**Expected!** This means:
- You have local changes not yet pushed
- Or GitHub has changes you haven't pulled

**Verify:**
```bash
git status  # Check unpushed changes
git pull    # Get latest from GitHub
```

## For Published Package

Once published to npm, users would run:

```bash
# Normal usage (from GitHub)
npx prompt-charter install

# Local testing (for contributors)
cd prompt_charter/cli
npx . install --local
```

But typically, end users won't use `--local`. It's mainly for repository maintainers and contributors testing new content.
