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

export default function App() {
  const [page, setPage] = useState<PageType>('projects');
  const [sidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

  // Trigger counters: incrementing causes the page to open its create modal
  const [newProjectTrigger, setNewProjectTrigger] = useState(0);
  const [newRouteTrigger, setNewRouteTrigger] = useState(0);

  const getActions = () => {
    switch (page) {
      case 'projects':
        return (
          <button className="btn-primary" onClick={() => setNewProjectTrigger((n) => n + 1)}>
            + New Project
          </button>
        );
      case 'routes':
        return (
          <button className="btn-primary" onClick={() => setNewRouteTrigger((n) => n + 1)}>
            + New Route
          </button>
        );
      case 'designer':
        return (
          <>
            <button>💾 Save</button>
            <button className="btn-primary">🚀 Deploy</button>
          </>
        );
      case 'kamelets':
        return <button className="btn-primary">+ Register</button>;
      case 'settings':
        return <button className="btn-primary">+ Add Data-Plane</button>;
      default:
        return null;
    }
  };

  const pageTitles: Record<PageType, { title: string; subtitle: string }> = {
    projects: { title: 'Projects', subtitle: 'All projects' },
    routes: { title: 'Routes', subtitle: 'All integration routes' },
    designer: { title: 'Route Designer', subtitle: 'Design your route' },
    deployments: { title: 'Deployments', subtitle: 'Recent deployments' },
    kamelets: { title: 'Kamelet Catalog', subtitle: 'Custom adapters' },
    settings: { title: 'Settings', subtitle: 'Platform configuration' },
  };

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
      case 'projects':
        return (
          <ProjectsPage
            onProjectClick={handleProjectClick}
            createTrigger={newProjectTrigger}
          />
        );
      case 'routes':
        return (
          <RoutesPage
            projectId={selectedProjectId ?? undefined}
            onEditRoute={handleEditRoute}
            createTrigger={newRouteTrigger}
          />
        );
      case 'designer':
        return <DesignerPage routeId={selectedRouteId ?? undefined} />;
      case 'deployments':
        return <DeploymentsPage />;
      case 'kamelets':
        return <KameletsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ProjectsPage onProjectClick={handleProjectClick} createTrigger={newProjectTrigger} />;
    }
  };

  const cfg = pageTitles[page];

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
        onNav={(p) => setPage(p as PageType)}
        collapsed={sidebarCollapsed}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title={cfg.title} subtitle={cfg.subtitle} actions={getActions()} />
        <div style={{ flex: 1, overflow: 'auto', display: page === 'designer' ? 'flex' : 'block' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
