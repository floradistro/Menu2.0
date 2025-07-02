#!/bin/bash

BRANCH="auto-pr-$(date +%s)"

# Create a new branch
git checkout -b $BRANCH

# Stage and commit changes
git add .
git commit -m "Auto PR from script at $(date)"

# Push branch
git push origin $BRANCH

# Open PR using GitHub CLI (must be installed + authed)
gh pr create --title "Auto PR: $(date)" --body "This PR was auto-generated." --base main 