import http from 'k6/http';
import { check, sleep } from 'k6';

const DJANGO_BASE = __ENV.DJANGO_BASE_URL || 'http://localhost:8001';

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const response = http.get(`${DJANGO_BASE}/api/ready/`);
  check(response, {
    'ready status 200': (r) => r.status === 200,
    'ready payload': (r) => {
      try {
        const body = r.json();
        return body.status === 'ready' && body.checks.database === 'ok';
      } catch (_) {
        return false;
      }
    },
  });
  sleep(1);
}
