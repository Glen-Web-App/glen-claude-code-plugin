# glen — Claude Code plugin

Shared team memory for coding agents. Glen automatically recalls relevant context at
the start of every turn and captures what you build, so your whole team's agents share
the same institutional knowledge.

## What it does

When you submit a prompt in Claude Code, the glen plugin fires two hooks:

- **SessionStart** — announces the session to glen and injects any incognito/org
  status as a system message.
- **UserPromptSubmit** — sends the prompt (plus the prior assistant turn and workspace
  context: repo, branch, agent name) to your glen org, retrieves matching memories, and
  injects them as additional context for the model.

Nothing is sent while incognito mode is on (`glen incognito on`). Glen never reads your
filesystem directly — only what you send via prompts and assistant turns.

## Skills

The plugin ships three skills the agent invokes on demand:

- **search** — search the team's shared glen memory for a specific fact,
  decision, or past discussion.
- **controls** — go off the record (incognito) or switch which
  organization's memory is active, only when you explicitly ask.
- **setup** — set up, fix, or update glen on this machine. If glen is ever
  broken (not connected, no org selected, hooks missing), just ask the agent to
  "set up glen" and it repairs whatever `glen doctor` reports.

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

On every `UserPromptSubmit` hook, glen sends to your glen org:

- The current user prompt
- The prior assistant turn (for continuity)
- Workspace metadata: repo name, branch, commit hash, remote URL
- Agent name (`claude-code`) and session details

**Nothing is sent while incognito is on.** Recall still works — glen fetches relevant
memories but writes nothing back. Toggle with `glen incognito on` / `glen incognito off`.

Glen never sends data to any third party. All memory is stored in your org's private
glen instance.

## Updating

The plugin auto-updates via the Claude Code marketplace `autoUpdate` mechanism once
enabled. To update manually:

```sh
claude plugin update glen@glen
```

The glen CLI itself checks for updates daily in the background and upgrades
automatically when installed via npm global. To update everything manually:

```sh
glen update
```

`glen update` updates the CLI **and** any installed glen plugins in one go.

## Troubleshooting

**Check session status (statusline, org, incognito):**

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
