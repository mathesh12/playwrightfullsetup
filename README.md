# SauceDemo Playwright TypeScript Framework

A small Playwright Test framework for learning browser automation with the public
SauceDemo demo application. It demonstrates project dependencies, global lifecycle
hooks, a custom reporter, fixtures, environment selection, two demo-user roles, and
saved browser authentication state.

The tests are generated for you to study. They are **not run automatically** by
setup or installation commands.

## 1. Framework overview

Playwright Test starts with the `setup` project. That project logs in as
`standard_user` and saves the browser's storage state. The dependent `chromium`
project loads that state for ordinary tests. The `worker-demo` project uses the
same saved state but runs its fixture examples sequentially in one worker. The
dependent `role-tests` project starts with an empty state and logs in as each
configured role itself.

Project dependencies enforce this order:

```text
global setup
      |
      v
  setup project
 /      |        \
v       v         v
chromium worker-demo role-tests
    \       |      /
     v      v     v
  global teardown
```

Global setup and teardown execute once per Playwright invocation. Project
dependencies execute inside that invocation. Teardown removes the generated
authentication-state file after all projects have finished.

## 2. Prerequisites and installation

- Node.js 18 or newer.
- npm.
- Google Chrome installed on the computer that will run the tests.
- Internet access to the public SauceDemo site when you later run tests.

From this project directory, install the declared packages:

```powershell
npm install
```

The browser projects launch the installed Google Chrome (`channel: 'chrome'`),
so a separate Playwright Chromium download is not required. TypeScript types can
be checked without running the browser tests:

```powershell
npm run typecheck
npx playwright test --list
```

`--list` prints discovered tests; it does not execute them.

## 3. Folder and file structure

```text
.
|-- config/
|   |-- auth-state.ts
|   |-- environment.ts
|   `-- users.ts
|-- fixtures/
|   |-- app-fixtures.ts
|   `-- worker-fixtures.ts
|-- reporters/
|   `-- simple-reporter.ts
|-- tests/
|   |-- auth/
|   |   `-- session.spec.ts
|   |-- cart/
|   |   `-- cart.spec.ts
|   |-- fixtures/
|   |   |-- custom-fixture.spec.ts
|   |   `-- worker-fixture.spec.ts
|   |-- roles/
|   |   `-- roles.spec.ts
|   `-- setup/
|       `-- auth.setup.ts
|-- utils/
|   `-- login.ts
|-- .env.example
|-- .gitignore
|-- global-setup.ts
|-- global-teardown.ts
|-- package.json
|-- package-lock.json
|-- playwright.config.ts
`-- tsconfig.json
```

### Purpose of every framework file

| File | Purpose |
| --- | --- |
| `playwright.config.ts` | Defines global hooks, reporters, browser settings, and the setup/dependent projects. |
| `global-setup.ts` | Validates and logs the chosen environment before the test run. |
| `global-teardown.ts` | Removes the generated authentication-state file after the run. |
| `config/environment.ts` | Loads `.env`, selects the base URL, and explains missing or invalid environment configuration with an error. |
| `config/auth-state.ts` | Defines the one path used to write, load, and remove the saved session. |
| `config/users.ts` | Keeps the public SauceDemo demo accounts separate from the test logic. |
| `utils/login.ts` | Shares the small login action used by setup and role tests. |
| `fixtures/app-fixtures.ts` | Adds a test-scoped `loggedInPage` fixture that opens the authenticated inventory. |
| `fixtures/worker-fixtures.ts` | Adds a worker-scoped label and builds on the app fixture. |
| `reporters/simple-reporter.ts` | Logs each test's start/result and a final result count using Playwright's Reporter API. |
| `tests/setup/auth.setup.ts` | Logs in and writes `storageState`; it is selected only by the `setup` project. |
| `tests/auth/session.spec.ts` | Shows an ordinary test reusing the saved session. |
| `tests/cart/cart.spec.ts` | Demonstrates a simple add-to-cart journey with user-facing assertions. |
| `tests/fixtures/custom-fixture.spec.ts` | Shows a test consuming `loggedInPage`. |
| `tests/fixtures/worker-fixture.spec.ts` | Shows two tests consuming a worker-scoped fixture in the single-worker demo project. |
| `tests/roles/roles.spec.ts` | Runs the same basic inventory check as two demo roles, each with a fresh login. |
| `.env.example` | Provides a safe local environment example and names the optional QA/staging variables. |
| `.gitignore` | Excludes dependencies, reports, local environment files, and generated auth state. |
| `package.json` | Declares dependencies and beginner-friendly npm commands. |
| `package-lock.json` | Locks the npm dependency versions for repeatable installation. |
| `tsconfig.json` | Enables strict TypeScript checking for the framework and tests. |

## 4. The nine framework topics

| Topic | Files to study |
| --- | --- |
| 1. Project dependencies and execution order | `playwright.config.ts`, `tests/setup/auth.setup.ts` |
| 2. Global setup | `global-setup.ts`, `playwright.config.ts` |
| 3. Global teardown | `global-teardown.ts`, `config/auth-state.ts`, `playwright.config.ts` |
| 4. Custom reporter | `reporters/simple-reporter.ts`, `playwright.config.ts` |
| 5. Custom test fixture | `fixtures/app-fixtures.ts`, `tests/fixtures/custom-fixture.spec.ts` |
| 6. Worker-scoped fixture | `fixtures/worker-fixtures.ts`, `tests/fixtures/worker-fixture.spec.ts`, `playwright.config.ts` |
| 7. Multiple environments | `config/environment.ts`, `.env.example`, `global-setup.ts` |
| 8. Multiple roles | `config/users.ts`, `utils/login.ts`, `tests/roles/roles.spec.ts` |
| 9. Authentication with `storageState` | `config/auth-state.ts`, `tests/setup/auth.setup.ts`, `playwright.config.ts`, `tests/auth/session.spec.ts`, `.gitignore` |

### What the fixture scopes mean

`loggedInPage` is a normal test-scoped fixture: it is prepared for a test and
cleaned up with that test's page. `workerLabel` has `scope: 'worker'`: it is
created once and reused by tests assigned to that one Playwright worker. The
`worker-demo` project runs its two examples sequentially with one worker to make
that reuse easy to observe. Another worker gets its own label and fixture
instance. Workers are not one global shared process or shared fixture.

### What the roles do (and do not) claim

The role list contains SauceDemo's public `standard_user` and `problem_user` demo
accounts. The tests check that both can reach the inventory; they do not pretend
that the site gives them different permissions. The `problem_user` account is
intentionally a demo account that can expose application quirks. Credentials are
demo data, not real-user secrets.

## 5. Running tests later

The `test` script runs all configured projects. Project dependencies are included:
the setup project runs before its dependent test projects.

```powershell
# All projects
npm test

# Only the regular Chromium tests (setup is still run first)
npm run test:chromium

# The worker-fixture examples, sequentially in one worker
npm run test:workers

# Only the role tests (setup dependency is still run first)
npm run test:roles

# A selected test title within a project
npx playwright test --project=chromium --grep "shopping cart"
npx playwright test --project=role-tests --grep "problem_user"

# Open the HTML report from the last run
npm run test:report
```

The setup file ends in `.setup.ts`; the setup project's `testMatch` selects it.
The ordinary projects select `*.spec.ts`, so setup is never run as a normal
specification. `chromium` excludes the role and worker-demo files. `worker-demo`
selects only the worker fixture example and sets one worker with sequential tests,
so both tests use the same worker fixture instance during a normal run.
`role-tests` selects only the role directory and starts with empty browser state.
These patterns prevent duplicate test execution or circular project dependencies.

The custom reporter is enabled for these commands alongside the list and HTML
reporters. It prints test start, result, and final summary lines to the terminal.

## 6. Selecting an environment

With no environment variables set, the framework uses the safe public default:
`https://www.saucedemo.com`. `.env.example` documents the local setup. Copy it to
`.env` if you want a local file; `.env` is ignored by Git.

For local or development runs, `BASE_URL` can override the default. QA and staging
do not have invented URLs: provide a URL supplied by your organization. For
example, in PowerShell:

```powershell
$env:TEST_ENV = "qa"
$env:QA_BASE_URL = "https://your-provided-qa-host"
npx playwright test --project=chromium
```

For staging, set `TEST_ENV` to `staging` and set `STAGING_BASE_URL`. If the
required URL is missing or malformed, configuration stops with a clear error
instead of silently using SauceDemo. Accepted `TEST_ENV` values are `local`,
`dev`, `qa`, and `staging`.

## 7. Authentication and saved browser state

The `setup` project logs in with the SauceDemo `standard_user` demo account and
uses Playwright's `storageState()` to save cookies and local storage to
`playwright/.auth/standard-user.json`. The `chromium` project loads that file, so
its tests start already logged in. The role project explicitly uses an empty
state and logs in as each role instead.

The file is generated at the beginning of a dependent test run and removed by
global teardown. Run a dependent project again to regenerate it. If you
intentionally want to inspect a saved state, temporarily adjust teardown while
learning, but do not commit the resulting file. `.gitignore` excludes both the
generated auth directory and the legacy root `auth.json` name. Never put real
credentials or real-user sessions into this demo framework.

## 8. Expected behavior and troubleshooting

- Each ordinary test starts at the inventory page as `standard_user`.
- Role tests create a fresh page session, log in as each configured role, and
  check that the inventory is visible.
- The cart test adds the Sauce Labs Backpack and checks that it appears in the
  cart.
- A test failure creates the configured HTML report and retains video; traces
  are collected on the first retry. No retry is configured for a local run.
- If Playwright cannot find the Chrome channel, install Google Chrome and rerun
  the command. This framework uses the local Chrome installation rather than
  downloading a separate Playwright Chromium build.
- If configuration reports that `QA_BASE_URL` or `STAGING_BASE_URL` is missing,
  provide the actual URL issued by your team; this project intentionally does
  not guess it.
- If a login fails, confirm SauceDemo is reachable and inspect the test's
  reporter output. The configured users are public demo accounts and may be
  changed by the demo site owner.
- If TypeScript reports errors, run `npm install` and `npm run typecheck` from
  the project root before investigating the code.

## 9. Beginner-friendly one-hour presentation roadmap

1. **0–5 minutes:** Explain the goal, prerequisites, and top-level file tree.
2. **5–12 minutes:** Walk through `package.json`, `tsconfig.json`, and
   `playwright.config.ts`; identify the projects and reporters.
3. **12–18 minutes:** Explain `global-setup.ts`, the setup project, and
   `global-teardown.ts` as separate lifecycle stages.
4. **18–25 minutes:** Follow `auth.setup.ts` and `auth-state.ts`; explain how
   `storageState` lets dependent browser tests reuse the login.
5. **25–33 minutes:** Read `app-fixtures.ts` and its test; contrast test-scoped
   and worker-scoped fixtures using the worker example.
6. **33–40 minutes:** Show `users.ts`, the shared login helper, and the two-role
   inventory test without making permission assumptions.
7. **40–45 minutes:** Demonstrate `environment.ts`; explain why QA/staging URLs
   must be supplied instead of guessed.
8. **45–50 minutes:** Explain the custom Reporter API callbacks and the HTML
   report.
9. **50–57 minutes:** Review the cart test, test discovery, project selection,
   and troubleshooting tips.
10. **57–60 minutes:** Recap the execution order and remind the audience not to
    commit generated authentication state.
