import express from "express";
import auth from "../middleware/auth.js";
import { openLid, closeLid, fillStatus } from "../controllers/espController.js";

const router = express.Router();

router.get("/open", auth, openLid);
router.get("/close", auth, closeLid);
router.get("/fillstatus", auth, fillStatus);

export default router;
