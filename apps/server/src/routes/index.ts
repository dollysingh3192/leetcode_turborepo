import express from "express";
import problem from "./problem";
import auth from "./auth";
import me from "./me";
import metrics from "./metrics";
import { metricsMiddleware } from "../metrics";

const router = express.Router();

router.use(metricsMiddleware);
router.use("/problem", problem);
router.use('/auth', auth);
router.use('/user', me);
router.use('/data', metrics);
router.get('/healthcheck', async (req, res) => {
    res.send('OK');
});

export default router;
