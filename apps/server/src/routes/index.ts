import express from "express";
import problem from "./problem";
import auth from "./auth";
import me from "./me";

const router = express.Router();

router.use("/problem", problem);
router.use('/auth', auth);
router.use('/user', me);

export default router;
