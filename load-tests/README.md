# k6 Load Testing Suite for ExecuteOJ

This directory contains load testing scripts to measure backend performance and identify bottlenecks.

## Overview

Two test profiles are provided:

- **`baseline.js`** — Gentle baseline (10 VUs, 30s) for normal operation metrics
- **`stress.js`** — Stress test (50 VUs, 60s) to find breaking points

Both scripts test the complete user flow:
1. Login → 2. Get Problems List → 3. Get Problem Detail → 4. Run Code

---


## Setup

### Backend Requirements

Before running tests, ensure:

1. **Backend is running** at `http://localhost:5000`
2. **Test user account exists** with:
   - Email: `test@test.com`
   - Password: `test123`
3. **At least one problem exists** in the database (referenced by both tests)

### Create Test User

If the test user doesn't exist, register via the frontend or API:

```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@test.com",
    "password": "test123"
  }'
```

---

## Environment Configuration

Both test scripts read credentials from environment variables. Copy `.env.example` to `.env` and update with your test credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
BASE_URL=http://localhost:5000
TEST_EMAIL=your-test-email@gmail.com
TEST_PASSWORD=your-test-password
```

Or pass environment variables directly:

```bash
# Baseline with custom credentials
k6 run -e TEST_EMAIL=test@example.com -e TEST_PASSWORD=password123 baseline.js

# Stress test with custom credentials  
k6 run -e TEST_EMAIL=test@example.com -e TEST_PASSWORD=password123 stress.js
```

**Note:** `.env` is gitignored and should never be committed. Use `.env.example` as the template.

---

## Running the Tests

### Run Baseline Test (Recommended First)

```bash
k6 run baseline.js
```

**Output:** Generates summary with p50, p95, p99 latencies and error rates.

### Run Stress Test (After Baseline)

```bash
k6 run stress.js
```

**Output:** Shows performance degradation under high load.

### Run with HTML Report Output

```bash
# Baseline
k6 run --out html=baseline-report.html baseline.js

# Stress
k6 run --out html=stress-report.html stress.js
```

Then open the HTML file in a browser to view detailed charts.

---

## Metrics Explained

### Per-Endpoint Latency Trends

| Metric | Meaning | Threshold |
|--------|---------|-----------|
| `login_duration` | Time to authenticate | p95 < 2000ms |
| `problems_list_duration` | Time to fetch all problems | p95 < 2000ms |
| `problem_detail_duration` | Time to fetch single problem with testcases | p95 < 2000ms |
| `run_code_duration` | Time to compile and run code | p95 < 2000ms |

### Percentiles

- **p50** — Median response time (50% of requests are faster)
- **p95** — 95th percentile (95% of requests are faster, 5% slower) — **[THRESHOLD: < 2000ms]**
- **p99** — 99th percentile (99% of requests are faster, 1% slower) — **[THRESHOLD: < 5000ms]**

### Rates

| Metric | Meaning | Threshold |
|--------|---------|-----------|
| `http_errors` | % of requests with failed checks | < 5% |
| `http_req_failed` | % of non-2xx HTTP responses | < 5% |

### Counters

| Metric | Meaning |
|--------|---------|
| `total_requests` | Total HTTP requests sent during test |

### RPS (Requests Per Second)

k6 prints this in the summary as part of iteration stats. It's calculated as:
```
RPS = total_requests / test_duration_seconds
```

For baseline (30s, 10 VUs, ~4 requests/iteration):
- Expected RPS ≈ (10 VUs × ~4 requests/iteration) / (time to complete 1 iteration)

---

## Test Results Template

Copy this table and fill in values from k6 output after running baseline and stress tests.

### Baseline Test (10 VUs, 30s)

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **login_duration** | | | |
| p50 (ms) | | | |
| p95 (ms) | | | |
| p99 (ms) | | | |
| **problems_list_duration** | | | |
| p50 (ms) | | | |
| p95 (ms) | | | |
| p99 (ms) | | | |
| **problem_detail_duration** | | | |
| p50 (ms) | | | |
| p95 (ms) | | | |
| p99 (ms) | | | |
| **run_code_duration** | | | |
| p50 (ms) | | | |
| p95 (ms) | | | |
| p99 (ms) | | | |
| **Error Rate** | | | |
| http_errors (%) | | | |
| http_req_failed (%) | | | |
| **Throughput** | | | |
| Total Requests | | | |
| RPS (avg) | | | |

### Stress Test (50 VUs, 60s)

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| **login_duration** | | | |
| p50 (ms) | | | |
| p95 (ms) | | | |
| p99 (ms) | | | |
| **problems_list_duration** | | | |
| p50 (ms) | | | |
| p95 (ms) | | | |
| p99 (ms) | | | |
| **problem_detail_duration** | | | |
| p50 (ms) | | | |
| p95 (ms) | | | |
| p99 (ms) | | | |
| **run_code_duration** | | | |
| p50 (ms) | | | |
| p95 (ms) | | | |
| p99 (ms) | | | |
| **Error Rate** | | | |
| http_errors (%) | | | |
| http_req_failed (%) | | | |
| **Throughput** | | | |
| Total Requests | | | |
| RPS (avg) | | | |

---

## Docker Metrics

Track Docker build optimization improvements. Use the build measurement scripts to capture metrics:

**Bash:** `./build-and-measure.sh`
**PowerShell:** `.\build-and-measure.ps1`

| Metric | Before | After |
|--------|--------|-------|
| Uncompressed image size | 608MB | 710MB (newer Alpine base) |
| Build context size | 46.28MB | 245KB |
| Build context reduction | - | 99.5% |
| Layer count | unknown | 9 |
| Build time (cached) | - | 2.94s |
| Build time (cold) | - | 49.08s |
| npm install type | npm install | npm ci --only=production |

### Image Size Note

Image size increased from 608MB to 710MB—**this is expected and not a regression**. The increase is due to:
- Newer Alpine Linux base packages with additional security patches
- Updated Node.js 18 dependencies
- **85% of image size is owned by g++ toolchain** (required for runtime code compilation)

The critical optimization is **build context size reduction: 46.28MB → 245KB (99.5% reduction)**, which dramatically speeds up Docker build times and improves CI/CD efficiency.

### Notes on Optimization:
- **npm ci vs npm install**: `npm ci` ensures deterministic installs and removes cache files automatically, reducing layer size
- **Combined RUN commands**: Reduces layer count from 8 to ~6, improving build efficiency
- **Cache cleanup**: `rm -rf /var/cache/apk/*` removes APK package cache after installation
- **HEALTHCHECK**: Monitors container health every 30s, helps orchestrators detect failures
- **Enhanced .dockerignore**: Excludes frontend/, load-tests/, keys/, git history, and build scripts—crucial for build context reduction

---

## Understanding k6 Output

Example k6 summary:

```
     data_received..................: 45 MB   1.5 MB/s
     data_sent........................: 2.3 MB  77 kB/s
     http_errors......................: 0    0%/s ✓
     http_req_duration................: avg=150ms p(95)=300ms p(99)=500ms
     http_req_failed..................: 0    0%/s
     login_duration....................: avg=145ms p(95)=280ms p(99)=450ms
     problems_list_duration............: avg=120ms p(95)=220ms p(99)=350ms
     problem_detail_duration...........: avg=180ms p(95)=350ms p(99)=600ms
     run_code_duration.................: avg=2500ms p(95)=3200ms p(99)=4100ms
     iteration_duration................: avg=5.2s  min=4.8s   max=6.1s   p(95)=6s    p(99)=6.1s
     iterations........................: 58     0.968/s
     total_requests....................: 232    3.866/s
     vus...............................: 10     min=10 max=10
     vus_max...........................: 10     min=10 max=10
```

### Key Lines to Watch

- **`http_req_failed: 0%`** ✓ No HTTP errors
- **`p(95)=300ms`** ✓ 95% of requests under 300ms (threshold: 2000ms)
- **`iteration_duration: avg=5.2s`** — Full user flow takes ~5.2 seconds on average
- **`3.866/s`** — RPS (requests per second)
- **`✓`** next to thresholds — Test passed; ✗ means test failed

---

## Workflow

### First Time Setup




login_duration:         p50=456ms,  p95=828ms,  p99=1020ms
problems_list_duration: p50=22ms,   p95=266ms,  p99=410ms
problem_detail_duration:p50=23ms,   p95=320ms,  p99=397ms
run_code_duration:      p50=1810ms, p95=3010ms, p99=3020ms
http_errors:            0%
http_req_failed:        0%
Total Requests:         200
RPS:                    6.03



## Baseline Test Results (10 VUs, 30s) — Concurrency 5

login p50=477ms, p95=812ms, p99=903ms
problems_list p50=23ms, p95=292ms, p99=327ms
problem_detail p50=22ms, p95=33ms, p99=35ms
run_code p50=1780ms, p95=2550ms, p99=2780ms
Error rate: 0%
RPS: 6.00

## Stress Test Results (50 VUs, 60s) — Concurrency 5

login p95=3120ms
problems_list p95=1050ms
problem_detail p95=1030ms
run_code p50=11010ms, p95=13970ms
Error rate: 0%
RPS: 10.72
Iterations completed: 205

## Stress Test Results (50 VUs, 60s) — Concurrency 15

login p95=3510ms
problems_list p95=2440ms
problem_detail p95=3530ms
run_code p50=7190ms, p95=12480ms
Error rate: 0%
RPS: 11.70
Iterations completed: 213

## Before BullMQ (original baseline, 10 VUs)

login p50=456ms, p95=828ms, p99=1020ms
problems_list p50=22ms, p95=266ms, p99=410ms
problem_detail p50=23ms, p95=320ms, p99=397ms
run_code p50=1810ms, p95=3010ms, p99=3020ms
RPS: 6.03

### After Optimization

1. Make your backend optimization (e.g., add caching, index DB, optimize queries)
2. Run baseline again:
   ```bash
   k6 run baseline.js
   ```
3. Record metrics in the "After" column
4. Calculate improvement: `(Before - After) / Before × 100%`
5. Run stress test to ensure improvements hold under load:
   ```bash
   k6 run stress.js
   ```

---

## Common Issues

### "Connection refused" error
- Ensure backend is running: `npm start` in backend directory
- Verify `http://localhost:5000` is accessible

### "Login failed" or "invalid credentials"
- Check test user exists
- Verify credentials in test files (currently `test@test.com` / `test123`)

### "Problems array is empty"
- Log in to frontend and create a problem via UI, or
- Create via API as admin user

### High latency on `/api/run`
- Running code on host machine takes time (especially C++ compilation)
- This is expected; watch for degradation over time

---

## Next Steps

- Use HTML reports to visualize trends: `k6 run --out html=report.html baseline.js`
- Integrate with CI/CD to run tests on each release
- Compare results across versions to detect regressions
- Identify which endpoint needs optimization most (compare p95 values)

## Current Status
- Baseline run: ✅ Complete (date: today)
- Stress test run: ⏳ Pending
- Known bottleneck: /api/run p95 = 3.01s (threshold failed) — 
  root cause: synchronous C++ compile+execute blocking the event loop
- Next step: implement BullMQ job queue for /api/run and /api/submit

## Benchmarking Findings & Decisions

- Concurrency winner: 15 (chosen for production)
- Reason: At 50 VUs, concurrency 15 reduced run_code p50 by 35% 
  (11010ms → 7190ms) and improved RPS by 9% (10.72 → 11.70)
  vs concurrency 5, while maintaining 0% error rate
- Bottleneck identified: /api/run execution is CPU-bound (C++ compilation)
  running on shared infrastructure — proposed fix is containerized 
  isolated execution workers (v2 architecture)
- Current status: Concurrency set to 15 in production

After this, README is complete and you're ready to move to Docker optimization. Go!