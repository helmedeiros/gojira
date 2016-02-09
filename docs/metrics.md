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

## Summary helper

`csv_writer.summary(lines)` bundles throughput, velocity and wip into a single object — handy when wiring metrics to a dashboard.
