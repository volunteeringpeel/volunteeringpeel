rsync -r --delete-after $2/dist/ build@$DEPLOY_HOST:/var/volunteeringpeel/
ssh -T build@$1 <<-'END'
  sudo chmod -R 774 /var/volunteeringpeel
  sudo service nodejs restart
END