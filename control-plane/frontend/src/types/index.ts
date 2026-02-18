export interface Project {
  id?: number;
  name: string;
  description?: string;
  routes?: number;
  status?: string;
  updated?: string;
}

export interface Route {
  id?: number;
  name: string;
  projectId?: number;
  yamlDsl?: string;
  status?: string;
  description?: string;
  throughput?: string;
  project?: string;
}

export interface ComponentItem {
  icon: string;
  name: string;
  component: string;
}

export interface ComponentCategory {
  category: string;
  items: ComponentItem[];
}
