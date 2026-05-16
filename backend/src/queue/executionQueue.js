const { Queue, Worker, QueueEvents } = require("bullmq");
const Redis = require("ioredis");
const { runOnce, judgeAgainstTestcases } = require("../modules/judge/judge.service");

// Redis connections for Queue, Worker, and QueueEvents
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const queueConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});
const workerConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});
const eventsConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

// Create the code execution queue
const executionQueue = new Queue("code-execution", { connection: queueConnection });

// Create QueueEvents instance for job.waitUntilFinished()
const queueEvents = new QueueEvents("code-execution", { connection: eventsConnection });

// Create and configure the worker
const worker = new Worker(
  "code-execution",
  async (job) => {
    const { type, payload } = job.data;

    if (type === "run") {
      const { language, code, input, timeLimitMs } = payload;
      return await runOnce({ language, code, input, timeLimitMs });
    }

    if (type === "submit") {
      const { language, code, testcases, timeLimitMs } = payload;
      return await judgeAgainstTestcases({ language, code, testcases, timeLimitMs });
    }

    throw new Error(`Unknown job type: ${type}`);
  },
  {
    connection: workerConnection,
    concurrency: 15, // Process max 5 jobs simultaneously
    settings: {
      lockDuration: 30000, // Lock held for 30s
      lockRenewTime: 15000, // Renew lock every 15s
    },
  }
);

// Worker event handlers for logging
worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} (${job.data.type}) completed`);
});

worker.on("failed", (job, err) => {
  console.error(
    `❌ Job ${job.id} (${job.data.type}) failed:`,
    err.message
  );
});

worker.on("error", (err) => {
  console.error("❌ Worker error:", err);
});

/**
 * Add a "run" job to the queue
 * @param {Object} payload - { language, code, input, timeLimitMs }
 * @returns {Promise} Resolves with execution output when job completes
 */
const addRunJob = async (payload) => {
  const job = await executionQueue.add(
    "run-job",
    { type: "run", payload },
    {
      attempts: 1,
      timeout: 15000, // 15s timeout at BullMQ level
      removeOnComplete: true,
      removeOnFailed: false,
    }
  );

  // Wait for job to finish and return result
  const result = await job.waitUntilFinished(queueEvents);
  return result;
};

/**
 * Add a "submit" job to the queue
 * @param {Object} payload - { language, code, testcases, timeLimitMs }
 * @returns {Promise} Resolves with verdict when job completes
 */
const addSubmitJob = async (payload) => {
  const job = await executionQueue.add(
    "submit-job",
    { type: "submit", payload },
    {
      attempts: 1,
      timeout: 15000, // 15s timeout at BullMQ level
      removeOnComplete: true,
      removeOnFailed: false,
    }
  );

  // Wait for job to finish and return result
  const result = await job.waitUntilFinished(queueEvents);
  return result;
};

/**
 * Gracefully close the queue and worker
 */
const closeQueue = async () => {
  await queueEvents.close();
  await worker.close();
  await executionQueue.close();
  await queueConnection.quit();
  await workerConnection.quit();
  await eventsConnection.quit();
};

module.exports = {
  executionQueue,
  queueEvents,
  worker,
  addRunJob,
  addSubmitJob,
  closeQueue,
  queueConnection,
  workerConnection,
  eventsConnection,
};
