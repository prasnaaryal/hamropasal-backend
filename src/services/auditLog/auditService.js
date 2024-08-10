import AuditLog from "../../models/AuditLog.js";

/**
 * Log an action to the audit trail.
 * @param {Object} logData - The data to log.
 * @param {ObjectId} logData.userId - The ID of the user performing the action.
 * @param {String} logData.action - A brief description of the action.
 * @param {String} logData.ipAddress - The IP address of the user.
 * @param {Object} [logData.additionalInfo] - Any additional information to store.
 */
export const logAction = async ({
  userId,
  action,
  ipAddress,
  additionalInfo = {},
}) => {
  const auditLog = new AuditLog({
    userId,
    action,
    ipAddress,
    additionalInfo,
  });
  await auditLog.save();
};

/**
 * Retrieve audit logs with optional filters.
 * @param {Object} [filters] - The filters to apply.
 * @param {ObjectId} [filters.userId] - Filter logs by user ID.
 * @param {Date} [filters.startDate] - Filter logs starting from this date.
 * @param {Date} [filters.endDate] - Filter logs up to this date.
 */
export const getAuditLogs = async (filters = {}) => {
  const query = {};

  if (filters.userId) {
    query.userId = filters.userId;
  }

  if (filters.startDate) {
    query.timestamp = { $gte: filters.startDate };
  }

  if (filters.endDate) {
    query.timestamp = query.timestamp || {};
    query.timestamp.$lte = filters.endDate;
  }


  console.log(query);

  return await AuditLog.find(query);
};
