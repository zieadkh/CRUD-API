import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
} from "../controllers/admin.controller.js";
import { verifyAccessToken, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyAccessToken, requireAdmin);

router.route("/users").get(getUsers);
router.route("/users/:id").get(getUserById).patch(updateUser).delete(deleteUser);

router.route("/posts").get(getAllPosts);
router.route("/posts/:id").get(getPostById).patch(updatePostById).delete(deletePostById);

export default router;
