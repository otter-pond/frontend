echo "Travis Init"

echo "Setting up react..."
# Installing the react cli
npm install -g react-cli react
npm install

echo "Setting up AWS CLI..."
pip3 install awscli --upgrade --user

echo "Deploying React Application..."

if [ "$TRAVIS_BRANCH" = "$DEV_BRANCH_NAME" ]; then
  ACTION="deploy"
elif [ "$TRAVIS_BRANCH" = "$PROD_BRANCH_NAME" ]; then
  ACTION="deploy:prod"
else
  exit 1
fi


CI=false npm run $ACTION