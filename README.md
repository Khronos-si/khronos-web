# TPO app

[![Lint Codebase & Build Docker Images](https://github.com/nikp00/TPO/actions/workflows/lint-and-docker-build.yml/badge.svg)](https://github.com/nikp00/TPO/actions/workflows/lint-and-docker-build.yml)

[![Manual Build Docker Images](https://github.com/nikp00/TPO/actions/workflows/docker-build.yml/badge.svg)](https://github.com/nikp00/TPO/actions/workflows/docker-build.yml)

## Requirements

- [Node](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- ESLint `node install -g eslint`

## How to...

1. `git clone https://github.com/Khronos-si/khronos-web.git` or `git clone git@github.com:Khronos-si/khronos-web.git`

2. `cd TPO`

3. To start the docker containers `docker-compose up`

4. To destroy the docker containers (optional) `docker-compose down`

## Other stuff

- To lint a specific part of the code base (frontend, backend) you must first `cd` into the root directory of that part. Example:

```
    cd frontend
    eslint ./
```

- [DB diagram](https://dbdiagram.io/d/617d45fcfa17df5ea6761259)

- Every push to the dev branch will be automatically linted.

- Every push to the master branch, whose commit message contains "release", will be automatically linted and built into 2 docker images and deployed to the [server](https://khronos.si)

- You can manually trigger a build action from [here](https://github.com/nikp00/TPO/actions/workflows/docker-build.yml)

- Frontend address [http://157.230.113.194](https://khronos.si)

- Backend address [http://157.230.113.194:3000/api](https://khronos.si:3000/api)

- If you want to use [Insomnia](https://insomnia.rest/download) to test the API you can use the template in `/utils/insomnia_template/`

- Online dev DB mongodb://157.230.113.194:27018
