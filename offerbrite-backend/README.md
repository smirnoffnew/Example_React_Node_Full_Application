# Offerbrite Back End

## Documentation

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/d2f1a3605c200d334d63)

[Structure definition](./docs/structure.md)

[E nv variables definition](./docs/env.md)
## Getting Started

[Download](https://console.firebase.google.com/u/0/project/test-3f15c/settings/serviceaccounts/adminsdk) firebase.service.account.json and place it to root dir


Install yarn:

```js
npm install -g yarn
```

Install dependencies:

```sh
yarn
```

Set environment (vars) according to [docs](./docs/env.md):

```sh
cp .env.example .env
```

Start server:

```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=true
```

Refer [debug](https://www.npmjs.com/package/debug) to know how to selectively turn on logs.

Tests:

```sh
# Run tests written in ES6
yarn test

# Run test along with code coverage
yarn test:coverage

# Run tests on file change
yarn test:watch

# Run tests enforcing code coverage (configured via .istanbul.yml)
yarn test:check-coverage
```

Lint:

```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch
```

## Logging

Universal logging library [winston](https://www.npmjs.com/package/winston) is used for logging. It has support for multiple transports. A transport is essentially a storage device for your logs. Each instance of a winston logger can have multiple transports configured at different levels. For example, one may want error logs to be stored in a persistent remote location (like a database), but all logs output to the console or a local file. We just log to the console for simplicity, you can configure more transports as per your requirement.

#### API logging

Logs detailed info about each api request to console during development.
![Detailed API logging](https://cloud.githubusercontent.com/assets/4172932/12563354/f0a4b558-c3cf-11e5-9d8c-66f7ca323eac.JPG)

#### Error logging

Logs stacktrace of error to console along with other details. You should ideally store all error messages persistently.
![Error logging](https://cloud.githubusercontent.com/assets/4172932/12563361/fb9ef108-c3cf-11e5-9a58-3c5c4936ae3e.JPG)

## Code Coverage

Get code coverage summary on executing `yarn test`
![Code Coverage Text Summary](https://cloud.githubusercontent.com/assets/4172932/12827832/a0531e70-cba7-11e5-9b7c-9e7f833d8f9f.JPG)

`yarn test` also generates HTML code coverage report in `coverage/` directory. Open `lcov-report/index.html` to view it.
![Code coverage HTML report](https://cloud.githubusercontent.com/assets/4172932/12625331/571a48fe-c559-11e5-8aa0-f9aacfb8c1cb.jpg)

## Docker

#### Using Docker Compose for Development

```sh
# service restarts on file change
bash bin/development.sh
```

#### Building and running without Docker Compose

```bash
# To use this option you need to make sure mongodb is listening on port 27017

# Build docker
docker-compose --build  

# Run docker
docker-copmose up 
```


Fulcrum Team
