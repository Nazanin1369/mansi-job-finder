# Mansi Job Finder

AI-powered job search tool built for Mansi Shah — personalized to her iOS/AI background and scored against her profile.

## Setup

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` and add your Anthropic API key:
   ```
   REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
   ```
4. `npm start` — runs locally at http://localhost:3000

## Deploy to GitHub Pages

1. Update `homepage` in `package.json` with your GitHub username:
   ```json
   "homepage": "https://YOUR-USERNAME.github.io/mansi-job-finder"
   ```
2. Push to GitHub
3. Run:
   ```
   npm run deploy
   ```
   This builds the app and pushes to the `gh-pages` branch automatically.

4. In your GitHub repo → Settings → Pages → set source to `gh-pages` branch

## How it works

- Filters: company tier, role level, domain focus
- Calls Claude Sonnet via Anthropic API with web search enabled
- Scores each opening 0–100 against Mansi's profile
- Per card: why it fits, skill gaps, application tip
- "Prep story" and "Draft outreach" buttons copy tailored prompts to clipboard

## Note on API key

The API key is used directly from the browser. This is fine for personal use — don't share the deployed URL publicly or your key could be used by others. For a shared deployment, consider proxying through a backend.
