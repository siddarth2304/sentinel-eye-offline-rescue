import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { LayoutDashboard, AlertCircle, Camera, Network, Building2 } from "lucide-react";
import DroneIcon from "./icons/DroneIcon";

interface SidebarNavProps {
  view: string;
  setView: (view: string) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ view, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: '3d', label: '3D View', icon: Building2 },
    { id: 'cameras', label: 'Cameras', icon: Camera },
    { id: 'drones', label: 'Drones', icon: DroneIcon },
    { id: 'mesh', label: 'Mesh Network', icon: Network },
    { id: 'alerts', label: 'Alerts', icon: AlertCircle },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-16 flex flex-col bg-sentinel-dark border-r border-sentinel-purple/20">
      <div className="flex-1 flex flex-col py-4">
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "group flex items-center p-3 w-full rounded-md hover:bg-sentinel-purple/20",
                view === item.id ? "bg-sentinel-purple/50" : "text-gray-400"
              )}
              onClick={() => setView(item.id)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SidebarNav;
