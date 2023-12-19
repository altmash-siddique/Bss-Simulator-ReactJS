// ApiService.js

import { getAppConfig } from '../constants/apiConfig';
class ApiService {
  constructor(environment) {
    // Use the specified environment or fallback to the default environment
    this.environment = environment;
  }

  async makeRequest(endpoint, method, data, headers, params, useeocApi = true) {
    const appConfig = getAppConfig(this.environment);
    let url = '';
   // Check if useeocApi is true and baseUrl is present, use it; otherwise, use tykApi
   if (useeocApi && appConfig.baseUrl) {
    url = `${appConfig.baseUrl}${endpoint}`;
  } else if (appConfig.tykApi) {
    url = `${appConfig.tykApi}${endpoint}`;
  } else {
    throw new Error('Neither tykApi nor baseUrl is defined in the configuration.');
  }
    // Add URL parameters
    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
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

      return await response.json();
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
