# k6 Load Testing Suite for ExecuteOJ

Performance benchmarking and load testing suite to measure backend performance, identify bottlenecks, and validate infrastructure optimizations.

---

## Quick Start

### Prerequisites

1. **Backend running** at `http://localhost:5000`
2. **k6 installed** — [Download here](https://k6.io/docs/getting-started/installation/)
3. **Test user account** — Email: `test@test.com`, Password: `test123`
4. **At least one problem** in the database

### Setup

Create `.env` from template:
```bash
cp .env.example .env
```

Configure environment variables:
```env
BASE_URL=http://localhost:port
TEST_EMAIL=test@test.com
TEST_PASSWORD=test123
```

### Run Tests

```bash
# Baseline test (10 VUs, 30s)
k6 run baseline.js

# Stress test (50 VUs, 60s)
k6 run stress.js

# Generate HTML report
k6 run --out html=report.html baseline.js
```

---

## Test Scenarios

| Test | VUs | Duration | Purpose |
|------|-----|----------|---------|
| **Baseline** | 10 | 30s | Normal operating conditions |
| **Stress** | 50 | 60s | Find breaking points under load |

Both test the complete user flow: Login → Get Problems List → Get Problem Detail → Run Code

---

## Performance Results

### Baseline (10 VUs, 30s)

| Endpoint | p50 | p95 | p99 |
|----------|-----|-----|-----|
| **Before BullMQ** | | | |
| Login | 456ms | 828ms | 1020ms |
| Problems List | 22ms | 266ms | 410ms |
| Problem Detail | 23ms | 320ms | 397ms |
| Run Code | 1810ms | 3010ms | 3020ms |
| **After BullMQ (Concurrency 5)** | | | |
| Login | 477ms | 812ms | 903ms |
| Problems List | 23ms | 292ms | 327ms |
| Problem Detail | 22ms | 33ms | 35ms |
| Run Code | 1780ms | 2550ms | 2780ms |

**Key Findings:**
- Login latency stable (~1% variance)
- Problem detail improved 90% (p95: 320ms → 33ms)
- Run code p95 improved 15% (3010ms → 2550ms)
- Error rate: 0%, RPS: 6.00

### Stress Test (50 VUs, 60s)

| Endpoint | Concurrency 5 | Concurrency 15 | Improvement |
|----------|---------------|----------------|-------------|
| **Login p95** | 3120ms | 3510ms | — |
| **Problems List p95** | 1050ms | 2440ms | — |
| **Problem Detail p95** | 1030ms | 3530ms | — |
| **Run Code p50** | 11010ms | 7190ms | **35% ↓** |
| **Run Code p95** | 13970ms | 12480ms | **11% ↓** |
| **RPS** | 10.72 | 11.70 | **+9%** |
| **Error Rate** | 0% | 0% | ✓ |
| **Iterations** | 205 | 213 | +4 |

**Key Findings:**
- Concurrency 15 chosen for production
- Run code p50 latency improved 35% (11010ms → 7190ms)
- Throughput improved 9% while maintaining zero error rate
- Bottleneck: CPU-bound C++ compilation on shared infrastructure

---

## Docker Metrics

| Metric | Before | After | Notes |
|--------|--------|-------|-------|
| Build Context | 46.28MB | 245KB | 99.5% reduction |
| Build Time (Cold) | — | 49.08s | One-time build |
| Build Time (Cached) | — | 2.94s | Subsequent builds |
| Layer Count | — | 9 | Optimized multistage |
| Image Size (Local) | 608MB | 710MB | Not a regression |
| Image Size (CI/CD) | — | 426MB | Production optimized |

**Notes:**
- Image size increase due to newer Alpine base and security patches
- 85% of image size is g++ toolchain (required for runtime C++ execution)
- Critical win: Build context reduction dramatically improves CI/CD speed
- Optimizations: `npm ci` for deterministic installs, combined RUN commands, APK cache cleanup

---

## CI/CD Metrics

| Metric | Value |
|--------|-------|
| Pipeline Duration | 76s |
| Health Check Sleep | 15s |
| Platform | GitHub Actions + AWS ECR + EC2 |

---

## Architecture Decisions

### Concurrency Choice: 15 (Production)

**Rationale:**
- Reduced run_code p50 by 35% at 50 VUs load (11010ms → 7190ms)
- Improved RPS by 9% (10.72 → 11.70)
- Maintained 0% error rate under stress
- Chose over concurrency 5 to maximize throughput

### Identified Bottleneck

**Problem:** `/api/run` endpoint shows high latency under load
- **Root cause:** CPU-bound C++ compilation running on shared infrastructure
- **Current impact:** p95 up to 13.97s under stress (concurrency 5)
- **Proposed v2 fix:** Containerized isolated execution workers

---

## Metrics Glossary

| Metric | Definition |
|--------|-----------|
| **p50 (Median)** | 50% of requests complete faster than this time |
| **p95 (95th %ile)** | 95% of requests complete faster; 5% slower — **target < 2000ms** |
| **p99 (99th %ile)** | 99% of requests complete faster; 1% slower — **target < 5000ms** |
| **RPS** | Requests per second; calculated as total_requests ÷ test_duration_seconds |
| **VU** | Virtual User; concurrent simulated client |
| **Error Rate** | % of requests with failed checks or non-2xx HTTP responses — **target < 5%** |

---

## Common Issues

| Issue | Solution |
|-------|----------|
| "Connection refused" | Ensure backend running (`npm start` in backend/) and accessible at `http://localhost:5000` |
| "Login failed" or "invalid credentials" | Verify test user exists with `test@test.com` / `test123` |
| "Problems array is empty" | Create a problem via frontend UI or via API as admin user |
| High latency on `/api/run` | Expected for local execution (C++ compilation); monitor for degradation over time |