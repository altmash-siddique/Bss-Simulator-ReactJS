// AppConfig.js

const environments = {
    INT: {
      baseUrl: process.env.EOC_BASE_URL,
      tykApi: process.env.TYK_API,
      // Add other environment-specific configurations if needed
    },
    UAT: {
      baseUrl: process.env.EOC_BASE_URL,
      tykApi: process.env.TYK_API,
      // Add other environment-specific configurations if needed
    },
    PROD: {
      baseUrl: process.env.EOC_BASE_URL,
      tykApi: process.env.TYK_API,
      // Add other environment-specific configurations if needed
    },
    // Add more environments as needed
  };
  
  const defaultEnvironment = 'INT'; // Set your default environment
  
  export const getAppConfig = (env = defaultEnvironment) => {
    return environments[env] || environments[defaultEnvironment];
  };
  