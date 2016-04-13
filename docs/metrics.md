# Metrics

gojira ships a small set of pure functions under `lib/metrics/` that you can call against issue lines.

## cycle_time

```
cycle_time.compute(working_times, first_column_to_count) => days
```

Sums the durations spent between the first counted column and the final column. Use it to look at how long an item spent actively in flight.

## throughput

```
throughput.compute(lines) => count
```

Returns the number of items that reached the resolved set during the configured date range.

## velocity

```
velocity.compute(lines) => points
```

Returns the sum of story points across the lines. Items without a `points` field count as zero.

## wip

```
wip.compute(lines) => count
```

Returns the number of items whose status is neither `Backlog` nor `Done`.

## percentile

```
percentile.compute(values, p) => number
```

Returns the percentile of a numeric array using linear interpolation. `p` is a fraction in `[0, 1]`. Edge cases: empty/null input → `0`; `p<=0` → min; `p>=1` → max.

## aggregate

```
aggregate.summarize(values) => { count, min, max, mean, median, p85, p95 }
```

Wraps the common descriptive statistics in one call. Empty/null input returns the same shape filled with zeros.

## Summary helper

`csv_writer.summary(lines)` bundles `throughput`, `velocity`, `wip` and `cycle_time_stats` (the `aggregate.summarize` of every `lead_time` on the lines) into one object — handy when wiring metrics to a dashboard.

When the config flag `include_metrics` is `true`, the JSON writer wraps its output as `{ summary, lines }` instead of a bare array, so a single Jira-extract gives you both the raw records and the aggregated picture.

## Charts (HTML writer)

When `include_metrics` is true and the writer is `html`, the report appends a `<section class="charts">` panel with five inline SVG charts (zero JavaScript at view time):

| Chart | Data | What it shows |
|---|---|---|
| Cumulative flow (approximate) | resolved_at + times_array | Stacked bands per column over time — items in each status as the work flows |
| Cycle time distribution | lead_time | Histogram of lead times across resolved issues |
| Cycle time over time | resolved_at + lead_time | Scatter plot — outliers and drift in cycle time |
| Throughput per ISO week | resolved_at | Bar chart of items resolved per ISO week |
| Time in each column | times_array | Per-issue stacked bar — where each item spent its time |

The CFD is **approximate**: it back-derives entry timestamps for each column from `resolved_at` minus the durations in `times_array`. It assumes items moved forward through columns without backwards transitions. A "real" CFD requires Jira's full changelog, which gojira does not currently fetch.
