# GitHub Action Demo (Training)

This repository is a training project to learn 3 local GitHub Action types:

- Composite action
- Docker action
- JavaScript action (with output)

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
│   │       ├── package-lock.json
│   │       └── dist/index.js
│   └── workflows/
│       └── ci.yml
└── README.md
```

## Workflow trigger

The workflow `.github/workflows/ci.yml` runs on:

- `push` on `main`
- `workflow_dispatch` with input `name` (default: `Gildas Tema`)

## Jobs in CI

### `hello-world-composite`

- uses local action: `./.github/actions/hello-world-composite`
- passes: `name: ${{ github.event.inputs.name || 'GitHub Actions' }}`

### `hello-world-docker`

- uses local action: `./.github/actions/hello-world-docker`
- passes: `name: ${{ github.event.inputs.name || 'Bryana' }}`

### `hello-world-js`

- depends on docker job: `needs: hello-world-docker`
- uses local action: `./.github/actions/hello-world-js`
- step id: `hello-js`
- prints output:

```yaml
${{ steps.hello-js.outputs.fullName }}
```

## Action summary

### Composite action

- input: `name`
- behavior: prints hello message in a bash step

### Docker action

- input: `name`
- runtime variable inside container: `INPUT_NAME`
- behavior: prints hello message from Docker `ENTRYPOINT`

### JavaScript action

- input: `name`
- output: `fullName`
- output is set in code with `core.setOutput('fullName', ...)`

## Build JS action after code changes

If you update `.github/actions/hello-world-js/index.js`, rebuild bundle:

```bash
cd .github/actions/hello-world-js
npm install
npm run build
```

Commit these files after build:

- `.github/actions/hello-world-js/dist/index.js`
- `.github/actions/hello-world-js/package-lock.json`

## Common issue

### `Cannot find module '@actions/core'`

Cause:

- JS dependencies are not available on the runner at runtime.

Fix:

- keep `@actions/core` in dependencies
- bundle with `@vercel/ncc` (`npm run build`)
- ensure JS action points to `dist/index.js`

## Manual run

1. Open the repository on GitHub
2. Go to **Actions**
3. Select **On Push Hello Action**
4. Click **Run workflow**
5. Optionally set input `name`