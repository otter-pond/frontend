const local = {
    apiGateway: "http://localhost:5000"
};


const dev = {
    apiGateway: "https://dev-api.theotterpond.com"
};

const prod = {
    apiGateway: "https://prod-api.theotterpond.com"
};

const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : process.env.REACT_APP_STAGE === 'dev'
    ? dev
    : local;

export default {
    ...config
};