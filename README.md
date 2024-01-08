<img src="docs/zync-banner.png" />

<div style="text-align: center;">

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

</div>

<hr>

# Ultimate type safety, synced all across your application.

🥇 **Winner of Junior Achievement Latvia Unlocked 2022**

Zync is the tool for perfectionists with deadlines that deals with persisting shared data troughout an application and finally fixes all your type safety insecurities.

## Running locally

**Requirements**

- Node v16
- Rust
- Docker

### Clone

    $> git clone https://github.com/Devkeystuff/zync.git

### Install dependencies

    $> yarn

### Start the project

_Make sure Docker engine is running_

    $> yarn dx

> You can also find all commands for running specific services in `package.json`

## Stack

| Service                       | What is it?                                                                                             | Port |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- | ---- |
| Frontend (Next.js + tRPC)     | <ul><li>The main client app</li><li>Hosted on Vercel</li></ul>                                          | 4200 |
| Backend (NestJS + Prisma ORM) | <ul><li>The main server app</li><li>Handles all business logic</li><li>Hosted on DigitalOcean</li></ul> | 3333 |
| CLI (Rust)                    | <ul><li>Responsible for providing the code sync</li>                                                    | -    |
| DB (Postgres)                 | <ul><li>The main database</li><li>Holds information of the entire app</li></ul>                         | 5431 |
