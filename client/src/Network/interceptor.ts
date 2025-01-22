import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
  responseType: 'json',
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', token);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default api;
