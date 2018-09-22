#!/bin/bash

export SLACK_AUTH="Authorization: Bearer $1"

if [ "$#" -eq 3 ]; then
    # Simple message
    curl -F "text=$3" -F channel=$2 -F as_user=true -H "${SLACK_AUTH}" https://slack.com/api/chat.postMessage
elif [ "$#" -eq 4 ]; then
    # File attachment
    curl -F file=@$4 -F "initial_comment=$3" -F channels=$2 -H "${SLACK_AUTH}" https://slack.com/api/files.upload
else
    echo "Usage: slack.sh <slack API token> <slack channel tag> \"<message>\" [file path]"
fi




