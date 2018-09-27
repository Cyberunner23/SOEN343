#!/bin/bash

# Deployment script. This script is executed after pushing to master on the VPS, this is done by travis-ci.

#Base path to this script.
BASEDIR=$(dirname "$0")
PKILL_TIMEOUT="10s"


#############################
# Utils
#############################
print_and_slack() {
    echo "$1"
    ${BASEDIR}/slack.sh ${SlackAPIToken} ${SlackServerStatChannel} "$1" >> /dev/null 2>&1
}  


#############################
# Deploy
#############################

print_and_slack "Initiating deployment..."

# Stop current node instances
pgrep node | while IFS= read -r pid
do

    # Terminate node instance, no longer trying for graceful shutdown, node doesnt rly shuts down gracefully ever...
    kill -9 $pid

done

# Start our node server
cd ../
npm install

cd frontend
npm install

cd ${BASEDIR}

nohup ${BASEDIR}/vps-boot-frontend.sh > /dev/null 2>&1 &
nohup ${BASEDIR}/vps-boot-backend.sh > /dev/null 2>&1 &
disown

print_and_slack "Started the server, website should be online any second now..."

