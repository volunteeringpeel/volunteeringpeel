# THIS SCRIPT IS FOR TRAVIS CI USE ONLY

# Upload generated files
rsync -rv -delete-after --exclude=node_modules/ --exclude=passwords.json $2/dist/ build@$1:/var/volunteeringpeel/
# Upload dependency definitions
scp $2/package.json build@$1:/var/volunteeringpeel/package.json
scp $2/yarn.lock build@$1:/var/volunteeringpeel/yarn.lock

# Install dependencies on server and restart
ssh -T build@$1 <<-'END'
  cd /var/volunteeringpeel
  yarn install --ignore-scripts --production
  sudo chmod -R 774 /var/volunteeringpeel
  pm2 restart index
END