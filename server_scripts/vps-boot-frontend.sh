#!/bin/bash

#Base path to this script.
BASEDIR=$(dirname "$0")


#############################
# Boot
#############################

cd ../frontend
export HOST="alexfl.net"
node node_modules/react-scripts/scripts/start.js > server.log 2>&1
ERROR_CODE=$?


#############################
# Crash Detection
#############################

if [ "$ERROR_CODE" -eq 137 ]; then
    ${BASEDIR}/slack.sh ${SlackAPIToken} ${SlackServerStatChannel} "WARNING: Node returned with error code 137 -> process manually killed."
elif [ "$ERROR_CODE" -ne 0 ]; then
    ${BASEDIR}/slack.sh ${SlackAPIToken} ${SlackServerStatChannel} "<!channel> !!CRASH!! Node returned with error code $ERROR_CODE, please view logs attached." ${BASEDIR}/../frontend/server.log
fi
