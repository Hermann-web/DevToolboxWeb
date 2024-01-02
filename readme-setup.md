
## Introduction
This repo is a fork of the repo [YourAverageTechBro/DevToolboxWeb](https://github.com/YourAverageTechBro/DevToolboxWeb/), the codebase of a nextjs app available [online](devtoolbox-rho.vercel.app) that propose some processing tool you use may need often as a developer.
THey used [cleck] to handle authentication and [prisma] for the db integration.

**my added value**
Then i've added a backend integration to add some functionnalities through a python api.
I've used fastapi for the backend and integrate it to the frontend in the file [next.config.js](./next.config.js), thanks to the work of [Diego Valdez](https://github.com/digitros/nextjs-fastapi).

This tuto shows how to setup and run the app localy along with the backend of course.

## prerequistes
- docker, docker-compose (they are ways around it)
- python (>3.7, 3.11 preferably)
- node (20 preferably)

## db setup with [prisma](https://www.prisma.io)

- navigate to prisma dir prisma
```bash
cd prisma
```

- create prisma/.prisma.env
```bash
cp .example.prisma .env .prisma.env
```

- run the db

!!! Note "if you dont prefer docker"
        I use docker here but you use your own postgres uri creatd by another mean or even use another sgbd as allowed by [prisma](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project)"

```bash
docker-compose up
```
this will create a postgres server on listening on the port 5433

- create a .env file to add
```.env
POSTGRES_PRISMA_URL=postgresql://myuser:mypassword@localhost:5433/mydatabase
POSTGRES_URL_NON_POOLING=postgresql://myuser:mypassword@localhost:5433/mydatabase
```

for example
```.env
POSTGRES_PRISMA_URL=postgresql://myuser:mypassword@localhost:5433/mydatabase
POSTGRES_URL_NON_POOLING=postgresql://myuser:mypassword@localhost:5433/mydatabase
```


- migration: init bd with tables
```bash
npx prisma migrate dev --name init
```

## authentication setup with [clerk](https://clerk.com)

[clerk](https://clerk.com) is use to handle user authentication

- create and modify file `.env.local`
```
cp .example.env.local .env.local 
```
- get your authentications on the website: [clerk.com](https://clerk.com)

## backend setup with fastapi

- using docker
```bash
cd api
docker-compose up
```

- running localy
```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

- access the server

The server will be running on [`localhost:8000`](http:localhost:8000) so youy can access it on the browser.
You can check the endpoint [`/api/python`](http:localhost:8000/api/python)
There is finally a swagger documentation [/docs](http:localhost:8000/docs)

- before each commit, you might want add some formating
```bash
isort . && black .
```

## frontend setup with next

- install deps
```bash
npm install
```

- run the app localy
```bash
npm run dev
```

