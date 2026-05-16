const { executionQueue } = require("./executionQueue");

/**
 * Get current queue statistics
 * @returns {Promise<Object>} Queue stats with waiting, active, completed, failed, delayed counts
 */
const getQueueStats = async () => {
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      executionQueue.count("wait"),
      executionQueue.count("active"),
      executionQueue.count("completed"),
      executionQueue.count("failed"),
      executionQueue.count("delayed"),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  } catch (error) {
    console.error("❌ Error fetching queue stats:", error);
    return {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
      total: 0,
      error: error.message,
    };
  }
};

module.exports = { getQueueStats };
