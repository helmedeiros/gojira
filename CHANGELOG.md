# Changelog

All notable changes to this project are documented here.

## 1.2.0 — 2016-02-22

### Added
- Mocha + Chai + Istanbul + Sinon test stack with `npm test`, `npm run coverage`, `npm run coverage:check`.
- Coverage thresholds enforced in CI: statements 90, branches 85, functions 90, lines 90 (current ~97/91/95/97).
- Unit tests for `lib/util` and `lib/http`.
- Integration tests for `control_chart_loader`, `issues_loader`, and the `extract` orchestrator (axios stubbed via Sinon).
- End-to-end test exercising the full config → load → write flow.
- `docs/testing.md` describing the test pyramid and stubbing conventions.

### Changed
- Migrated specs from jasmine-node to Mocha + Chai. `spec/jasmine/` removed.
- `lib/http.js` now passes options to `axios.get` per call instead of using `axios.create` (incompatible with axios 0.7.x).
- ESLint rule severities switched to numeric form to satisfy ESLint 1.x.
- Travis script runs lint + coverage + coverage threshold check.

### Removed
- `jasmine-node` dependency.

## 1.1.0 — 2016-02-11

### Added
- `jira_base_url` config field; URL builders now accept the base as a parameter.
- `request_timeout_ms` config field for the HTTP client.
- `include_metrics`, `output_format` (csv/json/markdown), `output_target` (file/stdout) config fields.
- JSON and Markdown writers, with a dispatcher in `lib/writers`.
- `lib/metrics/{cycle_time, throughput, velocity, wip}` helpers and a `csv_writer.summary` aggregator.
- `lib/extract.js` orchestrator returning a Promise.
- ESLint config, EditorConfig, MIT license, CONTRIBUTING guide, Travis CI config, architecture and metrics docs.

### Changed
- Replaced `request` with `axios` (centralised client with timeout and request logging).
- Loaders and `lib/util.save_to_file` now return Promises.
- Extracted modules: `lib/config`, `lib/durations`, `lib/issue_line`, `lib/auth_query`, `lib/dates_query`, `lib/over_under`, `lib/http`, `lib/control_chart_loader`, `lib/issues_loader`, `lib/csv_writer`.
- Modernised syntax to ES2015 (const/let, template literals, arrow callbacks where appropriate).

### Fixed
- Guard against divide-by-zero in `over_under.ratio`.

### Security
- `project_config.json` is now gitignored. Copy from `project_config.json.default` before first run.
