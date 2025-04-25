
import { useState } from 'react';
import { SentinelProvider } from '@/contexts/SentinelContext';
import Dashboard from '@/components/Dashboard';
import SidebarNav from '@/components/SidebarNav';
import CameraFeeds from '@/components/CameraFeeds';
import DroneSurveillance from '@/components/DroneSurveillance';
import MeshNetwork from '@/components/MeshNetwork';
import AlertsView from '@/components/AlertsView';
import BuildingView from '@/components/BuildingView';

const Index = () => {
  const [view, setView] = useState('dashboard');

  return (
    <SentinelProvider>
      <div className="min-h-screen flex bg-sentinel-dark text-white">
        <SidebarNav view={view} setView={setView} />
        
        <main className="flex-1 ml-16 overflow-auto">
          {view === 'dashboard' && <Dashboard />}
          {view === '3d' && <BuildingView />}
          {view === 'cameras' && <CameraFeeds />}
          {view === 'drones' && <DroneSurveillance />}
          {view === 'mesh' && <MeshNetwork />}
          {view === 'alerts' && <AlertsView />}
        </main>
      </div>
    </SentinelProvider>
  );
};

export default Index;
