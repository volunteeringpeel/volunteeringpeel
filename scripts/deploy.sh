#!/bin/bash

# DEPLOYMENT SCRIPT
# Pass in $1 = CircleCI build number and $2 = CircleCI API Token

cd /var/www/volunteeringpeel
# Get environment variables (database password)
export $(cat .env | grep -v ^\# | xargs)

# Get artifact list and save to .artifacts
echo "Clearing artifacts directory..."
rm -rf .artifacts
echo "Downloading new artifacts..."
curl -s https://circleci.com/api/v1.1/project/github/volunteeringpeel/volunteeringpeel/$1/artifacts?circle-token=$2 \
  | grep -o 'https://[^"]*' \
  | sed -En 's/^(.*volunteeringpeel\/)(.*)/"\.artifacts\/\2" "\1\2"/p' \
  | awk '{system("echo \"" $2 " -> " $1 "\"; curl --create-dirs -sSo " $1 " " $2)}';

# Install new packages, if needed
echo "Installing new packages..."
cp .artifacts/package.json package.json
cp .artifacts/yarn.lock yarn.lock
yarn install

# Stop site, copy new files, start site
echo "Stopping site..."
HOME=/var/www pm2 stop volunteeringpeel
echo "Installing new site..."
rm -rf dist
cp -rf .artifacts/dist ./
echo "Starting site..."
HOME=/var/www pm2 start volunteeringpeel

# Reset SQL database
cat .artifacts/sql/*.sql | mysql -u "$DB_USER" -p"$DB_PASS" volunteeringpeel
