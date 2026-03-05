import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Event emitter for toast notifications
class ToastEventEmitter {
  private listeners: ((message: string, type: 'error' | 'success') => void)[] = [];

  subscribe(listener: (message: string, type: 'error' | 'success') => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(message: string, type: 'error' | 'success') {
    this.listeners.forEach((listener) => listener(message, type));
  }
}

export const toastEmitter = new ToastEventEmitter();

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        let message = '请求失败';

        if (error.response) {
          const { status, data } = error.response;
          message = data?.error || message;

          // Handle specific HTTP status codes
          switch (status) {
            case 400:
              message = data?.error || '请求参数错误';
              break;
            case 401:
              message = '未授权，请重新登录';
              localStorage.removeItem('token');
              window.location.href = '/login';
              break;
            case 403:
              message = '没有权限执行此操作';
              break;
            case 404:
              message = '请求的资源不存在';
              break;
            case 500:
              message = '服务器内部错误';
              break;
            default:
              message = data?.error || `请求失败 (${status})`;
          }
        } else if (error.request) {
          message = '无法连接到服务器，请检查网络';
        } else {
          message = error.message || '请求失败';
        }

        // Emit error event
        toastEmitter.emit(message, 'error');

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
