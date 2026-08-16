# Stage hosts only. Never add production racunai.hr / www / admin / app / mps.
# as4-test stays on HEL1 (Domibus) and is not a WSL stage host.
STAGE_DNS_ALLOWLIST="stage.racunai.hr www-stage.racunai.hr admin-stage.racunai.hr app-stage.racunai.hr mps-stage.racunai.hr otp-sbx-stage.racunai.hr demo-stage.racunai.hr finestar-stage.racunai.hr"
PRODUCTION_DNS_ALLOWLIST="racunai.hr www.racunai.hr admin.racunai.hr app.racunai.hr mps.racunai.hr"

die() {
  echo "$*" >&2
  exit 1
}

assert_allowlist() {
  local mode="$1"
  local name="$2"
  local allowed=""
  case "$mode" in
    stage) allowed="$STAGE_DNS_ALLOWLIST" ;;
    production) allowed="$PRODUCTION_DNS_ALLOWLIST" ;;
    *) die "Unknown mode: $mode" ;;
  esac
  local item
  for item in $allowed; do
    if [[ "$item" == "$name" ]]; then
      return 0
    fi
  done
  die "Hostname '$name' is not on the $mode allowlist"
}

assert_stage_suffix() {
  local name="$1"
  if [[ "$name" != *-stage.racunai.hr && "$name" != stage.racunai.hr ]]; then
    die "Hostname '$name' is not a -stage.racunai.hr host"
  fi
}
