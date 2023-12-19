// config.js
import intConfig from '../environments/int';
import uatConfig from '../environments/uat';


const environments = {
  INT: intConfig,
  UAT: uatConfig
};



const defaultEnvironment = 'INT'; // Set your default environment

export const getAppConfig = (env = defaultEnvironment) => {
 return environments[env] || environments[defaultEnvironment];
};

