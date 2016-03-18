# Changelog

All notable changes to this project are documented here.

## 1.6.0 — 2016-03-18

### Added
- `bin/gojira` shell entry point. After `npm install -g gojira`, the `gojira` command is available on `PATH`.
- `package.json` `bin` field publishing the entry; `files` whitelist constrains the published tarball to `bin/`, `lib/`, `index.js`, the default config, README, CHANGELOG and LICENSE.
- `--version` and `-V` flags (wired through commander to `package.json`'s `version`).
- `index.js` is now dual-mode: `require('gojira')` returns `{ run, cli_run }`; running directly (`node index.js` or via `bin/gojira`) still executes the CLI.
- E2E tests that spawn `bin/gojira --version` and `bin/gojira --help`.

## 1.5.0 — 2016-03-14

### Added
- `lib/metrics/percentile` — linear-interpolation percentile of a numeric array.
- `lib/metrics/aggregate.summarize` — bundles `count, min, max, mean, median, p85, p95`.
- `csv_writer.summary` now includes `cycle_time_stats` (aggregate of every line's `lead_time`).
- JSON writer wraps its output as `{ summary, lines }` when `include_metrics` is true (was previously a dead config flag).

## 1.4.0 — 2016-03-07

### Added
- `lib/logger` — leveled logger (silent / error / warn / info / debug).
- `--quiet` and `--verbose` CLI flags that drive the logger level.

### Changed
- `lib/http` now logs outgoing requests via `logger.debug` (silent at the default `info` level).
- `lib/main` routes the "no issues" message through `logger.error` and streams stdout output via `process.stdout.write` (no trailing newline injection).

### Removed
- `underscore` runtime dependency. `lib/durations` uses native `Array.prototype.find` (Node 4+).
- `fs` npm shim from `dependencies` (Node ships the real `fs` module built-in).

## 1.3.0 — 2016-02-29

### Added
- CLI flags: `--config`, `--output`, `--format`, `--target` (and short forms `-c`, `-o`, `-f`, `-t`). Each overrides the corresponding `project_config.json` field for the current run.
- `story_points_field` config field (default `customfield_10003`) for Jira instances that map story points to a different custom field.
- `lib/main.js` exposing `main.run(options)` — the entry point is now testable.
- Integration test covering `main.run` option overrides.

### Changed
- `issue_line.from(issue, config)` now takes the full config object instead of just `points_per_day`. Internal API only; affects writers that compose `issue_line`.

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
