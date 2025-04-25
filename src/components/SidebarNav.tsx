
import React from "react";
import { 
  Camera, 
  CameraOff, 
  Drone, 
  Mic, 
  MicOff, 
  Wifi, 
  WifiOff, 
  Bell, 
  LayoutDashboard, 
  Map, 
  Users, 
  ShieldAlert,
  Network,
  Layers3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert } from "@/types/sentinel-types";
import { useSentinel } from "@/contexts/SentinelContext";

interface SidebarNavProps {
  view: string;
  setView: (view: string) => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ view, setView }) => {
  const { alerts } = useSentinel();
  
  // Count unacknowledged alerts
  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;
  
  // Count critical alerts
  const criticalCount = alerts.filter(alert => 
    !alert.acknowledged && 
    (alert.level === "critical" || alert.level === "high")
  ).length;

  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 bg-sentinel-dark flex flex-col items-center py-4 border-r border-sentinel-purple/20">
      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sentinel-purple text-white">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <span className="text-white text-xs mt-2 font-bold">Sentinel</span>
      </div>
      
      <nav className="flex-1 flex flex-col gap-4 w-full">
        <SidebarItem 
          icon={<LayoutDashboard className="h-6 w-6" />} 
          label="Dashboard"
          active={view === "dashboard"}
          onClick={() => setView("dashboard")}
        />
        <SidebarItem 
          icon={<Layers3 className="h-6 w-6" />} 
          label="3D View"
          active={view === "3d"}
          onClick={() => setView("3d")}
        />
        <SidebarItem 
          icon={<Camera className="h-6 w-6" />} 
          label="Cameras"
          active={view === "cameras"}
          onClick={() => setView("cameras")}
        />
        <SidebarItem 
          icon={<Drone className="h-6 w-6" />} 
          label="Drones"
          active={view === "drones"}
          onClick={() => setView("drones")}
        />
        <SidebarItem 
          icon={<Network className="h-6 w-6" />} 
          label="Mesh"
          active={view === "mesh"}
          onClick={() => setView("mesh")}
        />
        <SidebarItem 
          icon={<Bell className="h-6 w-6" />} 
          label="Alerts"
          active={view === "alerts"}
          onClick={() => setView("alerts")}
          badge={unacknowledgedCount > 0 ? unacknowledgedCount : undefined}
          critical={criticalCount > 0}
        />
      </nav>
      
      <div className="mt-auto pt-4 flex flex-col gap-4">
        <SidebarItem 
          icon={<Wifi className="h-5 w-5" />} 
          label="Offline Mode"
          active={true}
          onClick={() => {}}
          small
        />
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
  critical?: boolean;
  small?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  active = false, 
  onClick,
  badge,
  critical = false,
  small = false
}) => {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center w-full py-2 relative",
        active ? "text-sentinel-purple" : "text-gray-400 hover:text-white transition-colors",
        small ? "text-xs" : ""
      )}
      onClick={onClick}
      title={label}
    >
      <div className={cn(
        "relative", 
        active && "bg-sentinel-purple/10 p-2 rounded-md"
      )}>
        {icon}
        {badge !== undefined && (
          <span 
            className={cn(
              "absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full text-xs font-bold",
              critical ? "bg-sentinel-alert text-white animate-pulse-alert" : "bg-sentinel-purple text-white"
            )}
          >
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default SidebarNav;
