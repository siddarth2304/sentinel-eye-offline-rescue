
import React, { useState } from "react";
import { useSentinel } from "@/contexts/SentinelContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertTriangle, Shield, Calendar, Clock, ArrowUpRight, X, Filter, Camera, Mic, User, Layers3, Search, CheckCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DroneIcon from "./icons/DroneIcon";

const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert } = useSentinel();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  
  const filteredAlerts = alerts.filter(alert => {
    if (filterType === "acknowledged" && !alert.acknowledged) return false;
    if (filterType === "unacknowledged" && alert.acknowledged) return false;
    
    if (filterType === "threat" && alert.type !== "threat") return false;
    if (filterType === "audio" && alert.type !== "audio") return false;
    if (filterType === "system" && alert.type !== "system") return false;
    
    if (filterLevel && alert.level !== filterLevel) return false;
    
    if (searchText && !alert.message.toLowerCase().includes(searchText.toLowerCase())) return false;
    
    return true;
  });
  
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (a.acknowledged !== b.acknowledged) {
      return a.acknowledged ? 1 : -1;
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
  
  const threatCount = alerts.filter(a => a.type === "threat").length;
  const audioCount = alerts.filter(a => a.type === "audio").length;
  const systemCount = alerts.filter(a => a.type === "system").length;
  
  const criticalCount = alerts.filter(a => a.level === "critical").length;
  const highCount = alerts.filter(a => a.level === "high").length;
  const mediumCount = alerts.filter(a => a.level === "medium").length;
  const lowCount = alerts.filter(a => a.level === "low").length;
  
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
  const acknowledgedCount = alerts.filter(a => a.acknowledged).length;
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Alert Management</h1>
        <p className="text-gray-400">Monitor and respond to system alerts</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Unacknowledged"
          count={unacknowledgedCount}
          icon={<Bell className="h-5 w-5" />}
          color="text-sentinel-purple"
          onClick={() => setFilterType(filterType === "unacknowledged" ? null : "unacknowledged")}
          active={filterType === "unacknowledged"}
        />
        
        <StatCard 
          title="Threats"
          count={threatCount}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="text-sentinel-alert"
          onClick={() => setFilterType(filterType === "threat" ? null : "threat")}
          active={filterType === "threat"}
        />
        
        <StatCard 
          title="Audio Alerts"
          count={audioCount}
          icon={<Mic className="h-5 w-5" />}
          color="text-sentinel-warning"
          onClick={() => setFilterType(filterType === "audio" ? null : "audio")}
          active={filterType === "audio"}
        />
        
        <StatCard 
          title="System Alerts"
          count={systemCount}
          icon={<Shield className="h-5 w-5" />}
          color="text-sentinel-info"
          onClick={() => setFilterType(filterType === "system" ? null : "system")}
          active={filterType === "system"}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card className="bg-sentinel-dark border-sentinel-purple/20 lg:col-span-2 xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Bell className="h-5 w-5 mr-2 text-sentinel-alert" />
              Alerts Log
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search alerts"
                  className="pl-9 h-9 w-48 rounded-md bg-sentinel-dark border border-sentinel-purple/20 text-sm focus:outline-none focus:ring-1 focus:ring-sentinel-purple"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="relative">
                <button 
                  className="h-9 px-3 rounded-md bg-sentinel-dark border border-sentinel-purple/20 text-sm flex items-center"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </button>
                {/* Filter dropdown could go here */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
              {sortedAlerts.length > 0 ? (
                sortedAlerts.map(alert => (
                  <AlertItem key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Bell className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  No alerts match your search criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardHeader>
              <CardTitle className="text-lg">Alert Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <FilterButton 
                  label="Critical"
                  count={criticalCount}
                  color="bg-sentinel-alert text-white"
                  onClick={() => setFilterLevel(filterLevel === "critical" ? null : "critical")}
                  active={filterLevel === "critical"}
                />
                
                <FilterButton 
                  label="High"
                  count={highCount}
                  color="bg-sentinel-warning text-black"
                  onClick={() => setFilterLevel(filterLevel === "high" ? null : "high")}
                  active={filterLevel === "high"}
                />
                
                <FilterButton 
                  label="Medium"
                  count={mediumCount}
                  color="bg-sentinel-info text-black"
                  onClick={() => setFilterLevel(filterLevel === "medium" ? null : "medium")}
                  active={filterLevel === "medium"}
                />
                
                <FilterButton 
                  label="Low"
                  count={lowCount}
                  color="bg-sentinel-purple/50 text-white"
                  onClick={() => setFilterLevel(filterLevel === "low" ? null : "low")}
                  active={filterLevel === "low"}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardHeader>
              <CardTitle className="text-lg">Alert Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <FilterButton 
                  label="Unacknowledged"
                  count={unacknowledgedCount}
                  color="bg-sentinel-purple text-white"
                  onClick={() => setFilterType(filterType === "unacknowledged" ? null : "unacknowledged")}
                  active={filterType === "unacknowledged"}
                />
                
                <FilterButton 
                  label="Acknowledged"
                  count={acknowledgedCount}
                  color="bg-gray-600 text-white"
                  onClick={() => setFilterType(filterType === "acknowledged" ? null : "acknowledged")}
                  active={filterType === "acknowledged"}
                />
              </div>
              
              {unacknowledgedCount > 0 && (
                <div className="mt-4">
                  <button className="w-full bg-sentinel-purple/20 hover:bg-sentinel-purple/30 text-sentinel-purple py-2 rounded-md text-sm">
                    Acknowledge All ({unacknowledgedCount})
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {criticalCount + highCount > 0 && (
            <Card className="bg-sentinel-alert/10 border-sentinel-alert">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-sentinel-alert mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-sentinel-alert">Critical Situation</h3>
                    <p className="text-sm text-white mt-1">
                      {criticalCount} critical and {highCount} high priority alerts require immediate attention.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  active?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, color, onClick, active = false }) => {
  return (
    <Card 
      className={`bg-sentinel-dark border-sentinel-purple/20 cursor-pointer transition-all hover:bg-sentinel-purple/5 ${active ? 'bg-sentinel-purple/10 border-sentinel-purple' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold mt-1">{count}</p>
          </div>
          <div className={`rounded-full p-2 ${color.replace('text-', 'bg-')}/20`}>
            <span className={color}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface FilterButtonProps {
  label: string;
  count: number;
  color: string;
  onClick: () => void;
  active?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, count, color, onClick, active = false }) => {
  return (
    <button 
      className={`w-full flex justify-between items-center p-2 rounded-md transition-all ${
        active 
          ? 'bg-sentinel-purple/20 border border-sentinel-purple' 
          : 'bg-sentinel-dark/50 border border-transparent hover:bg-sentinel-dark'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full ${color.split(' ')[0]} mr-2`}></div>
        <span className="text-sm">{label}</span>
      </div>
      <Badge variant="outline" className="text-xs">
        {count}
      </Badge>
    </button>
  );
};

interface AlertItemProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onAcknowledge }) => {
  const getAlertBgColor = () => {
    if (alert.acknowledged) {
      return "bg-gray-800/30 border-gray-700";
    }
    
    switch (alert.level) {
      case "critical":
        return "bg-sentinel-alert/10 border-sentinel-alert/30";
      case "high":
        return "bg-sentinel-warning/10 border-sentinel-warning/30";
      case "medium":
        return "bg-sentinel-info/10 border-sentinel-info/30";
      default:
        return "bg-sentinel-purple/10 border-sentinel-purple/30";
    }
  };
  
  const getAlertTextColor = () => {
    if (alert.acknowledged) {
      return "text-gray-400";
    }
    
    switch (alert.level) {
      case "critical":
        return "text-sentinel-alert";
      case "high":
        return "text-sentinel-warning";
      case "medium":
        return "text-sentinel-info";
      default:
        return "text-sentinel-purple";
    }
  };
  
  const getAlertIcon = () => {
    switch (alert.type) {
      case "threat":
        return <AlertTriangle className={`h-5 w-5 ${getAlertTextColor()}`} />;
      case "audio":
        return <Mic className={`h-5 w-5 ${getAlertTextColor()}`} />;
      case "movement":
        return <MapPin className={`h-5 w-5 ${getAlertTextColor()}`} />;
      default:
        return <Shield className={`h-5 w-5 ${getAlertTextColor()}`} />;
    }
  };
  
  const getSourceIcon = () => {
    if (!alert.deviceId) return null;
    
    if (alert.deviceId.startsWith('cam')) {
      return <Camera className="h-3 w-3 mr-1" />;
    } else if (alert.deviceId.startsWith('audio')) {
      return <Mic className="h-3 w-3 mr-1" />;
    } else if (alert.deviceId.startsWith('drone')) {
      return <DroneIcon className="h-3 w-3 mr-1" />;
    }
    return null;
  };

  return (
    <div className={`p-3 rounded-md border ${getAlertBgColor()} flex items-start justify-between`}>
      <div className="flex items-start">
        <div className="mt-1 mr-3">
          {getAlertIcon()}
        </div>
        <div>
          <h4 className={`font-medium ${alert.acknowledged ? "text-gray-400" : "text-white"}`}>
            {alert.message}
          </h4>
          <div className="flex flex-wrap items-center text-xs text-gray-400 mt-1 gap-x-2 gap-y-1">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(alert.timestamp)}
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {alert.location?.room?.replace("room", "Room ") || "Unknown"}
            </div>
            
            {alert.deviceId && (
              <div className="flex items-center">
                {getSourceIcon()}
                {alert.deviceId}
              </div>
            )}
            
            <Badge 
              className={`text-xs ${
                alert.acknowledged ? "bg-gray-700" :
                alert.level === "critical" ? "bg-sentinel-alert/20 text-sentinel-alert" :
                alert.level === "high" ? "bg-sentinel-warning/20 text-sentinel-warning" :
                alert.level === "medium" ? "bg-sentinel-info/20 text-sentinel-info" :
                "bg-sentinel-purple/20 text-sentinel-purple"
              }`}
              variant="outline"
            >
              {alert.level}
            </Badge>
          </div>
        </div>
      </div>
      
      {!alert.acknowledged && (
        <button 
          className="flex items-center justify-center h-7 w-7 rounded-md bg-sentinel-dark/50 hover:bg-sentinel-purple/20 text-gray-400 hover:text-sentinel-purple transition-colors"
          onClick={() => onAcknowledge(alert.id)}
          title="Acknowledge alert"
        >
          <CheckCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default AlertsView;
