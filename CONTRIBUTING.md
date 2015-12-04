# Contributing

Thanks for your interest in improving gojira.

## Getting started

```
git clone git@github.com:helmedeiros/gojira.git
cd gojira
npm install
cp project_config.json.default project_config.json
```

Edit `project_config.json` with your Jira details (the file is gitignored).

## Tests

Run the test suite before opening a pull request:

```
npm test
```

## Lint

```
npm run lint
```

## Pull requests

- Keep commits small and focused on a single change.
- Each commit must leave the test suite green.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for the subject line.
