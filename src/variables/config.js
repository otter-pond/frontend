const local = {
    apiGateway: "http://localhost:5000"
};


const dev = {
    apiGateway: "https://dev.theotterpond.com/api"
};

const prod = {
    apiGateway: "http://prod.theotterpond.com/api"
};

const config = process.env.APP_STAGE === 'prod'
    ? prod
    : process.env.APP_STAGE === 'dev'
    ? dev
    : local;

export default {
    ...config
};