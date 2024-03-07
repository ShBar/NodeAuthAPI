# Auth API

## About

This is a simple Authentication API built in NodeJS + TypeScript, that uses JSON Web Tokens(JWT) to authenticate the API user.

The two core endpoints are for signup and login, and two additional endpoints to fetch and update user info to demonstrate the auth protection.


## How to run

Running in Docker:
```
cd AuthAPI
```
```
MYSQL_DATABASE=db_name MYSQL_PASSWORD=mysql_root_password JWT_KEY=secret_key docker compose up
```


Tearing it all down:
```
docker compose down --rmi all
```

## Setting up the local dev environment

1. Install latest mysql docker image `docker pull mysql`.
2. Run docker locally `docker run --name some-name -e MYSQL_ROOT_PASSWORD=password -d mysql:tag`.
3. Create a database named `test`.
4. Run `npm install` to install all dependencies.
5. To run tests set `NODE_ENV=test` and run `npm test`.
6. To run with `nodemon` run `npm run local`.


Use Postman to run the [Postman Collection](./AuthAPI.postman_collection.json)