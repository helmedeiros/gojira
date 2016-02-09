# Architecture

gojira is a small Node.js library composed of focused single-purpose modules.

## Entry point

`index.js` is a thin shell that:

1. Loads the project configuration through `lib/config.js`.
2. Configures the HTTP client (`lib/http.js`) with the requested timeout.
3. Runs the extraction orchestrator (`lib/extract.js`).
4. Writes the result to file or stdout.

## Modules

```
lib/
├── auth_query.js              # username/password query string
├── config.js                  # JSON config load + validation + defaults
├── control_chart_loader.js    # GET control-chart durations
├── csv.js                     # CSV header and row builders
├── csv_writer.js              # compose CSV from issues + working times
├── dates_query.js             # date range query string
├── durations.js               # map control-chart durations onto a line
├── extract.js                 # orchestrate loaders and writer dispatch
├── http.js                    # axios wrapper (timeout, logging interceptor)
├── issue_line.js              # Jira issue → flat line
├── issues_loader.js           # GET resolved issues
├── over_under.js              # diff and ratio helpers
├── url.js                     # Jira REST URL builders
├── util.js                    # filesystem save (Promise)
├── metrics/                   # cycle_time, throughput, velocity, wip
└── writers/                   # format dispatcher + csv/json/markdown
```

## Data flow

```
config → [control_chart_loader, issues_loader] → durations + issues
                                          → writers.for_format(config.output_format).build(...)
                                          → util.save_to_file OR stdout
```

Each loader returns a Promise; `extract.run` waits for both before dispatching to the selected writer.
