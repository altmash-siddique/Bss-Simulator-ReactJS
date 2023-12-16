class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async makeRequest(endpoint, method, data, headers, params) {
    const url = new URL(`${this.baseURL}/${endpoint}`);

    // Add URL parameters
    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }

    const requestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    // Add request body for POST and PUT requests
    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

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
