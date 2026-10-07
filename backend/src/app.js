import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import adminRouter from './routes/admin.route.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/admin", adminRouter);

//example route: http://localhost:4000/api/v1/users/register

export default app;