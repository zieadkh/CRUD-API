import { Router } from "express";
import { loginUser, logoutuser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutuser);
router.route('/refresh').post(refreshAccessToken);

export default router;
