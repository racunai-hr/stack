# Load test skripte (k6)

Skripte za M1.8 kapacitetni baseline. Zahtijevaju [k6](https://k6.io/docs/get-started/installation/).

## Pokretanje

```bash
# MPS health (smoke + baseline scenariji u skripti)
k6 run -e MPS_BASE_URL=http://racunai_mps:8000 tests/load/k6_mps_health.js

# Django readiness
k6 run -e DJANGO_BASE_URL=http://127.0.0.1:8000 tests/load/k6_django_ready.js

# AS4 inbound (SOAP fixture)
k6 run -e DJANGO_BASE_URL=http://127.0.0.1:8000 tests/load/k6_as4_inbound.js
```

## UBL soak (pytest, ne k6)

```bash
docker compose exec django env UBL_BENCHMARK_ITERATIONS=1000 \
  pytest ubl/tests/test_benchmark.py -m soak -v
```

Rezultati: [`../docs/fiskalizacija-2.0/procedures/load-test-results.md`](../docs/fiskalizacija-2.0/procedures/load-test-results.md)
