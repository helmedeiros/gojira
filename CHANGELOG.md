# Changelog

All notable changes to this project are documented here.

## 1.14.0 — 2016-05-18

### Added
- `lib/paginated.js` — generic page-walker that loops on `startAt`/`total` until the search returns everything. Both `issues_loader` and `active_loader` now fetch every page; previously the report silently truncated at `max_results`.
- `lib/concurrency.js` `map_with_limit(items, limit, mapper)` — bounded parallelism helper. The changelog fan-out used to fire one HTTP request per issue in parallel; it now respects `changelog_concurrency` (default 5).
- `issue_types` config field. Default behaviour (no field set, or `null`) still filters to `Story`. Provide an array, e.g. `["Story", "Bug", "Task"]`, to widen the report. An empty array `[]` removes the type filter entirely.
- `tls_reject_unauthorized` config field (default `true`).

### Changed
- **HTTP client now verifies TLS certificates by default.** Previously cert verification was disabled hard-coded. Set `"tls_reject_unauthorized": false` if you need to reach a Jira server with an untrusted cert chain.
- `url.issues()` accepts `start_at` (paging) and `issue_types` as additional positional arguments.

### Fixed
- Reports against projects with more than `max_results` items silently lost the tail; pagination closes the gap.
- Changelog enrichment no longer DoS-fans-out N parallel requests against Jira.

## 1.13.0 — 2016-05-13

### Added
- `include_aging_wip` config flag — when true, gojira fetches active issues via `status!=Done` and renders an aging-WIP horizontal-bar chart (one row per active item, sorted longest-aging first, coloured by current status).
- `lib/active_loader.js` — sibling of `issues_loader` for the `status!=Done` query, with optional changelog enrichment.
- `lib/charts/aging_wip.js` — horizontal-bar chart for active items.
- `lib/url.js` `issues()` accepts an optional `status_filter` so the active query can reuse the same URL builder.
- HTML writer renders the charts panel as a responsive 2-column CSS grid (single column under 720px).

### Changed
- `extract.run` now returns `{ output, issues, working_times, active_issues }` and threads `active_issues` into the writer.
- `chart_builder.build(lines, config, extras)` accepts `extras.active_issues` and `extras.now_ms` and appends `aging_wip.svg` when the active set is non-empty.
- HTML writer's `build` signature gains an optional `active_issues` argument.
- Demo seeds five active items so the live demo's aging-WIP chart is populated.

## 1.12.0 — 2016-05-04

### Added
- `include_changelog` config flag — when true, gojira fans out an `?expand=changelog` request per issue and attaches the parsed status transitions to each issue.
- `lib/changelog_url.js`, `lib/changelog_parser.js`, `lib/changelog_loader.js` — building blocks for the new fetch path.
- `transitions.for_line` now accepts a `columns` array and prefers real changelog events when every column has a matching event; falls back to the existing back-derivation otherwise.
- `chart_builder` drops the "(approximate)" suffix on the CFD title when at least one line carries real transitions.

### Changed
- `issue_line.from` copies `issue.transitions` onto the line so downstream chart code can see it.
- Demo data now seeds canned transitions; the live demo CFD now reads "Cumulative flow" (without "approximate").

## 1.11.0 — 2016-04-27

### Added
- `--charts-dir <path>` CLI flag — writes each chart (`cfd.svg`, `cycle_time_histogram.svg`, `cycle_time_scatter.svg`, `throughput_by_week.svg`, `time_in_column.svg`) as a standalone SVG into the given directory. Useful for embedding in slides, wikis or dashboards.
- `lib/chart_builder.js` — composes the chart SVG bundle from lines + config. Used by both the HTML writer and the new `--charts-dir` writer path.

### Changed
- `extract.run` now returns `{ output, issues, working_times }` instead of just the output string, so callers can reuse the fetched data without a second round trip.
- HTML writer delegates chart composition to `chart_builder`.

## 1.10.0 — 2016-04-18

### Added
- CLI flags `--project / -p`, `--from`, `--to` — override `project_key`, `from`, `to` from the config for one run.
- `main.run` now applies these overrides through the same `OVERRIDABLE` plumbing as the other CLI flags.

## 1.9.0 — 2016-04-13

### Added
- `lib/transitions.js` — back-derive per-column entry timestamps from `resolved_at` + `times_array` (assumes forward-only flow).
- `lib/charts/cfd.js` — approximate Cumulative Flow Diagram as a stacked-area SVG.
- HTML writer renders the CFD as the first chart in the panel, ahead of the other four chart types.
- `docs/metrics.md` documents the chart suite and the CFD's "approximate" caveat.

## 1.8.0 — 2016-04-08

### Added
- `lib/charts/` — pure-SVG renderers, zero JS deps at view time:
  - `histogram` — cycle-time distribution
  - `scatter` — cycle time over time (resolution date vs lead time)
  - `throughput_by_week` — items resolved per ISO week
  - `stacked_bars` — per-issue time-in-column breakdown
- `lib/charts/svg.js` — shared SVG primitives with XML escaping.
- `issue_line` captures `created_at` and `resolved_at` from Jira (`created` / `resolutiondate` fields).
- `durations.populate` exposes per-column durations as `line.times_array` (in addition to the existing CSV string).
- HTML writer embeds all four charts inside a `<section class="charts">` panel when `include_metrics` is true.
- `npm run demo` now seeds resolution dates so the demo report's charts render.

## 1.7.0 — 2016-03-28

### Added
- `lib/writers/html.js` — HTML writer that emits a full document (DOCTYPE + embedded CSS theme + table). Output is escaped against HTML injection.
- `html` registered in the writers dispatcher and `output_format` allow-list. `gojira -f html` produces a stylable report.
- Summary panel appended after the data table when `include_metrics` is set (throughput, velocity, wip, cycle-time mean/median/p85/p95).
- `npm run demo` regenerates `docs/demo/sample_report.html` from canned data.
- GitHub Pages enabled on `master:/docs` with `docs/index.md` as the landing page and `docs/_config.yml` for Jekyll. Live at https://helmedeiros.github.io/gojira/.

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
