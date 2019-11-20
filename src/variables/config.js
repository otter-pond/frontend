const local = {
    apiGateway: "http://localhost:5000",
    stripePublicKey: "pk_test_dvkfp2rItZMMYvvOkBjpQkNp00RZ5nu3J0"
};


const dev = {
    apiGateway: "https://dev-api.theotterpond.com",
    stripePublicKey: "pk_test_dvkfp2rItZMMYvvOkBjpQkNp00RZ5nu3J0"
};

const prod = {
    apiGateway: "https://prod-api.theotterpond.com",
    stripePublicKey: "pk_live_JUxM51O5gk4u7TA3YPRBkfg100s5QgdOIo"
};

const config = process.env.REACT_APP_STAGE === 'prod'
    ? prod
    : process.env.REACT_APP_STAGE === 'dev'
    ? dev
    : local;

export default {
    ...config
};