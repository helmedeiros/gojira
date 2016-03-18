# gojira

[![Build Status](https://travis-ci.org/helmedeiros/gojira.svg?branch=master)](https://travis-ci.org/helmedeiros/gojira)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Series of tasks to extract Jira data.


## Installation

### As a global CLI

```
npm install -g gojira
```

Then anywhere with a `project_config.json`:

```
gojira
```

### From source

```
git clone git@github.com:helmedeiros/gojira.git
cd gojira
npm install
node index.js
# or:
node bin/gojira
```

### CLI flags

All optional. Each one overrides the value in <i>project_config.json</i> for that run.

```
node index.js [options]

  -c, --config <path>    Path to project_config.json (default: ./project_config.json)
  -o, --output <path>    Override output_csv_path
  -f, --format <format>  Override output_format (csv|json|markdown)
  -t, --target <target>  Override output_target (file|stdout)
  -q, --quiet            Silence logger output
  -v, --verbose          Enable debug logging (e.g. show outgoing HTTP requests)
```

Examples:
```
node index.js --config team_config.json
node index.js --format json --target stdout > issues.json
node index.js --config team_config.json --output /tmp/team.csv
```


## Project configuration

Copy the template before first run:
<pre>cp project_config.json.default project_config.json</pre>

Then edit <b>project_config.json</b> with your credentials and project settings. The file is gitignored so secrets stay local.

<br />

<b>jira_base_url</b>: Base URL of your Jira instance, e.g. <i>https://jira.example.com</i>. <i>(Required)</i>.<br />
<b>control_chart</b>: Your project control chart. You can find it on the Report Tab of the Scrum board. <i>(Required)</i>.<br />
<b>project_key</b>: Your project key in Jira (DEMO, RIS3, etc) <i>(Required)</i>.<br />
<b>component</b>: Your component <i>(Not required)</i>.<br />
<b>work_group</b>: Should be Application. You can try Infra for example <i>(Not required)</i>.<br />
<b>max_results</b>: It will default to 300 for performance reasons. You can increment/decrement if needed.<br />
<b>output_csv_path</b>: Where to save the generated CSV so you can open in excel and create all your wonderful charts.<br />
<b>points_per_day</b>: The factor to use to calculate projected lead time for stories. Default is 1.25 (meaning a pair can finish a 4-point story in a 2-week sprint).<br />
<b>first_column_to_count</b>: Defines the first column to be counted in the sum for Actual Lead Time. Default is 1, meaning the second column (i.e. skipping Backlog). If you have an intermediate stage between Backlog and In Progress (e.g. Ready for Dev), set this to 2.<br />
<b>request_timeout_ms</b>: How long to wait for a Jira HTTP response before failing. Default is 30000 (30 seconds).<br />
<b>output_format</b>: One of <i>csv</i>, <i>json</i> or <i>markdown</i>. Default is <i>csv</i>.<br />
<b>output_target</b>: One of <i>file</i> (writes to <i>output_csv_path</i>) or <i>stdout</i>. Default is <i>file</i>.<br />
<b>story_points_field</b>: Jira custom field id that holds the story-point estimate. Default is <i>customfield_10003</i>. Override if your Jira instance maps points to a different custom field.<br />

## Metrics

See [`docs/metrics.md`](docs/metrics.md) for cycle time, throughput, velocity and wip helpers, plus the `csv_writer.summary` bundler.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for module boundaries and the extract flow.

## Testing

```
npm test                  # unit + integration + e2e (mocha)
npm run lint              # eslint
npm run coverage          # istanbul + mocha
npm run coverage:check    # enforce coverage thresholds
```

See [`docs/testing.md`](docs/testing.md) for the test pyramid layout (unit / integration / e2e), stubbing conventions, and where to put new tests.
