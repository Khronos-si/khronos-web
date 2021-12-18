#!/bin/bash


docker login -u $(printenv DOCKERHUB_USERNAME) -p $(printenv DOCKERHUB_PASSWORD) &&
docker-compose down &&
docker-compose pull &&
docker-compose up -d;

# webhook -hooks /root/TPO/auto_deploy/hooks.json -verbose
# tmux new -s webhook_session
# tmux attach -t webhook_session