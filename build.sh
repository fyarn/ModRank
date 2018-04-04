#! /bin/bash

echo "Deploying...";
pushd /opt/ModRank;
docker-compose down;
docker pull nick0fisher/modrank;
docker-compose up;
popd;

