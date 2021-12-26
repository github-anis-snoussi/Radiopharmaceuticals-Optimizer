#!/bin/bash

# tell vercel only to deploy master branch, or from pull requests from dev

if [[ "$VERCEL_GIT_COMMIT_REF" == "master" ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;

else
  # we query the 
  script="{
    search(query: \\\"repo:$VERCEL_GIT_REPO_OWNER/$VERCEL_GIT_REPO_SLUG is:pr state:open\\\", type: ISSUE, first: 100) {
      edges {
        node {
          ...on PullRequest{
            number
            headRefName
          }
        }
      }
    }
  }"
  script="$(echo $script)"   # the query should be a one-liner, without newlines
  output="$(curl -s -H 'Content-Type: application/json' \
   -H "Authorization: bearer $GITHUB_TOKEN" \
   -X POST -d "{ \"query\": \"$script\"}" https://api.github.com/graphql \
   | python -c "import sys, json; print any(\"$VERCEL_GIT_COMMIT_REF\" == node['node']['headRefName'] for node in json.load(sys.stdin)['data']['search']['edges'])"
   )"

  if [[ "$output" == "True" ]] ; then
    echo "✅ - Build can proceed"
    exit 1;
  else
    echo "🛑 - Build cancelled"
    exit 0;
  fi
fi



######################################
######################################

# VERIFY IF VERCEL HAS PYTHON : (YES IT DOES !)
# echo "hello from python" | python -c "import sys; print sys.stdin"