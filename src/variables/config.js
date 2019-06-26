const local = {
    apiGateway: "http://localhost:5000"
};


const dev = {
    apiGateway: "https://dev-api.theotterpond.com"
};

const prod = {
    apiGateway: "http://prod-api.theotterpond.com"
};

const config = process.env.APP_STAGE === 'prod'
    ? prod
    : process.env.APP_STAGE === 'dev'
    ? dev
    : local;

export default {
    ...config
};