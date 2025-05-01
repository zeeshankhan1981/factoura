#!/bin/bash

# Get the latest git tag
LATEST_TAG=$(git tag --sort=version:refname | tail -n 1)

# Update the version in profile.js
sed -i '' "s/\(v[0-9]\+\.[0-9]\+\.[0-9]\+\)/v$LATEST_TAG/g" frontend/src/pages/profile.js

# Stage the changes
git add frontend/src/pages/profile.js

echo "Updated app version to $LATEST_TAG in profile.js"
