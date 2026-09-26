# glen — Claude Code plugin

Shared team memory for coding agents. Glen automatically recalls relevant context at
the start of every turn and captures what you build, so your whole team's agents share
the same institutional knowledge.

## What it does

The glen plugin registers these hooks, each a one-line `glen` CLI call:

- **SessionStart** (`glen session-start`) — injects glen's status (org, mode) as
  context, shows a notice when glen is off, incognito, or silent, and runs
  `glen doctor --auto` in the background.
- **UserPromptSubmit** (`glen ingest`) — sends the prompt (plus the prior assistant
  turn and workspace context: repo, branch, agent name) to your glen org, retrieves
  matching memories, and injects them as additional context for the model.
- **Stop** (`glen ingest`) — records the finished turn.
- **PostToolUse** on Bash (`glen pr-link`) — after a `git commit`, links the commit
  to the session in glen; when a command prints a GitHub PR URL, adds its Glen review link.

`glen off` injects and records nothing. In incognito (`glen incognito`) recall still
works but nothing is recorded to team memory. Glen reads only the hook input, the
agent's session transcript, and git metadata for the current repo.

## Skills

The plugin ships skills the agent invokes on demand:

- **search** — search the team's shared glen memory for a specific fact,
  decision, or past discussion.
- **code-search** — trace a piece of code to the agent conversations that produced it.
- **forget** — correct glen's memory by forgetting wrong or outdated evidence.
- **controls** — turn glen on/off, go off the record (incognito), go silent,
  toggle skill suggestions, or switch which organization's memory is active —
  only when you explicitly ask.
- **setup** — set up, fix, or update glen on this machine. If glen is ever
  broken (not connected, no org selected, hooks missing), just ask the agent to
  "set up glen" and it repairs whatever `glen doctor` reports.
- **create-skill** / **use-skill** — save a workflow as a skill, or find and run
  one from the Glen skill library.
- **create-artifact** / **use-artifact** — save a document to your Glen artifact
  library, or open one from it.
- **import-transcripts** — import old local agent sessions into glen memory.
- **invite** — invite a teammate to your glen organization.
- **feedback** — send a bug report or product feedback to the Glen team.
- **session-takeover** — open a shared transcript from a Glen takeover code in a
  fresh session.

## Install

**Preferred (one command):**

```sh
glen install
```

**Manual:**

```sh
claude plugin marketplace add Glen-Web-App/glen-claude-code-plugin
claude plugin install glen@glen
```

## Requirements

1. Install the glen CLI:

   ```sh
   npm install -g @tryglen/cli
   ```

2. Log in and connect to your org:

   ```sh
   glen login
   ```

   After login your active organization is saved locally. Switch orgs at any time with
   `glen org switch`.

## What data is sent

On every `UserPromptSubmit` and `Stop` hook, glen sends to your glen org:

- The current user prompt
- The prior assistant turn (for continuity)
- Workspace metadata: repo name, branch, commit hash, remote URL
- Agent name (`claude-code`) and session details

**Nothing is recorded while incognito is on.** Recall still works — glen fetches
relevant memories but writes nothing to team memory. Admin analytics still count your
prompts as numbers only. Toggle with `glen incognito` / `glen on`. `glen off` injects
and records nothing.

Glen never sends data to any third party. All memory is stored in your org's private
glen instance.

## Updating

The plugin auto-updates via the Claude Code marketplace `autoUpdate` mechanism once
enabled. To update manually:

```sh
claude plugin update glen@glen
```

The glen CLI itself checks for updates hourly in the background and upgrades
automatically when installed via npm global. To update everything manually:

```sh
glen update
```

`glen update` updates the CLI **and** any installed glen plugins in one go.

## Troubleshooting

**Check session status (statusline, org, mode):**

```sh
glen statusline
glen status
```

**Full diagnostics:**

```sh
glen doctor
```

**Broken setup?** Ask the agent to "set up glen" — the bundled setup skill
runs `glen doctor` and fixes whatever it reports.

**Stale update lock** (if `glen update` hangs): remove the lock file and retry:

```sh
rm -rf ~/.glen/update.lock
glen update
```

**No active organization error:** run `glen org switch` to select an org, or
`glen org list` to see your memberships. If the list itself fails with an auth error,
run `glen login` to reconnect.

---

> **Note:** This repository is generated from the
> [glen monorepo](https://github.com/Glen-Web-App/glen) (`packages/claude-plugin`).
> Please open pull requests and issues there, not here.
