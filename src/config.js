const dev = {
  s3: {
    REGION: 'us-east-1',
    BUCKET: 'trade-tracker-api-dev-attachmentsbucket-1lpnn3rxpkq8r',
  },
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://200a846kke.execute-api.us-east-1.amazonaws.com/dev',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_69GmK7uSY',
    APP_CLIENT_ID: '3b2dh5vnu9umjn6n600fr0nlsv',
    IDENTITY_POOL_ID: 'us-east-1:0aa51440-f8d4-4039-ab46-608c7daed463',
  },
};

const prod = {
  s3: {
    REGION: 'us-east-1',
    BUCKET: 'trades-app-2-api-prod-serverlessdeploymentbucket-1vn6fit4lfnsa',
  },
  apiGateway: {
    REGION: 'us-east-1',
    URL: 'https://be7e2l9ay3.execute-api.us-east-1.amazonaws.com/prod',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_ldC5nVMMz',
    APP_CLIENT_ID: '7eqg9e32o6r0dhs46mkij151u0',
    IDENTITY_POOL_ID: 'us-east-1:b1620a17-cc7a-413e-817f-b40ebfb44fd2',
  },
  STRIPE_KEY: 'YOUR_STRIPE_PROD_PUBLIC_KEY',
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config,
};
