# Readme

## Introduction

This repository is a fork of [YourAverageTechBro/DevToolboxWeb](https://github.com/YourAverageTechBro/DevToolboxWeb/), containing the codebase of a Next.js app available online at [devtoolbox-rho.vercel.app](https://devtoolbox-rho.vercel.app). This application offers various processing tools commonly used by developers. The authentication is handled by [Clerk](https://clerk.com), and [Prisma](https://www.prisma.io) is utilized for database integration.

**Added Functionality**
I have extended this project by integrating a backend to introduce additional functionalities through a Python API. For the backend, I employed FastAPI and integrated it with the frontend in the [next.config.js](../next.config.js) file, building upon the work of [Diego Valdez](https://github.com/digitros/nextjs-fastapi).

This tutorial demonstrates how to set up and run the application locally, including the backend.

## Prerequisites

- Docker, docker-compose (alternative methods available)
- Python (>3.7, preferably 3.11)
- Node (preferably version 20)

## Database Setup with [Prisma](https://www.prisma.io)

- Navigate to the Prisma directory:

```bash
cd prisma
```

- Create the `.prisma.env` file:

```bash
cp ./dev/examples/.example.prisma.env .prisma.env
```

Then update it. For example

```.env
POSTGRES_DB=mydatabase
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
```

- Run the database:

```bash
docker-compose up
```

This command creates a PostgreSQL server listening on port 5433.

??? Note "If you dont prefer docker"
    I use docker here but you use your own postgres uri creatd by another mean or even use another sgbd as allowed by [prisma](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project)"

- Test the database:

**Outside of the container:**

```bash
# Install the client
sudo apt-get install postgresql-client
# Access the database on port 5433
psql -h localhost -p 5433 -U myuser mydatabase;
```

**Inside the container:**

```bash
# Get the running container ID with `docker ps`
docker exec -it <container_id> /bin/bash
# Access the database on port 5432
psql -h localhost -p 5432 -U myuser mydatabase
```

!!! note "read more on installing the client [here](https://stackoverflow.com/questions/28290488/get-error-you-must-install-at-least-one-postgresql-client-version-package-whe)"

Either way, you will be connected:

```plaintext
mydatabase=#
```

You can add SQL commands from there.

- Create a `.env` file:

```bash
cp ./dev/examples/.example.env .env
```

then, update it. For example

```plaintext
POSTGRES_PRISMA_URL=postgresql://myuser:mypassword@localhost:5433/mydatabase
POSTGRES_URL_NON_POOLING=postgresql://myuser:mypassword@localhost:5433/mydatabase
FASTAPI_URL=http://127.0.0.1:8000
```

- Perform migration to initialize the database with tables:

```bash
# Initialization
npx prisma generate
# Create the table
npx prisma migrate dev --name init
# Create the actual tables
npx prisma db push
```

This process is automated in the [run-post-build.sh](./scripts/run-post-build.sh) script.

??? note "the last command was found [here](https://github.com/prisma/prisma/issues/10771#issuecomment-1035424831). Seems also, there is [another command for prod](https://github.com/prisma/prisma/issues/10771#issuecomment-1065935613)"

## Authentication Setup with [Clerk](https://clerk.com)

[Clerk](https://clerk.com) is used for user authentication.

- Create and modify the `.env.local` file:

```bash
cp ./dev/examples/.example.env.local .env.local 
```

- Obtain your authentication details from [clerk.com](https://clerk.com).

- update the `.env.local` file to mention `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`

## Backend Setup with FastAPI

You basically have 2 solutions here

- Using a separate Docker container:

```bash
cd api
docker-compose up
```

- Running locally:

```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
```

- Access the server:

The server will be running on [`localhost:8000`](http://localhost:8000), accessible through the browser. You can check the endpoint [`/api/python`](http://localhost:8000/api/python). Additionally, there is a Swagger documentation available at [/docs](http://localhost:8000/docs).

![Api view](./assets/api-view.png)

- Before each commit, ensure formatting:

```bash
isort . && black .
```

## Frontend Setup with Next.js

- Install dependencies:

```bash
npm install
```

- Run the app locally:

```bash
npm run dev
```

![web view default](./assets/web-view-default.png)

## Docker-compose with All Three Projects

Instead of running separate Docker containers for each service, a single `docker-compose.yml` file is used to run all three services simultaneously.

### Docker Compose Configuration

I've created a [docker-compose file](../docker-compose.yml) that orchestrates the following services:

- **Prisma DB (`postgres`):**
  - Port: `postgres:5432`
  - Accessible locally: `localhost:5433`
  - Using the env file [`./prisma/.prisma.env`](../prisma/.prisma.env)

- **API (`FastAPI`):**
  - Port: `fastapi:8000`
  - Accessible locally: `localhost:8000`
  - Using the Docker file [`./api/Dockerfile`](../api/Dockerfile)

- **Client (`Next.js`):**
  - Port: `nextjs:3000`
  - Accessible locally: `localhost:3000`
  - Using the Dockerfile [`./Dockerfile-dev`](../Dockerfile-dev)
  - Using the env file [`.env.docker`](../.env.docker), a copy of the `.env` file where `localhost` is replaced with `postgres`
  - Dependencies on the above two services

### Setup Instructions

Before running the Docker containers, ensure the `.env.docker` file is set up properly:

- If you have an [`.env`](../.env) file, you can run this command to create the `.env.docker` file:

```bash
cat .env | tr "@localhost" "@fastapi" > .env.docker 
```

- If not, you can use the following command to create it:

```bash
cp ./dev/examples/.example.env.docker .env.docker 
```

Then, update it with your database specifications.

### Running the Docker Containers

To streamline this process, run the Docker containers using [docker-compose](../docker-compose.yml):

```bash
docker-compose up
```

### Database Migration

After running the containers, migrate the database using [the script](./scripts/run-post-build.sh):

```bash
source ./dev/scripts/run-post-build.sh
```

### Accessing the Application

The application should now be running smoothly and accessible on [localhost:3000](http://localhost:3000/tools/diff-viewer).

![web view - tools](./assets/web-view-tools.png)

As starter, i've added a [file encoding detector](http://localhost:3000/tools/file-encoding-detector) you can test out

![web view - file converter](./assets/web-view-file-converter.png)

## Linter Setup

To maintain code quality, linting scripts have been added for markdown files, FastAPI Python files, and TypeScript files in the client. Run the linting script:

```bash
source ./dev/scripts/run-lint.sh
```
