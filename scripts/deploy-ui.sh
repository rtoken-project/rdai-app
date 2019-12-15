#!/bin/bash

cd "$(dirname "$0")"/..
source .env.local

export AWS_PROFILE

aws \
  s3 sync \
  --region $UI_S3_REGION \
  --acl public-read \
  --sse \
  --delete \
  dist/ $UI_S3_BUCKET_URI

if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ];then
    aws \
      cloudfront \
      create-invalidation \
      --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
      --paths '/*'
fi

# git rev-parse --verify HEAD
# git diff-index --quiet HEAD --
