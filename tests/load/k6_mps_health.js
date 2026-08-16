import http from 'k6/http';
import { check, sleep } from 'k6';

const MPS_BASE = __ENV.MPS_BASE_URL || 'http://localhost:8000';

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
    },
    baseline: {
      executor: 'constant-vus',
      vus: 10,
      duration: '10m',
      startTime: '1m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const health = http.get(`${MPS_BASE}/health`);
  check(health, {
    'health status 200': (r) => r.status === 200,
    'health body ok': (r) => r.body && r.body.includes('ok'),
  });

  const metadata = http.get(`${MPS_BASE}/services`);
  check(metadata, {
    'services status 200 or 404': (r) => r.status === 200 || r.status === 404,
  });

  sleep(1);
}
