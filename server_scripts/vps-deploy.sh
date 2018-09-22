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

	# Terminate node instance
    print_and_slack "Waiting ${PKILL_TIMEOUT} for graceful shutdown of node (PID: $pid)..."
    timeout $PKILL_TIMEOUT tail --pid=$pid -f /dev/null

	# Timed out
	if [ "$#" -eq 124 ]; then
		print_and_slack "Instance of node (PID: $pid) filed to shutdown gracefully after ${PKILL_TIMEOUT}, killing process..."
		kill --signal 9 $pid
	fi

done

# Start our node server
nohup ${BASEDIR}/vps-boot-website.sh > /dev/null 2>&1 &
disown

print_and_slack "Started the server, website should be online any second now..."

