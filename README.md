# gojira

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Series of tasks to extract Jira data.


## Installation

Clone the repository:
<pre>git clone git@github.com:helmedeiros/gojira.git</pre>

Install dependencies:
<pre>npm install</pre>

GoJira!:
<pre>node index.js</pre>


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

## Metrics

The `lib/metrics/` modules expose small pure functions you can call against the issues collected by gojira:

- `cycle_time.compute(working_times, first_column_to_count)` — days spent between the first counted column and the final column.
- `throughput.compute(lines)` — number of items.
- `velocity.compute(lines)` — sum of story points.
- `wip.compute(lines)` — count of items whose status is not Backlog or Done.

`csv_writer.summary(lines)` bundles throughput, velocity and wip into a single object.

## Testing

Install jasmine-node:
<pre>npm install jasmine-node -g</pre>

Run unit tests:
<pre>jasmine-node spec</pre>
