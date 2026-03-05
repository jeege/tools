import { apiClient } from './client';

export interface IngressRule {
  id: number;
  hostname: string;
  service: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateRuleRequest {
  hostname: string;
  service: string;
}

export const tunnelApi = {
  getRules: () => apiClient.get<IngressRule[]>('/api/tunnel/rules'),
  updateRule: (data: UpdateRuleRequest) =>
    apiClient.post('/api/tunnel/rules', data),
  deleteRule: (hostname: string) =>
    apiClient.delete('/api/tunnel/rules', { params: { hostname } }),
};
