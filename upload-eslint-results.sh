
# api token
# channel tag

export TRAVIS_LINK="https://travis-ci.com/Cyberunner23/SOEN343/builds/${TRAVIS_JOB_ID}"
export SLACK_COMMENT="Eslint output for build #${TRAVIS_BUILD_ID} at ${TRAVIS_LINK}"
export SLACK_AUTH="Authorization: Bearer $1"

curl -F file=@eslint-output.txt -F "initial_comment=${SLACK_COMMENT}" -F channels=$2 -H "${SLACK_AUTH}" https://slack.com/api/files.upload


