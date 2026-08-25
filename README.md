# Daily Şenol ☀️

[![Daily post workflow](https://github.com/kekecmehmet/dailysenolgunes/actions/workflows/daily-post.yml/badge.svg)](https://github.com/kekecmehmet/dailysenolgunes/actions/workflows/daily-post.yml)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An open-source X bot that publishes one sourced Şenol Güneş quote every day at 21:00 (Europe/Istanbul).

**Live account:** [@daily_senol](https://x.com/daily_senol)

## Features

- Publishes only the quote — no signature, hashtag, emoji or source URL
- Keeps every quote and its source in a local SQLite database
- Marks a quote as posted only after a successful X API response
- Cycles through the archive without repeating unposted quotes
- Runs automatically with GitHub Actions and a daily idempotency lock
- Uses safe dry-runs for ordinary code pushes
- Validates the 280-character limit and rejects duplicate entries
- Stores API credentials exclusively in GitHub Actions Secrets

## How it works

```text
GitHub Actions pre-warm (17:40 UTC)
              │
              ▼
     Select first unposted quote
              │
              ▼
       Publish through X API v2
              │
              ▼
 Mark quote as posted in SQLite
              │
              ▼
 Commit the updated database state
```

The SQLite table intentionally contains only three columns:

| Column | Purpose |
|---|---|
| `quote` | The exact text published on X |
| `source` | Public URL used to verify the quote |
| `posted` | Whether the quote has already been published |

## Tech stack

- Node.js 22+
- [`twitter-api-v2`](https://github.com/PLhery/node-twitter-api-v2)
- SQLite via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)
- GitHub Actions
- X API v2 with OAuth 1.0a user context

## Local development

```bash
git clone https://github.com/kekecmehmet/dailysenolgunes.git
cd dailysenolgunes
npm install
npm run db:init
npm test
npm run dry-run
```

`npm run dry-run` prints the next quote and its verification source without publishing anything or changing the database.

## Configuration

The application expects four environment variables for a real post:

```text
X_API_KEY
X_API_SECRET
X_ACCESS_TOKEN
X_ACCESS_SECRET
```

The X application must have **Read and Write** permission. Real posting also requires the explicit safety flag:

```bash
CONFIRM_POST=true npm start
```

For GitHub Actions, store the four credentials under **Settings → Secrets and variables → Actions**. Never commit credentials to the repository.

## Quote archive management

Add a sourced quote:

```bash
npm run db:add -- "Quote text" "https://source.example/interview"
```

Inspect and maintain the archive:

```bash
npm run db:list
npm run db:stock
npm run db:edit -- 12 "Corrected quote" "https://source.example/interview"
npm run db:remove -- 12
```

Every quote must be no longer than 280 characters and have a direct HTTPS source. Run `npm test` after changing the archive.

## Automation safety

- A scheduled run wakes before 21:00 and waits in-process for the target time; fallback runs continue through 21:30.
- A persisted daily lock allows only one successful post per Istanbul calendar day.
- Push events run tests and a dry-run; they never publish.
- Manual workflow runs default to dry-run.
- The database is updated only after X confirms a successful post.
- `.env`, private keys, credential files and SQLite temporary files are excluded by `.gitignore`.

## Disclaimer

This is an unofficial, non-commercial fan project. It is not affiliated with or endorsed by Şenol Güneş, X Corp. or any football club or organization. Quotes remain attributed to their respective speaker, and source links are retained for verification.

## License

Released under the [MIT License](LICENSE).
