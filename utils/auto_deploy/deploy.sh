#!/bin/bash


docker login -u $(printenv DOCKERHUB_USERNAME) -p $(printenv DOCKERHUB_PASSWORD) &&
docker-compose down &&
docker-compose pull &&
docker-compose up -d;