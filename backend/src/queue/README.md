# Code Execution Queue (BullMQ + Redis)

## Overview

This directory implements an **async job queue system** for code execution using **BullMQ** and **Redis**. Instead of synchronously executing user code (which blocks the event loop), we now:

1. Accept HTTP requests
2. Enqueue a job (instantly returns)
3. Process jobs asynchronously with concurrency control
4. Return results via `job.waitUntilFinished()` (keeps API sync-style but non-blocking)

## Why BullMQ?

- **Concurrency Control**: Process only 5 jobs simultaneously, preventing resource exhaustion
- **Job Timeout**: 15s timeout per job prevents hangs
- **Retry Logic**: Jobs can be retried on failure
- **Monitoring**: Built-in stats (waiting, active, completed, failed)
- **Persistence**: Redis persists job data, allowing recovery on restart

## Architecture

```
┌──────────┐      ┌─────────────┐      ┌──────────────────┐
│  Client  │─────►│  HTTP Req   │─────►│ Judge Controller │
└──────────┘      └─────────────┘      └──────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │  addRunJob()    │
                                     │  addSubmitJob() │
                                     └─────────────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │   BullMQ Queue   │
                                     │ (Redis backing)  │
                                     └──────────────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │  BullMQ Worker   │
                                     │ (concurrency: 5) │
                                     └──────────────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │  runOnce() or    │
                                     │  judgeAgainst... │
                                     └──────────────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │   Result stored  │
                                     │   in Redis job   │
                                     └──────────────────┘
                                              │
                                     ▼────────────────────◄────┐
                              Job completes, client receives
                              response via waitUntilFinished()
```

## Files

- **executionQueue.js** — Queue setup, worker definition, `addRunJob()`, `addSubmitJob()`
- **queueMonitor.js** — `getQueueStats()` function for monitoring

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs `bullmq` and `ioredis` (added to package.json).

### 2. Start Redis Locally

**Option A: Docker (Recommended)**
```bash
docker run -d -p 6379:6379 --name algou-redis redis:7-alpine
```

**Option B: Redis CLI (if installed)**
```bash
redis-server
```

**Option C: Windows Subsystem for Linux (WSL)**
```bash
wsl
redis-server
```

Check connection:
```bash
redis-cli ping
# Output: PONG
```

### 3. Set Environment Variable (Optional)

By default, the queue connects to `redis://localhost:6379`.

To use a different Redis server:
```bash
export REDIS_URL="redis://<host>:<port>"
```

## Job Types & Payloads

### "run" Job (POST /api/run)

**Payload:**
```javascript
{
  type: "run",
  payload: {
    language: "cpp",        // or "py"
    code: "...",            // source code
    input: "...",           // stdin
    timeLimitMs: 1000       // execution time limit
  }
}
```

**Result:**
```javascript
{
  codePath: "/path/to/file.cpp",
  output: "output text",
  rawOutput: "output text"
}
```

### "submit" Job (POST /api/submit)

**Payload:**
```javascript
{
  type: "submit",
  payload: {
    language: "cpp",
    code: "...",
    testcases: [
      { input: "1 2", output: "3" },
      { input: "5 5", output: "10" }
    ],
    timeLimitMs: 1000
  }
}
```

**Result:**
```javascript
{
  verdict: "Accepted",      // "Accepted", "Wrong Answer", "TLE", "MLE", etc.
  failedTest: 2             // (optional) which test failed
}
```

## Endpoints

### POST /api/run
Execute code once with custom input.

**Request:**
```json
{
  "language": "cpp",
  "code": "...",
  "input": "...",
  "problemId": "..."
}
```

**Response:**
```json
{
  "status": true,
  "output": "...",
  "filePath": "..."
}
```

### POST /api/submit
Judge code against all testcases.

**Request:**
```json
{
  "language": "cpp",
  "code": "...",
  "problemId": "..."
}
```

**Response:**
```json
{
  "verdict": "Accepted"
}
```

### GET /api/queue-stats
Get current queue statistics (no auth required).

**Response:**
```json
{
  "waiting": 3,
  "active": 2,
  "completed": 145,
  "failed": 1,
  "delayed": 0,
  "total": 151
}
```

## Configuration

Edit **executionQueue.js** to adjust:

```javascript
// Worker concurrency (max jobs processed simultaneously)
concurrency: 5

// Job timeout (milliseconds)
timeout: 15000

// Lock settings
lockDuration: 30000      // How long BullMQ holds the job
lockRenewTime: 15000     // Renewal interval
```

## Performance Expectations

With **concurrency: 5** and **15s timeout per job**:

- Supports ~20-30 concurrent users (depends on execution time)
- P95 latency: < 2s for typical run/submit operations
- Max throughput: ~300 jobs/min (5 concurrent × 60 jobs/job-duration)

## Monitoring & Debugging

### Check Queue Stats
```bash
curl http://localhost:3000/api/queue-stats
```

### Inspect Redis
```bash
redis-cli
> KEYS "*"                          # List all keys
> HGETALL bull:code-execution:*    # View job details
> INFO stats                        # Redis stats
```

### View Logs
Worker logs are printed to stdout:
```
✅ Job 1 (run) completed
❌ Job 2 (submit) failed: TLE
```

## Troubleshooting

### "Cannot connect to Redis"
- Ensure Redis is running: `redis-cli ping`
- Check `REDIS_URL` environment variable
- Default: `redis://localhost:6379`

### "Job timeout exceeded"
- Execution took > 15s
- Check code complexity, increase `timeout` if needed
- Increase Redis `lockDuration` if job keeps restarting

### "Worker not processing jobs"
- Check worker logs in the terminal
- Ensure `redis-connection` is correct
- Restart the backend server

## Future Enhancements

- [ ] Separate worker process (for horizontal scaling)
- [ ] Job priority levels
- [ ] WebSocket progress updates
- [ ] Dead letter queue (DLQ) for failed jobs
- [ ] Metrics export (Prometheus)
- [ ] Admin dashboard for queue management

## References

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Documentation](https://redis.io/docs/)
- [Express + BullMQ Tutorial](https://blog.logrocket.com/set-up-job-queue-node-bullmq/)
