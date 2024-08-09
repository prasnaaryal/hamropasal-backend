import express from "express";
import {
  logUserAction,
  getAuditLogsController,
} from "../../controllers/auditLog/auditController.js";

const router = express.Router();

// Route to log a user action
router.post("/log", logUserAction);

// Route to get audit logs
router.get("/logs", getAuditLogsController);

export default router;
