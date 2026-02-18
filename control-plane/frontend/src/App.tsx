import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProjectsPage from './pages/ProjectsPage';
import RoutesPage from './pages/RoutesPage';
import DesignerPage from './pages/DesignerPage';
import DeploymentsPage from './pages/DeploymentsPage';
import KameletsPage from './pages/KameletsPage';
import SettingsPage from './pages/SettingsPage';

const COLORS = {
  bg: '#0f1117',
  sidebar: '#161821',
  header: '#161821',
  content: '#1a1c2a',
  text: '#e8eaf0',
  textMuted: '#8890a8',
  border: '#2a2d45',
  primary: '#6c8cff',
};

type PageType = 'projects' | 'routes' | 'designer' | 'deployments' | 'kamelets' | 'settings';

interface PageConfig {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export default function App() {
  const [page, setPage] = useState<PageType>('projects');
  const [sidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  const pageConfig: Record<PageType, PageConfig> = {
    projects: { title: 'Projects', subtitle: 'All projects', actions: <button className="btn-primary">+ New Project</button> },
    routes: { title: 'Routes', subtitle: 'All integration routes', actions: <button className="btn-primary">+ New Route</button> },
    designer: { title: 'Route Designer', subtitle: 'Design your route', actions: <><button>💾 Save</button><button className="btn-primary">🚀 Deploy</button></> },
    deployments: { title: 'Deployments', subtitle: 'Recent deployments' },
    kamelets: { title: 'Kamelet Catalog', subtitle: 'Custom adapters', actions: <button className="btn-primary">+ Register</button> },
    settings: { title: 'Settings', subtitle: 'Platform configuration', actions: <button className="btn-primary">+ Add Data-Plane</button> },
  };

  const cfg = pageConfig[page];

  const handleProjectClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setPage('routes');
  };

  const handleEditRoute = (routeId: number) => {
    setSelectedRouteId(routeId);
    setPage('designer');
  };

  const renderPage = () => {
    switch (page) {
      case 'projects': return <ProjectsPage onProjectClick={handleProjectClick} />;
      case 'routes': return <RoutesPage projectId={selectedProjectId ?? undefined} onEditRoute={handleEditRoute} />;
      case 'designer': return <DesignerPage routeId={selectedRouteId ?? undefined} />;
      case 'deployments': return <DeploymentsPage />;
      case 'kamelets': return <KameletsPage />;
      case 'settings': return <SettingsPage />;
      default: return <ProjectsPage onProjectClick={handleProjectClick} />;
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: 'hidden',
    }}>
      <Sidebar
        active={page}
        onNav={setPage}
        collapsed={sidebarCollapsed}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title={cfg.title} subtitle={cfg.subtitle} actions={cfg.actions} />
        <div style={{ flex: 1, overflow: 'auto', display: page === 'designer' ? 'flex' : 'block' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
