# Getting Started with Pearl Content QC

This tool automatically reviews marketing content against Pearl's brand guidelines, positioning, and terminology rules. It catches issues like wrong pillar assignments, Bunny framing, trademark errors, and tone misalignment before content goes live.

## What You Need Before Starting

You'll need three things installed on your Mac. If you already have any of these, skip that step.

### 1. Install Node.js

Node.js is what runs the QC tool behind the scenes.

1. Go to [nodejs.org](https://nodejs.org/)
2. Click the big green **"Download Node.js"** button
3. Open the downloaded file and follow the installer prompts
4. When it's done, you're all set — you won't need to open Node.js directly

### 2. Install Claude Code

Claude Code is the AI assistant that powers the QC review. You'll install it using **Terminal**, which is an app already on your Mac.

1. Open **Terminal** (press Cmd + Space, type "Terminal", hit Enter)
2. You'll see a window with a blinking cursor — this is where you type commands
3. Copy and paste this line, then press Enter:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
4. Wait for it to finish (you'll see your cursor come back)
5. Type `claude` and press Enter — this will open Claude Code and ask you to log in with your Anthropic account

### 3. Get the API Key

Ask Kat for the Anthropic API key. You'll need it in the setup step below.

## Setup (One-Time)

Do these steps once to get everything ready. All of these happen in Terminal.

### Step 1: Download the project

This downloads a working copy of the shared project to your computer. You and Kat are both working from the same repository — any changes either of you push will be available to the other.

Open Terminal and copy/paste these lines one at a time, pressing Enter after each:

```
git clone https://github.com/katcahill-eng/pearl-marketing-strategy.git
```

```
cd pearl-marketing-strategy/pearl-marketing/pearl-content-qc
```

```
npm install
```

The first line downloads the project. The second navigates into the QC tool folder. The third installs everything the tool needs.

### Step 2: Save your API key

You need to create a small settings file. In Terminal, copy/paste this line — but replace `YOUR_KEY_HERE` with the actual key Kat gave you:

```
echo "ANTHROPIC_API_KEY=YOUR_KEY_HERE" > .env
```

That's it for setup. You only do this once.

## How to Run a QC Check

There are two ways to use this: the easy way (Claude Code) or the direct way (running the tool yourself).

### The Easy Way: Claude Code

This is the recommended approach. Claude Code can run the tool for you and explain the results in plain English.

1. Open Terminal
2. Navigate to the project folder:
   ```
   cd pearl-marketing-strategy/pearl-marketing
   ```
3. Type `claude` and press Enter
4. Once Claude Code opens, just ask it in plain language:
   - *"Run QC on this blog draft"* (then paste your content)
   - *"QC this Google Doc: https://docs.google.com/document/d/..."*
   - *"Review this copy for brand compliance"*

Claude will run the check, show you the results, and can help you fix any issues it finds.

### The Direct Way: Run the Tool Yourself

If you want to run the tool without Claude Code:

1. Open Terminal
2. Navigate to the QC folder:
   ```
   cd pearl-marketing-strategy/pearl-marketing/pearl-content-qc
   ```
3. Run a check on a file:
   ```
   npx tsx src/cli.ts --input /path/to/your-file.md
   ```
   (Drag a file from Finder into the Terminal window to paste its path)

4. Or check a Google Doc:
   ```
   npx tsx src/cli.ts https://docs.google.com/document/d/YOUR_DOC_ID/edit
   ```

## What You Get Back

After a QC check runs, you'll see:

**A letter grade** with a summary:

| Grade | What It Means |
|-------|--------------|
| **A** | No critical or important issues — good to publish |
| **B** | Minor edits needed (1-3 important issues, nothing critical) |
| **C** | Needs a revision pass (4+ important issues) |
| **D** | Significant problems to fix (1-2 critical issues) |
| **F** | Needs a rewrite (3+ critical issues) |

**An Excel spreadsheet** (saved in the `output` folder) with:
- Every issue found, with the original copy and a suggested fix
- Color-coded by severity: red = critical, yellow = important, blue = minor

## What Gets Checked

- **Pillar accuracy** — Are features assigned to the correct SCORE pillar?
- **Product claims** — Does the copy only claim things SCORE actually does?
- **Positioning** — Is this Duck framing (empowering) or Bunny framing (fear-based)?
- **Terminology** — Is "Pearl SCORE™" formatted correctly? Pillars in the right order?
- **Tone** — Does it sound like Pearl (Sage/Genius voice) or like generic marketing?
- **Data** — Are statistics sourced and current?

## How We Share Changes

You and Kat share the same repository. Think of it like a shared Google Drive folder, but for code.

**Before you start working**, pull the latest changes so you have everything up to date:

1. Open Terminal
2. Navigate to the project:
   ```
   cd pearl-marketing-strategy
   ```
3. Pull updates:
   ```
   git pull
   ```

**After you make changes** to strategy docs or anything else, push them so Kat can see them:

```
git add -A
git commit -m "Describe what you changed"
git push
```

If you're using Claude Code, you can just ask it: *"Commit and push my changes."*

## Questions?

Ask Kat.
