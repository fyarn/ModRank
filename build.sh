#! /bin/bash

echo "Deploying...";
pushd /opt/ModRank;
docker-compose stop node;
git stash;
git pull origin master;
docker-compose up -d --build > /dev/null;
popd;