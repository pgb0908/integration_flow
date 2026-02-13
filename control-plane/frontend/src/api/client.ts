import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface RouteDefinition {
  id: string
  name: string
  description: string
  yamlDsl: string
}

export interface RouteStatusResponse {
  routeId: string
  status: 'RUNNING' | 'STOPPED' | 'ERROR'
  message: string
}

export const routeApi = {
  getAll: () => apiClient.get<RouteDefinition[]>('/routes'),
  getById: (id: string) => apiClient.get<RouteDefinition>(`/routes/${id}`),
  create: (route: Partial<RouteDefinition>) => apiClient.post<RouteDefinition>('/routes', route),
  update: (id: string, route: Partial<RouteDefinition>) => apiClient.put<RouteDefinition>(`/routes/${id}`, route),
  delete: (id: string) => apiClient.delete(`/routes/${id}`),
  deploy: (id: string) => apiClient.post<string>(`/routes/${id}/deploy`),
}

export const healthApi = {
  getDataPlaneStatus: () =>
    apiClient.get<RouteStatusResponse[]>('/routes/health', {
      baseURL: 'http://localhost:8081',
    }).catch(() => ({ data: [] as RouteStatusResponse[] })),
}

export default apiClient
