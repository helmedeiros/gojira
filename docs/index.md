---
title: gojira
---

# gojira

```
                            .       .
                           / `.   .' \
                   .---.  <    > <    >  .---.
                   |    \  \ - ~ ~ - /  /    |
                    ~-..-~             ~-..-~
                \~~~\.'                    `./~~~/
                 \__/                        \__/
                  /                  .-    .  \
           _._ _.-    .-~ ~-.       /       }   \/~~~/
       _.-'q  }~     /       }     {        ;    \  /
      {'__,  /      (       /      {       /      \/
       `''''='~~-.__(      /_      __\____/_______/
                   / \   =/  ~~--~~{    .Y.   }
                  {   \  +\         \  .'   /
                  |   |   {         }     /
                 |    |   |         |    |
```

Extract Jira issues and control-chart durations into CSV, JSON, Markdown or HTML reports.

[Source on GitHub](https://github.com/helmedeiros/gojira)

## Demo

[Sample HTML report](demo/sample_report.html) — generated from canned data via `npm run demo`. It uses the same writer that gojira ships with `--format html`.

## Documentation

- [Architecture](architecture.md) — module layout and the extract flow
- [Metrics](metrics.md) — `cycle_time`, `throughput`, `velocity`, `wip`, `percentile`, `aggregate`
- [Testing](testing.md) — unit / integration / e2e pyramid and how to run the gates

## Install

```
npm install -g gojira
gojira --help
```

Or build from source:

```
git clone git@github.com:helmedeiros/gojira.git
cd gojira && npm install
node bin/gojira --help
```
