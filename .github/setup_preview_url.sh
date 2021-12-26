#!/bin/bash

lastest_sha=$1
short_sha=$(cut -c 1-9 <<< "$lastest_sha")
url="https://rpo-$short_sha-ansnoussi.vercel.app/"
echo "📄 - PREVIEW URL: $url"
echo "$PREVIEW_URL=$short_sha" >> $GITHUB_ENV