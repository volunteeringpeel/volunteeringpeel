rsync -r --delete-after --exclude node_modules/ $2/dist/ build@$1:/var/volunteeringpeel/
scp $2/package.json build@$1:/var/volunteeringpeel/package.json
# scp $2/src/api/passwords.js build@$1:/var/volunteeringpeel/passwords.js
scp $2/yarn.lock build@$1:/var/volunteeringpeel/yarn.lock

ssh -T build@$1 <<-'END'
  cd /var/volunteeringpeel
  yarn install --ignore-scripts --production
  sudo chmod -R 774 /var/volunteeringpeel
  sudo service nodejs restart
END