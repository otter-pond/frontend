echo "Travis Init"

npm install

echo "Setting up react..."
# Installing the react cli
npm install -g react-cli react

echo "Setting up AWS CLI..."
pip3 install awscli --upgrade --user

echo "Deploying React Application..."


npm run deploy