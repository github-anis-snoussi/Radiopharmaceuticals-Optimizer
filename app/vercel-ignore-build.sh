#!/bin/bash


# ==> The following script is enabled by specifying "bash vercel-ignore-build.sh" in "Ignored Build Step" field in Vercel


# Some logging :
echo "📄 - VERCEL_ENV: $VERCEL_ENV"
echo "📄 - VERCEL_GIT_REPO_OWNER: $VERCEL_GIT_REPO_OWNER"
echo "📄 - VERCEL_GIT_REPO_SLUG: $VERCEL_GIT_REPO_SLUG"
echo "📄 - VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"


########################################## BEHOLD MY WASTED TIME : ##################################################
#####################################################################################################################
# The goal is to only deploy master branch commits to prod url, and pull requests to master branch to preview urls
# THE PROBLEM is vercel cashes the output of this script when I push to dev branch (exit 0) 
# => so when I create a pull request, this script will not run again, and deployment will cancel :,) 
#####################################################################################################################
#####################################################################################################################


# tell vercel only to deploy master branch, or from pull requests from dev
# PITFALL : if ANY pull request is open while a commit is pushed to dev branch, it will deploy, but since I'm the only person working on this project, this is not an issue.

if [[ "$VERCEL_GIT_COMMIT_REF" == "master" ]] ; then
  # Proceed with the build
  echo "📄 - We are on master branch"
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
  curl_output="$(curl -s -H 'Content-Type: application/json' \
   -H "Authorization: bearer $GITHUB_TOKEN" \
   -X POST -d "{ \"query\": \"$script\"}" https://api.github.com/graphql)"

  echo "📄 - CURL OUTPUT: $curl_output"

  is_pull_from_dev="$(echo $curl_output | python -c "import sys, json; print any(\"$VERCEL_GIT_COMMIT_REF\" == node['node']['headRefName'] for node in json.load(sys.stdin)['data']['search']['edges'])")"

  if [[ "$is_pull_from_dev" == "True" ]] ; then
    echo "📄 - this is a PR from $VERCEL_GIT_COMMIT_REF"
    echo "✅ - Build can proceed"
    exit 1;
  else
    echo "📄 - this is not a PR from $VERCEL_GIT_COMMIT_REF"
    echo "🛑 - Build cancelled"
    exit 0;
  fi
fi



######################################
######################################

# VERIFY IF VERCEL HAS PYTHON : (YES IT DOES !)
# echo "hello from python" | python -c "import sys; print sys.stdin"