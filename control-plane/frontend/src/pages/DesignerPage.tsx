import FlowDesigner from '../components/designer/FlowDesigner';

interface DesignerPageProps {
  routeId?: number;
}

export default function DesignerPage({ routeId }: DesignerPageProps) {
  return <FlowDesigner routeId={routeId} />;
}
