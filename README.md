# GitHub Action Demo (Training)

This repository is a training project to learn how to build and run 3 local GitHub Actions:

- Composite action
- Docker action
- JavaScript action with output

## Project structure

```text
.
├── .github/
│   ├── actions/
│   │   ├── hello-world-composite/
│   │   │   └── action.yml
│   │   ├── hello-world-docker/
│   │   │   ├── action.yml
│   │   │   └── Dockerfile
│   │   └── hello-world-js/
│   │       ├── action.yml
│   │       ├── index.js
│   │       ├── package.json
│   │       └── dist/index.js
│   └── workflows/
│       └── ci.yml
└── README.md
```

## What each action does

### 1) Composite action

Location: `.github/actions/hello-world-composite/action.yml`

- Input: `name` (default: `World`)
- Behavior: prints `Hello, <name>!`

### 2) Docker action

Location: `.github/actions/hello-world-docker/action.yml`

- Input: `name` (default: `World`)
- Dockerfile reads GitHub input env var `INPUT_NAME`
- Behavior: prints `Hello <name>!`

### 3) JavaScript action

Location: `.github/actions/hello-world-js/action.yml`

- Input: `name` (default: `World`)
- Output: `fullName`
- Behavior:
	- prints greeting
	- sets output using `core.setOutput('fullName', ...)`

## Workflow

The workflow file `.github/workflows/ci.yml` runs 3 jobs:

- `hello-world-composite`
- `hello-world-docker`
- `hello-world-js` (depends on docker job)

In the JS job, output is consumed with:

```yaml
${{ steps.hello-js.outputs.fullName }}
```

## Run the workflow

1. Push to `main`, or
2. Go to **Actions** tab and run manually with `workflow_dispatch`

## Build step for JavaScript action

If you change `.github/actions/hello-world-js/index.js`, rebuild `dist`:

```bash
cd .github/actions/hello-world-js
npm install
npm run build
```

Then commit updated `dist/index.js` and lockfile.

## Common errors

### Error: Cannot find module '@actions/core'

Cause:

- dependencies are not bundled for the runner

Fix:

- ensure `@actions/core` is in dependencies
- build with `ncc` (`npm run build`)
- make sure action `main` points to `dist/index.js`

### Local action path error

For local actions, use:

```yaml
uses: ./.github/actions/<action-folder>
```

and keep `actions/checkout@v4` before using local paths.