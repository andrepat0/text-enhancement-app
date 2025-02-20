// config.ts
const config = {
  apiBaseUrl: 'http://104.248.137.101:8000/api',  // Using the root URL with /api
    
  getApiUrl: (endpoint: string) => {
    return `${config.apiBaseUrl}/${endpoint}`;
  }
};

export default config;