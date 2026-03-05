import { apiClient } from './client';

export interface Clip {
  id: string;
  content: string;
  created_at: string;
  expires_at?: string;
  source_device_id?: string;
}

export interface CreateClipRequest {
  content: string;
}

export interface CreateClipResponse {
  id: string;
}

export const clipboardApi = {
  getAll: () => apiClient.get<Clip[]>('/api/clips'),
  getById: (id: string) => apiClient.get<Clip>(`/api/clips/${id}`),
  create: (data: CreateClipRequest) =>
    apiClient.post<CreateClipResponse>('/api/clips', data),
  delete: (id: string) => apiClient.delete<void>(`/api/clips/${id}`),
};
