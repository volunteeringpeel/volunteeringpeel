#!/bin/bash

rsync -r --delete-after --quiet $TRAVIS_BUILD_DIR/dist/ build@$DEPLOY_HOST:/var/volunteeringpeel/
ssh -T build@$DEPLOY_HOST <<-'END'
  sudo chmod -R 774 /var/volunteeringpeel
  sudo service nodejs restart
END