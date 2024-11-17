# Relay

Relay is a SK Butterflies project

## Installation

```bash
cd frontend

npm install

cp ./environnements/.env.frontend.template ./.env.local

# Edit the .env.local file to match your configuration

cd ../backend

./build.sh # This will build the backend on Linux

or

./build.bat # This will build the backend on Windows

cd ./build

make
```

## Running the app

Frontend:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Backend:

```bash
cd ./build/

./relay_server
```
