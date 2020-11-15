# Probot for Azure Functions

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

## Creating Handlers

In `probot-handler/create-handlers.ts`, an instance of the custom Probot is created. Here, you can add your event handlers, as you would in probot.
