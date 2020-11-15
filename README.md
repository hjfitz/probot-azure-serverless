# elanco-techops-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

## Setup For Local Dev

* Install dependencies:
```sh
~ $ yarn
```

* Set up .env. Copy `.env.example` to `.env`. There are instructions in `.env.example` on getting most of the keys

* Go to smee.io, get your URL and start your session
```sh
~ $ smee -u $YOUR_URL
```

* Start development
```sh
~ $ yarn dev
```

# Module API

Each event has a `name` and an `action`. 

Under `lib/`, create a folder for the `name` and a sub-folder for the `action` if they do not exist. 

For example, there exists repository/created/naming.js. On a `repository` event, with a `created` action, naming.js will be run.

You can check the events and actions in [app settings](https://github.com/organizations/elanco/settings/apps/elanco-bot/advanced). Events are in the header as `X-GitHub-Event` and the action is in the payload body in the top-level key `action`.

All modules are put in a queue and run in alphabetical order, with a 100ms gap between them. This is to ensure that modules can check the effects of the previous module.

Add your module to that sub-dir folder with a relevant name. That module should expose a default function that takes parameters `context` and `app`.

Parameters:
**context:** The context object passed from probot.
**app:** The app object at the root of probot