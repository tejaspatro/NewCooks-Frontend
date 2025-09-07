import axios from 'axios';

// Create a new Axios instance
const axiosApi = axios.create({
  // Your backend URL from application.properties
  baseURL: 'http://localhost:8080/newcooks',
  headers: {
    'Content-Type': 'application/json',
  },
});

// A list of URL path prefixes that do NOT require a JWT token
// These endpoints are for login and registration
const excludedEndpoints = [
  '/auth/',
  '/activate/',
  '/h2-console/',
  '/test',
  '/error',
  '/user/recipes',
  '/recipes/rating/**'
];

// Add a request interceptor to automatically add the Authorization header
axiosApi.interceptors.request.use(
  (config) => {
    // Check if the current request URL is in the excluded list
    const isExcluded = excludedEndpoints.some(endpoint => 
      config.url.startsWith(endpoint)
    );

    const token = localStorage.getItem('token');

    // Only add the token if it exists and the endpoint is not excluded
    if (token && !isExcluded) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosApi;



