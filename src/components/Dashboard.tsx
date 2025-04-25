
import React from "react";
import { useSentinel } from "@/contexts/SentinelContext";
import { Alert, Device } from "@/types/sentinel-types";
import { 
  Camera, 
  CameraOff, 
  Drone, 
  Mic, 
  WifiOff, 
  Bell, 
  Users, 
  AlertTriangle,
  Battery, 
  Clock 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Dashboard: React.FC = () => {
  const { devices, alerts, detections, togglePause, isPaused, simulationSpeed, setSimulationSpeed } = useSentinel();

  const onlineDevices = devices.filter(d => d.status === "online").length;
  const offlineDevices = devices.filter(d => d.status === "offline").length;
  const compromisedDevices = devices.filter(d => d.status === "compromised").length;

  const criticalAlerts = alerts.filter(a => !a.acknowledged && a.level === "critical").length;
  const highAlerts = alerts.filter(a => !a.acknowledged && a.level === "high").length;
  const mediumAlerts = alerts.filter(a => !a.acknowledged && a.level === "medium").length;

  const peopleDetected = detections.filter(d => d.type === "person").length;
  const threatsDetected = detections.filter(d => 
    d.type === "weapon" || 
    (d.type === "person" && d.details?.suspected_threat === true)
  ).length;

  const latestAlerts = alerts
    .filter(a => !a.acknowledged)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Sentinel Eye Dashboard</h1>
          <p className="text-gray-400">Offline Surveillance and Rescue System</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-sentinel-dark/50 rounded-md p-2">
            <span className="text-sm text-gray-400 mr-2">Simulation Speed:</span>
            <div className="flex space-x-2">
              {[0.5, 1, 2, 5].map(speed => (
                <button
                  key={speed}
                  className={`px-2 py-1 rounded text-xs ${
                    simulationSpeed === speed
                      ? "bg-sentinel-purple text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  onClick={() => setSimulationSpeed(speed)}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
          <button
            className={`flex items-center justify-center h-10 w-10 rounded-md ${
              isPaused
                ? "bg-sentinel-warning text-white"
                : "bg-sentinel-purple/90 text-white"
            }`}
            onClick={togglePause}
          >
            {isPaused ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-sentinel-dark border-sentinel-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                <Camera className="h-4 w-4 text-sentinel-info" />
              </div>
              Device Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onlineDevices} <span className="text-sm text-sentinel-info">Online</span></div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm">
                <span className="text-amber-500">{compromisedDevices}</span> Compromised
              </div>
              <div className="text-sm">
                <span className="text-sentinel-alert">{offlineDevices}</span> Offline  
              </div>
            </div>
            <Progress className="mt-2" value={(onlineDevices / devices.length) * 100} />
          </CardContent>
        </Card>

        <Card className="bg-sentinel-dark border-sentinel-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center mr-2">
                <Bell className="h-4 w-4 text-sentinel-alert" />
              </div>
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {criticalAlerts + highAlerts + mediumAlerts}
              <span className="text-sm text-sentinel-alert ml-2">Unacknowledged</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="flex flex-col items-center p-1 rounded bg-sentinel-alert/20">
                <span className="text-lg font-bold text-sentinel-alert">{criticalAlerts}</span>
                <span className="text-xs">Critical</span>
              </div>
              <div className="flex flex-col items-center p-1 rounded bg-sentinel-warning/20">
                <span className="text-lg font-bold text-sentinel-warning">{highAlerts}</span>
                <span className="text-xs">High</span>
              </div>
              <div className="flex flex-col items-center p-1 rounded bg-sentinel-info/20">
                <span className="text-lg font-bold text-sentinel-info">{mediumAlerts}</span>
                <span className="text-xs">Medium</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sentinel-dark border-sentinel-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                <Users className="h-4 w-4 text-sentinel-info" />
              </div>
              People Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {peopleDetected}
              <span className="text-sm text-gray-400 ml-2">Total</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div>
                <div className="text-sm">
                  <span className="text-sentinel-alert">{threatsDetected}</span> Potential Threats
                </div>
                <div className="text-sm">
                  <span className="text-sentinel-purple">{peopleDetected - threatsDetected}</span> Hostages/Civilians
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-sentinel-purple/20 flex items-center justify-center">
                <AlertTriangle className={`h-5 w-5 ${threatsDetected > 0 ? "text-sentinel-alert animate-pulse" : "text-sentinel-purple"}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sentinel-dark border-sentinel-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
                <Drone className="h-4 w-4 text-sentinel-purple" />
              </div>
              Drone Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {devices
              .filter(d => d.type === "drone")
              .map((drone, index) => (
                <div key={drone.id} className={`${index > 0 ? "mt-2" : ""} flex items-center justify-between`}>
                  <div>
                    <div className="font-medium">{drone.name}</div>
                    <div className="text-xs text-gray-400">
                      {drone.location.room 
                        ? `In ${drone.location.room.replace("room", "Room ")}` 
                        : `Floor ${drone.location.floor}`}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Battery className="h-4 w-4 mr-1 text-gray-400" />
                    <span className={`text-sm ${
                      (drone.battery || 0) > 50 
                        ? "text-green-500" 
                        : (drone.battery || 0) > 20 
                        ? "text-sentinel-warning" 
                        : "text-sentinel-alert"
                    }`}>
                      {drone.battery}%
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-sentinel-dark border-sentinel-purple/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Bell className="h-5 w-5 mr-2 text-sentinel-alert" />
              Latest Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestAlerts.length > 0 ? (
                latestAlerts.map(alert => (
                  <AlertItem key={alert.id} alert={alert} />
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No unacknowledged alerts
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sentinel-dark border-sentinel-purple/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Camera className="h-5 w-5 mr-2 text-sentinel-info" />
              Device Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['camera', 'audio', 'drone'].map(type => {
              const typeDevices = devices.filter(d => d.type === type);
              const onlineCount = typeDevices.filter(d => d.status === "online").length;
              const totalCount = typeDevices.length;
              
              return (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      {type === 'camera' && <Camera className="h-4 w-4 mr-2" />}
                      {type === 'audio' && <Mic className="h-4 w-4 mr-2" />}
                      {type === 'drone' && <Drone className="h-4 w-4 mr-2" />}
                      <span className="capitalize">{type}s</span>
                    </div>
                    <span>
                      <span className={onlineCount === totalCount ? "text-green-500" : "text-sentinel-warning"}>
                        {onlineCount}
                      </span>
                      /{totalCount}
                    </span>
                  </div>
                  <Progress value={(onlineCount / totalCount) * 100} className="h-2" />
                </div>
              );
            })}
            
            {/* Offline Devices List */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <WifiOff className="h-4 w-4 mr-1 text-sentinel-alert" />
                Offline/Compromised Devices
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {devices
                  .filter(d => d.status !== "online")
                  .map(device => (
                    <div key={device.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        {device.type === 'camera' && 
                          <CameraOff className="h-3.5 w-3.5 mr-1.5 text-sentinel-alert" />}
                        {device.type === 'audio' && 
                          <Mic className="h-3.5 w-3.5 mr-1.5 text-sentinel-alert" />}
                        {device.type === 'drone' && 
                          <Drone className="h-3.5 w-3.5 mr-1.5 text-sentinel-alert" />}
                        <span className="truncate max-w-[120px]">{device.name}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          device.status === "compromised" 
                            ? "border-sentinel-warning text-sentinel-warning" 
                            : "border-sentinel-alert text-sentinel-alert"
                        }`}
                      >
                        {device.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const { acknowledgeAlert } = useSentinel();
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  const getAlertBgColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-sentinel-alert/10 border-l-4 border-sentinel-alert";
      case "high":
        return "bg-sentinel-warning/10 border-l-4 border-sentinel-warning";
      case "medium":
        return "bg-sentinel-info/10 border-l-4 border-sentinel-info";
      default:
        return "bg-sentinel-purple/10 border-l-4 border-sentinel-purple";
    }
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "threat":
        return <AlertTriangle className="h-5 w-5 text-sentinel-alert" />;
      case "audio":
        return <Mic className="h-5 w-5 text-sentinel-warning" />;
      case "system":
        return <WifiOff className="h-5 w-5 text-sentinel-info" />;
      default:
        return <Bell className="h-5 w-5 text-sentinel-info" />;
    }
  };
  
  return (
    <div className={`${getAlertBgColor(alert.level)} p-3 rounded-md flex items-start justify-between`}>
      <div className="flex items-start">
        <div className="mt-1 mr-3">
          {getAlertIcon(alert.type)}
        </div>
        <div>
          <h4 className={`font-medium ${
            alert.level === "critical" 
              ? "text-sentinel-alert" 
              : alert.level === "high" 
              ? "text-sentinel-warning" 
              : "text-white"
          }`}>
            {alert.message}
          </h4>
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(alert.timestamp)}
            <span className="mx-1">•</span>
            <Badge className="text-xs capitalize" variant="outline">
              {alert.level}
            </Badge>
          </div>
        </div>
      </div>
      <button 
        className="flex items-center justify-center h-6 w-6 rounded-full hover:bg-white/10 text-gray-400"
        onClick={() => acknowledgeAlert(alert.id)}
        title="Acknowledge alert"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default Dashboard;
