import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

const DJANGO_BASE = __ENV.DJANGO_BASE_URL || 'http://localhost:8001';
const SOAP_FIXTURE = open('./fixtures/as4_inbound_submit.xml');

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
    },
    baseline: {
      executor: 'constant-vus',
      vus: 5,
      duration: '10m',
      startTime: '1m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    'http_req_duration{endpoint:inbound}': ['p(95)<2000'],
  },
};

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/soap+xml; charset=UTF-8',
    },
    tags: { endpoint: 'inbound' },
  };

  const response = http.post(
    `${DJANGO_BASE}/api/fiscal/as4/inbound/`,
    SOAP_FIXTURE,
    params,
  );

  check(response, {
    'inbound status 200 or 400': (r) => r.status === 200 || r.status === 400,
    'inbound soap response': (r) => r.body && r.body.includes('Envelope'),
  });

  sleep(0.5);
}
