# Testing

gojira has a small but balanced test pyramid built on Mocha + Chai, with Sinon for stubs and Istanbul for coverage.

## Tiers

```
spec/mocha/
├── *_spec.js              # unit tests (pure modules, no I/O)
├── integration/           # integration tests (modules wired together; HTTP stubbed)
│   ├── control_chart_loader_spec.js
│   ├── issues_loader_spec.js
│   └── extract_spec.js
└── e2e/                   # end-to-end tests (full config → load → write flow)
    └── run_spec.js
spec/fixtures/             # shared JSON fixtures
```

### Unit (~65 tests)

Pure, fast. Cover the building blocks: `config`, `csv`, `url`, `auth_query`, `dates_query`, `over_under`, `durations`, `issue_line`, `csv_writer.summary`, every `metrics/*`, every `writers/*`, `util.save_to_file`, and the `http.get` wrapper. No real I/O.

### Integration (~12 tests)

`spec/mocha/integration/` covers the loaders and the extract orchestrator wired against a stubbed `axios.get`. Asserts both behaviour (return value) and contract (URL shape sent to Jira).

### End-to-end (~1 test)

`spec/mocha/e2e/run_spec.js` exercises the full pipeline from a config fixture through `extract.run` to a real file on disk, with `axios.get` stubbed at the network boundary.

## Running the gates

```
npm test                  # mocha --recursive spec/mocha
npm run lint              # eslint .
npm run coverage          # istanbul cover ... mocha
npm run coverage:check    # enforces statements 90 / branches 85 / functions 90 / lines 90
```

CI (`.travis.yml`) runs lint, coverage and the coverage check on every push against Node 4 and 5.

## Adding a test

- New pure module → add a `<module>_spec.js` at `spec/mocha/`.
- New module that talks to other modules or to Jira → add `<module>_spec.js` at `spec/mocha/integration/` and stub axios with Sinon.
- New cross-cutting flow → extend `spec/mocha/e2e/run_spec.js` (keep e2e count small).

Keep each test independent: stub in `beforeEach`, restore in `afterEach`.
