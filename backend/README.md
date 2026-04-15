# Backend Project

This is a Node.js backend application that provides CRUD operations for posts, user management with database integration, and simple user authentication.

## Project Functionality

- **CRUD Operations on Posts**: Create, read, update, and delete posts.
- **User Management**: Add users to the database.
- **Simple Authentication**: Basic user authentication using bcrypt for password and email comparison with database entries.

## Tech Stack

- **Node.js**: Runtime environment.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: Database for storing users and posts.
- **Mongoose**: ODM for MongoDB.
- **bcrypt**: For password hashing and authentication.

## Project Structure

```
backend/
├── README.md
├── src/
│   ├── app.js
│   ├── index.js
│   ├── config/
│   │   ├── constants.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── post.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── post.model.js
│   │   └── user.model.js
│   └── routes/
│       ├── post.route.js
│       └── user.route.js
```

- `src/app.js`: Main application setup.
- `src/index.js`: Entry point.
- `config/`: Configuration files for constants and database.
- `controllers/`: Business logic for posts and users.
- `models/`: Database schemas for posts and users.
- `routes/`: API routes for posts and users.