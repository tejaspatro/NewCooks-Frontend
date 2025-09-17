import axios from 'axios';

// Create a new Axios instance with your backend's base URL
const axiosApi = axios.create({
  baseURL: 'https://newcooksbackend-latest-1.onrender.com', // Render backend URL
  // baseURL: 'http://localhost:8080/newcooks', // localhost backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

const excludedPatterns = [
  /^\/auth\/.*/,
  /^\/activate\/.*/,
  /^\/h2-console\/.*/,
  /^\/test$/,
  /^\/error$/,
  /^\/user\/recipes$/,
  /^\/recipes\/rating\/.*/
];

// Add a request interceptor to automatically attach the JWT to protected requests
axiosApi.interceptors.request.use(
  (config) => {
    // Test the request URL against our regex patterns
    const isExcluded = excludedPatterns.some(pattern => pattern.test(config.url));

    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    // If a token exists and the endpoint is NOT in our excluded list,
    // add the Authorization header.
    if (token && !isExcluded) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default axiosApi;