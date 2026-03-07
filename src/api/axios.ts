import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponseString } from './api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ACCESS_TOKEN_KEY = 'access_token';

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// ── Axios instance ────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 리프레시 토큰 쿠키 자동 전송
});

// ── Request interceptor ───────────────────────────────────────────────────────

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────

/** 토큰 갱신 중 대기하는 요청들의 큐 */
type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let queue: QueueItem[] = [];

function processQueue(err: unknown, token: string | null) {
  queue.forEach((item) => {
    if (err) item.reject(err);
    else item.resolve(token!);
  });
  queue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401이 아니거나 이미 재시도한 요청이면 그냥 reject
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // 토큰 갱신이 이미 진행 중이면 큐에 적재 후 대기
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<ApiResponseString>(
        `${BASE_URL}reissue`,
        null,
        { withCredentials: true },
      );

      const newToken = data.data;
      if (!newToken) throw new Error('reissue 응답에 토큰이 없습니다');

      setAccessToken(newToken);
      processQueue(null, newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      removeAccessToken();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ── apiRequest ────────────────────────────────────────────────────────────────

/** 서버의 공통 응답 envelope */
interface ApiResponse<T> {
  code?: string;
  msg?: string;
  data?: T;
}

/**
 * apiClient를 래핑한 요청 함수.
 * 서버 공통 응답 envelope({ code, msg, data })를 자동으로 unwrap해 내부 data를 반환한다.
 *
 * TanStack Query queryFn / mutationFn에 바로 사용할 수 있도록 Promise<T>를 반환한다.
 *
 * @example
 * // Query
 * queryFn: () => apiRequest<GetDocumentResponse>({ url: 'api/v1/documents/1' })
 *
 * // Mutation
 * mutationFn: (body: CreateDocumentRequest) =>
 *   apiRequest<CreateDocumentResponse>({ method: 'POST', url: 'api/v1/documents', data: body })
 */
export async function apiRequest<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.request<ApiResponse<T>>({
    method: 'GET',
    ...config,
  });
  return data.data as T;
}
