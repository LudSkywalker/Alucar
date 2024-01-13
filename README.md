# Alucar

## Description

Backend development of payment system implemented for rides application using [Nest](https://github.com/nestjs/nest)

## Installation

```bash
$ npm install
```

## Config

Create a .env file which collet the env vars of the application

```ini
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_NAME=alucar
DB_USER=admin
DB_PASSWORD=password
DB_PORT=5432
DB_SCHEMA=public
WOMPI_URL=https://sandbox.wompi.co/v1
WOMPI_PUB_KEY=pub_test_1234
WOMPI_PRV_KEY=prv_test_1234
WOMPI_INTE_KEY=test_integrity_1234
```

Then run the next command for create tables and populate your db with default seed

```bash
# This command drop your db before seed, but is needed for create the db structure of tables
$ npm run db:rebuilt
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker

```bash
# create docker image
$ docker build --tag alucar-img .
# run docker pod
$ docker run -p <PORT>:<PORT> --env-file .env --name alucar -it alucar-img
```

## Test

Check always if your env vars for Wompi payment process are in sandbox mode, for prevent real transactions

```bash
# e2e tests
$ npm run test:e2e
```
