import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// Custom metrics for each endpoint
const loginLatency = new Trend('login_duration', { unit: 'ms' });
const problemsListLatency = new Trend('problems_list_duration', { unit: 'ms' });
const problemDetailLatency = new Trend('problem_detail_duration', { unit: 'ms' });
const runCodeLatency = new Trend('run_code_duration', { unit: 'ms' });
const httpErrors = new Rate('http_errors');
const requestCount = new Counter('total_requests');

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    // Per-endpoint p95 and p99 thresholds
    'login_duration': ['p(95) < 2000', 'p(99) < 5000'],
    'problems_list_duration': ['p(95) < 2000', 'p(99) < 5000'],
    'problem_detail_duration': ['p(95) < 2000', 'p(99) < 5000'],
    'run_code_duration': ['p(95) < 2000', 'p(99) < 5000'],
    
    // Overall error rate threshold (5%)
    'http_errors': ['rate < 0.05'],
    
    // Built-in http metrics as backup
    'http_req_failed': ['rate < 0.05'],
    'http_req_duration': ['p(95) < 2000', 'p(99) < 5000']
  }
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = __ENV.TEST_EMAIL || 'email1@gmail.com';
const TEST_PASSWORD = __ENV.TEST_PASSWORD || 'email1';

export default function () {
  let token;
  let problemId;

  // Step 1: Login
  group('1_Login', function () {
    const res = http.post(`${BASE_URL}/login`, JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

    const isSuccess = check(res, {
      'login status is 200': (r) => r.status === 200,
      'login response has token': (r) => r.json('token') !== null
    });

    if (!isSuccess) {
      httpErrors.add(1);
    }
    loginLatency.add(res.timings.duration);
    requestCount.add(1);

    if (res.status === 200) {
      token = res.json('token');
    }
  });

  sleep(1);

  // Step 2: Get Problems List
  group('2_GetProblems', function () {
    const res = http.get(`${BASE_URL}/api/problems`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const isSuccess = check(res, {
      'problems list status is 200': (r) => r.status === 200,
      'problems list is array': (r) => Array.isArray(r.json())
    });

    if (!isSuccess) {
      httpErrors.add(1);
    }
    problemsListLatency.add(res.timings.duration);
    requestCount.add(1);

    // Extract first problem ID for next request
    if (res.status === 200) {
      const problems = res.json();
      if (problems && problems.length > 0) {
        problemId = problems[0].problemId;
      }
    }
  });

  sleep(1);

  // Step 3: Get Problem Detail
  if (problemId) {
    group('3_GetProblemDetail', function () {
      const res = http.get(`${BASE_URL}/api/problems/${problemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const isSuccess = check(res, {
        'problem detail status is 200': (r) => r.status === 200,
        'problem has testcases': (r) => r.json('testcases') !== null
      });

      if (!isSuccess) {
        httpErrors.add(1);
      }
      problemDetailLatency.add(res.timings.duration);
      requestCount.add(1);
    });

    sleep(1);

    // Step 4: Run Code
    group('4_RunCode', function () {
      const code = `#include <iostream>
using namespace std;
int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`;

      const res = http.post(`${BASE_URL}/api/run`, JSON.stringify({
        language: 'cpp',
        code: code,
        input: '',
        problemId: problemId
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const isSuccess = check(res, {
        'run status is 200': (r) => r.status === 200,
        'run response has output': (r) => r.json('output') !== null
      });

      if (!isSuccess) {
        httpErrors.add(1);
      }
      runCodeLatency.add(res.timings.duration);
      requestCount.add(1);
    });
  }

  sleep(1);
}
