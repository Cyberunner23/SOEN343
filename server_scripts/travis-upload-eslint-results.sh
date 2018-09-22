#!/bin/bash

# Script executed by travis CI that uploads the results of eslint to the #build-status channel

if [ "$#" -ne 3 ]; then
    echo "USAGE: travis-upload-eslint-results <slack API token> <slack channel tag> <eslint result file path>"
fi

export TRAVIS_LINK="https://travis-ci.com/Cyberunner23/SOEN343/jobs/${TRAVIS_JOB_ID}"
export SLACK_COMMENT="Eslint output for build #${TRAVIS_BUILD_NUMBER} at ${TRAVIS_LINK}"
export BASEDIR=$(dirname "$0")

${BASEDIR}/slack.sh $1 $2 "${SLACK_COMMENT}" $3

