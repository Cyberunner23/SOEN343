#!/bin/bash

#Base path to this script.
BASEDIR=$(dirname "$0")


#############################
# Boot
#############################

npm start > server.log 2>&1


#############################
# Crash Detection
#############################

if [ "$?" -eq 137 ]; then
    ${BASEDIR}/slack.sh ${SlackAPIToken} ${SlackServerStatChannel} "WARNING: Node returned with error code 137 -> process manually killed."
elif [ "$?" -ne 0 ]; then
    ${BASEDIR}/slack.sh ${SlackAPIToken} ${SlackServerStatChannel} "<!channel> !!CRASH!! Node returned with error code $?, please view logs attached." ${BASEDIR}/server.log
fi

