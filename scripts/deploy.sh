#!/bin/bash

# DEPLOYMENT SCRIPT
# Ensure env vars BUILD_NUM and CIRCLE_API_KEY are set

cd /var/www/volunteeringpeel
# Get environment variables (database password)
export $(cat .env | grep -v ^\# | xargs)

# Get artifact list and save to .artifacts
echo "Clearing artifacts directory..."
rm -rf .artifacts
echo "Downloading new artifacts..."
curl -s https://circleci.com/api/v1.1/project/github/volunteeringpeel/volunteeringpeel/$BUILD_NUM/artifacts?circle-token=$CIRCLE_API_KEY \
  | grep -o 'https://[^"]*' \
  | sed -En 's/^(.*volunteeringpeel\/)(.*)/"\.artifacts\/\2" "\1\2"/p' \
  | awk '{system("echo \"" $2 " -> " $1 "\"; curl --create-dirs -sSo " $1 " " $2)}';

# Install new packages, if needed
echo "Installing new packages..."
cp .artifacts/package.json package.json
cp .artifacts/yarn.lock yarn.lock
yarn install --ignore-scripts --production

# Stop site, copy new files, start site
echo "Stopping site..."
HOME=/var/www pm2 stop volunteeringpeel
echo "Installing new site..."
mkdir -p dist/app/upload/user
mkdir -p dist/app/upload/header
mkdir -p dist/app/upload/letter
rm -rf /tmp/upload
cp -rf dist/app/upload /tmp/
rm -rf dist
cp -rf .artifacts/dist ./
cp -rf /tmp/upload ./dist/app/
# Reset SQL database
# cat .artifacts/sql/*.sql | mysql -u "$DB_USER" -p"$DB_PASS" volunteeringpeel -v

echo "Starting site..."
HOME=/var/www pm2 start volunteeringpeel
