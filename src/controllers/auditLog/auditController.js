import { logAction, getAuditLogs } from "../../services/auditLog/auditService.js";

/**
 * Log a user action.
 */
export const logUserAction = async (req, res) => {
  try {
    const { action, additionalInfo } = req.body;
    const userId = req.user._id; // Assuming req.user is set by your auth middleware
    const ipAddress = req.ip;

    await logAction({ userId, action, ipAddress, additionalInfo });

    res.status(201).json({ message: "Action logged successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get audit logs with filters.
 */
export const getAuditLogsController = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const filters = {
      userId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    const logs = await getAuditLogs(filters);

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
