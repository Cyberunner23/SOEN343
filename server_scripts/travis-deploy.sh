#!/bin/bash

# Deploy script on travis-ci side. Pushed the change to the server.

if [ "$#" -ne 1 ]; then
    echo "ESAGE: travis-deploy.sh <path to deploy key>"
    exit 1
fi

eval "$(ssh-agent -s)"
chmod 600 $1
ssh-add $1

git config --global push.default matching
git remote add deploy ssh://git@alexfl.net:/srv/SOEN343.git
git push deploy master

