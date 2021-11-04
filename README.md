# TPO app

## Requirements

- [Node](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- ESLint `node install -g eslint`

## How to...

1. `git clone https://github.com/nikp00/TPO.git` or `git clone git@github.com:nikp00/TPO.git`

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

- Every push to teh master branch will be automatically built into 2 docker images and deployed to the [server](http://157.230.113.194)

- Frontend address [http://157.230.113.194](http://157.230.113.194)

- Backend address [http://157.230.113.194:3000/api](http://157.230.113.194:3000/api)

- If you want to use [Insomnia](https://insomnia.rest/download) to test the API you can use the template in `/utils/insomnia_template/`
