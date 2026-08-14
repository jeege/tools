import { apiClient } from './client';

const CLIPS_PATH = '/api/clips';
export interface Clip {
  id: string;
  content: string;
  created_at: string;
  expires_at?: string | null;
  source_device_id?: string | null;
}

export interface CreateClipRequest {
  content: string;
  expires_at?: string;
  source_device_id?: string;
}

export const clipboardApi = {
  getAll: () =>
    apiClient.get<Clip[]>(CLIPS_PATH, { params: { _order: '-created_at' } }),

  getById: async (id: string) => {
    const rows = await apiClient.get<Clip[]>(CLIPS_PATH, {
      params: { id: `$eq.${id}` },
    });
    return rows[0] ?? null;
  },

  create: (data: CreateClipRequest) =>
    apiClient.post<Clip[]>(CLIPS_PATH, {
      id: crypto.randomUUID(),
      content: data.content,
      created_at: new Date().toISOString(),
      ...(data.expires_at ? { expires_at: data.expires_at } : {}),
      ...(data.source_device_id
        ? { source_device_id: data.source_device_id }
        : {}),
    }),

  delete: (id: string) =>
    apiClient.delete<Clip[]>(CLIPS_PATH, { params: { id: `$eq.${id}` } }),
};
