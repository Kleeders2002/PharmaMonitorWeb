// api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  // timeout: 10000,
  timeout: 10000,
});

type QueueItem = {
  resolve: (value: AxiosResponse) => void;
  reject: (error: AxiosError) => void;
  config: InternalAxiosRequestConfig;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: AxiosError | null, token?: string) => {
  failedQueue.forEach(({ config, resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      // Clonar y actualizar configuración con nuevo token
      const newConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`
        }
      };
      
      // Ejecutar solicitud con nueva configuración
      api.request(newConfig)
        .then(resolve)
        .catch(reject);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];

    if (accessToken) {
      const cleanToken = accessToken.replace('Bearer ', '');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Evitar loops infinitos
    if (error.response?.status === 401 && 
        !originalRequest.url.includes('/silent-renew') &&
        !originalRequest._retry) {
      
      originalRequest._retry = true;
      
      try {
        // Renovar token
        const { data } = await api.post('/silent-renew');
        
        // Actualizar headers automáticamente
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        
        // Reintentar solicitud original
        return api(originalRequest);
      } catch (refreshError) {
        // Forzar recarga completa
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;