# Fullstack Project

This is a Node.js application with an Express + MongoDB REST API backend and a simple EJS-based frontend (no frameworks). The backend provides CRUD operations for posts, user management with database integration, JWT-based authentication, and an admin panel for managing users and posts. The frontend lets users register/log in and view all posts.

## Project Functionality

- **CRUD Operations on Posts**: Create, read, update, and delete posts.
- **User Management**: Register, log in, log out, and refresh tokens.
- **JWT Authentication**: Access tokens (15m) and refresh tokens (7d) signed from `.env` secrets.
- **Role-Based Access**: Users have a `role` (`user` or `admin`, default `user`). Admin status is set manually in the database — there is no public promote endpoint.
- **Admin Panel**: Admins can read, update, and delete any user info and post info through protected endpoints under `/api/v1/admin`.

## Tech Stack

- **Node.js**: Runtime environment.
- **Express.js 5**: Web framework for both the API and the frontend page server.
- **EJS**: Simple server-side templating for the frontend pages.
- **HTML / CSS / vanilla JS**: No frontend framework, no build step.
- **CORS**: Allows the frontend server (port 5000) to call the API (port 4000).
- **MongoDB**: Database for storing users and posts.
- **Mongoose**: ODM for MongoDB.
- **bcrypt**: For password hashing.
- **jsonwebtoken**: For issuing and verifying JWTs.

## Project Structure

```
intro2backend/
├── backend/
│   └── src/
│       ├── app.js
│       ├── index.js
│       ├── config/
│       │   ├── constants.js
│       │   └── database.js
│       ├── controllers/
│       │   ├── admin.controller.js
│       │   ├── post.controller.js
│       │   └── user.controller.js
│       ├── middleware/
│       │   └── auth.middleware.js
│       ├── models/
│       │   ├── post.model.js
│       │   └── user.model.js
│       └── routes/
│           ├── admin.route.js
│           ├── post.route.js
│           └── user.route.js
├── frontend/
│   ├── index.js           # Express page server (port 5000)
│   ├── package.json
│   ├── views/
│   │   ├── auth.ejs       # Combined login + signup page
│   │   └── posts.ejs      # Posts home page
│   └── public/
│       ├── style.css
│       ├── auth.js        # Login/signup logic (fetch + localStorage)
│       └── posts.js       # Fetches and renders all posts
└── package.json           # Owns all backend dependencies
```

- `backend/src/app.js`: Express app setup; mounts `/api/v1/users`, `/api/v1/posts`, and `/api/v1/admin` routers and enables CORS.
- `backend/src/index.js`: Entry point; connects to MongoDB and starts the server.
- `backend/src/config/`: Configuration files for constants and database.
- `backend/src/controllers/`: Business logic for posts, users, and admin operations.
- `backend/src/middleware/auth.middleware.js`: `verifyAccessToken` (validates Bearer JWT and loads the fresh user from DB) and `requireAdmin` (rejects non-admins with 403).
- `backend/src/models/`: Database schemas for posts and users.
- `backend/src/routes/`: API routes for posts, users, and admin.
- `frontend/index.js`: Serves the EJS pages and static assets on port 5000.
- `frontend/views/`: EJS templates for the auth (login/signup) page and the posts page.
- `frontend/public/`: Client-side CSS and plain JavaScript using `fetch`.

## API Endpoints

### Users (`/api/v1/users`)

| Method | Path        | Description                              |
| ------ | ----------- | ---------------------------------------- |
| POST   | `/register` | Register a new user (password is hashed). |
| POST   | `/login`    | Log in; returns `accessToken` + `refreshToken`. |
| POST   | `/logout`   | Stateless logout (client discards tokens). |
| POST   | `/refresh`  | Rotate both tokens using a refresh token.  |

### Posts (`/api/v1/posts`)

| Method | Path          | Description       |
| ------ | ------------- | ----------------- |
| POST   | `/create`     | Create a post.    |
| GET    | `/getPosts`   | Get all posts.    |
| PATCH  | `/update/:id` | Update a post.    |
| DELETE | `/delete/:id` | Delete a post.    |

### Admin (`/api/v1/admin`)

All admin routes require header `Authorization: Bearer <accessToken>` and a user with `role === "admin"`.

| Method | Path            | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/users`        | List all users (password excluded). |
| GET    | `/users/:id`    | Get a single user.   |
| PATCH  | `/users/:id`    | Update user info (cannot change `role` or `password`). |
| DELETE | `/users/:id`    | Delete a user.       |
| GET    | `/posts`        | List all posts.      |
| GET    | `/posts/:id`    | Get a single post.   |
| PATCH  | `/posts/:id`    | Update a post.       |
| DELETE | `/posts/:id`    | Delete a post.       |

## Frontend Pages

| Page     | URL      | Description                                                        |
| -------- | -------- | ------------------------------------------------------------------ |
| Auth     | `/`      | Combined login / signup page (toggle link switches between forms). |
| Posts    | `/posts` | Lists all posts; requires a token from login/signup.               |

Flow: log in or sign up (signup auto-logs in) → token stored in `localStorage` → redirected to `/posts` → logout clears the token and returns to `/`.

## Getting Started

1. Create a `.env` file in the **repo root** (not inside `backend/`) with:
   ```
   PORT=4000
   MONGODB_URI=<your-mongodb-uri>
   JWT_ACCESS_SECRET=<secret>
   JWT_REFRESH_SECRET=<secret>
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   ```
2. Install backend dependencies (from the repo root): `npm install`
3. Run the backend from the repo root: `npm start` (or `npm run dev`)
4. In a second terminal, install and run the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```
5. Open http://localhost:5000 in your browser.

The frontend runs on **port 5000** and the backend API on **port 4000**. Port 5000 is used because port 3000 conflicted with Docker on some machines — change `PORT` in `frontend/index.js` if needed.

### Making a User an Admin

Since there is no public promote endpoint, update the user directly in MongoDB, e.g. set `role: "admin"` on their document. After their next login, their `accessToken`/middleware-loaded user will reflect the admin role.

## Notes & Known Quirks

- Always run commands from the repo root — `dotenv.config({ path: './.env' })` is CWD-relative.
- `MONGODB_URI` has no database name; `DB_NAME` in `config/constants.js` is defined but unused.
- `index.js` catch block references `err` instead of `error` (pre-existing bug).
- `config/database.js` calls `process.exit(1)` on connection failure.
- `user.model.js` has `maxLenght` (misspelled) validators that silently do nothing.
- `registerUser` sets `loggedIn: false`, which is not in the schema and gets stripped by Mongoose.
- Public user/post routes have no auth middleware; only `/api/v1/admin` routes are protected.
- No tests, lint, typecheck, or CI exist in this repo.
