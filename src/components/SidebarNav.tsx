import React from "react";
import { 
  Camera, 
  LayoutDashboard, 
  Bell, 
  Network, 
  Box, 
  ArrowUpRight,
  Users,
  Map
} from "lucide-react";
import DroneIcon from "./icons/DroneIcon";

interface SidebarNavProps {
  view: string;
  setView: (view: string) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ view, setView }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, name: "Dashboard" },
    { id: '3d', icon: Box, name: "3D View" },
    { id: 'cameras', icon: Camera, name: "Cameras" },
    { id: 'drones', icon: DroneIcon, name: "Drones" },
    { id: 'autonomous', icon: Map, name: "Autonomous" },
    { id: 'tracking', icon: Users, name: "Person Tracking" },
    { id: 'mesh', icon: Network, name: "Mesh Network" },
    { id: 'alerts', icon: Bell, name: "Alerts" },
  ];

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-16 bg-black border-r border-sentinel-purple/20 z-10">
      <div className="flex flex-col items-center pt-6 h-full">
        <div className="w-10 h-10 bg-sentinel-purple rounded-full flex items-center justify-center mb-8">
          <ArrowUpRight className="h-5 w-5 text-white" />
        </div>
        
        <div className="space-y-2 flex flex-col flex-1 items-center">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center relative 
                ${view === item.id 
                  ? 'bg-sentinel-purple text-white' 
                  : 'text-gray-500 hover:text-white hover:bg-sentinel-dark'}
              `}
              title={item.name}
            >
              <item.icon className="h-5 w-5" />
              {(item.id === 'autonomous' || item.id === 'tracking') && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-sentinel-purple rounded-full border-2 border-black"></div>
              )}
            </button>
          ))}
        </div>

        <div className="pb-6">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:text-white cursor-pointer">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SidebarNav;
