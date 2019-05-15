#!/usr/bin/env bash
git pull origin master          # take all changes from master branch
./bin/build-frontend.sh         # build frontend
docker-compose up --build -d    # build docker image and restart app
curl http://127.0.0.1:4040/api/v1/health-check
