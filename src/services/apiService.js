// ApiService.js

import { getAppConfig } from "../constants/apiConfig";
import { ECM_API_LAMBDA } from "../constants/apiEndpoints";

class ApiService {
  constructor(environment) {
    // Use the specified environment or fallback to the default environment
    this.environment = environment;
  }

  async makeRequest(endpoint, method, data, headers, params, useeocApi = true) {
    const appConfig = getAppConfig(this.environment);
    let url = "";
    if (endpoint === ECM_API_LAMBDA.PATH) {
      url = `${ECM_API_LAMBDA.PATH}`;
    } else if (useeocApi && appConfig.baseUrl) {
      url = `${appConfig.baseUrl}${endpoint}`;
    } else if (appConfig.tykApi) {
      url = `${appConfig.tykApi}${endpoint}`;
    } else {
      throw new Error(
        "Neither tykApi nor baseUrl is defined in the configuration."
      );
    }
    // Add URL parameters
    if (params) {
      const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
      url += `?${queryString}`;
  }

    const requestOptions = {
      method: method.toUpperCase(), // Ensure it's in uppercase
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    // Add request body for POST and PUT requests
    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    console.log("Request URL:", url);
    console.log("Request Options:", requestOptions);

    try {
      const response = await fetch(url.toString(), requestOptions);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      if(response.status === 200){
        return await response.json();
      }
      else {
        return await response;
      }

     
    } catch (error) {
      console.error("Error making API request:", error);
      throw error;
    }
  }

  get(endpoint, headers, params) {
    return this.makeRequest(endpoint, "GET", null, headers, params);
  }

  post(endpoint, data, headers, params) {
    return this.makeRequest(endpoint, "POST", data, headers, params);
  }

  put(endpoint, data, headers, params) {
    return this.makeRequest(endpoint, "PUT", data, headers, params);
  }

  delete(endpoint, headers, params) {
    return this.makeRequest(endpoint, "DELETE", null, headers, params);
  }
}

export default ApiService;
