# sb1-mtqvnq

Guide for Claude (interactive sessions and the factory workflow).

## Stack
React + Vite + Tailwind + wagmi/viem (Bolt.new project).

## Before you change things, read
- .bolt/prompt (design rules - follow them)
- README.md

## Commands
```sh
# install
npm ci
# checks (run all before every PR)
npm run lint
npm run build
# run
npm run dev  # Vite, http://localhost:5173
```

## Factory
Issues labelled `factory` run through `.claude/factory/BLUEPRINT.md` (triage -> spec -> implement -> verify -> merge risk -> PR).
Skills: `.claude/skills/factory-triage`, `verify-with-proof`, `merge-risk`. Use them in interactive sessions too.

## Verification gotchas
<!-- Append one line per lesson learned while verifying (ports, env vars, logins, flaky selectors). -->
