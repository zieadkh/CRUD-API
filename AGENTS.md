# AGENTS.md

Node.js + Express 5 + Mongoose (MongoDB) REST API. ESM (`"type": "module"`).

## Commands

- `npm start` — run `node backend/src/index.js` (requires `.env` in repo root; `.env` sets `PORT = 4000`)
- `npm run dev` — same via nodemon
- No tests, lint, typecheck, or CI exist in this repo. Don't invent/`npm test`.

## Layout

- Root `package.json` owns everything; all code lives under `backend/src/`.
- Entry: `backend/src/index.js` → `app.js` (Express app) → routes in `backend/src/routes/` mounted at `/api/v1/users` and `/api/v1/posts`. Controllers in `controllers/`, schemas in `models/`.
- README's "Project Structure" block is stale (shows `README.md` inside `backend/`; actual README is at root).

## Gotchas (verified in code)

- `.env` lives at repo root, and `dotenv.config({ path: './.env' })` is **CWD-relative** — always run from the repo root, not from `backend/`, or env vars will be undefined.
- `MONGODB_URI` in `.env` has no database name; `DB_NAME` in `config/constants.js` is defined but never used — mongoose connects to the URI as-is (default db). Don't "fix" the URI format without checking how it's consumed.
- `index.js` catch block references `err`, but the variable is `error` — a failed startup throws a ReferenceError instead of logging. Pre-existing bug.
- `config/database.js` calls `process.exit(1)` on failure, so the `try/catch` in `index.js` will rarely see a connection error.
- `user.model.js` uses `maxLenght` (misspelled) twice — those validators silently do nothing. Real constraints are `minLength` only.
- `registerUser` sets `loggedIn: false`, but `loggedIn` is not in the user schema — it is stripped by Mongoose.
- Auth uses JWT: `loginUser` returns `accessToken` (15m) + `refreshToken` (7d), `POST /api/v1/users/refresh` rotates both (no reuse detection). Secrets/expiry come from `.env`. `logoutuser` is stateless — no token/session is cleared; clients must discard tokens. There is no auth middleware anywhere: `/api/v1/posts/*` routes are unauthenticated.
- Passwords: hashed via `pre("save")` hook; `comparePassword` is an instance method on the model. Re-saving a user re-hashes only when password is modified.
- `bcrypt` is a native module — if you change OS/arch or reinstall, run `npm rebuild bcrypt`.
- `nodemon` is listed under `dependencies` (not devDependencies) — `npm run dev` works because of it; don't move it without updating scripts.
- `.env` contains live-looking MongoDB Atlas credentials and JWT secrets; it is gitignored — never commit it or paste its values into code/docs.
- Posts API uses `PATCH /api/v1/posts/update/:id` and `DELETE /api/v1/posts/delete/:id` (action verbs in paths), not RESTful nesting.
