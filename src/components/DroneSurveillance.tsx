import React, { useState } from "react";
import { useSentinel } from "@/contexts/SentinelContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  MapPin, 
  Wifi, 
  Crosshair, 
  Layers,
  BatteryMedium
} from "lucide-react";
import DroneIcon from "./icons/DroneIcon";
import { Progress } from "@/components/ui/progress";
import { Device } from "@/types/sentinel-types";
import { useToast } from "@/hooks/use-toast";

const DroneSurveillance: React.FC = () => {
  const { devices, detections, setDevices } = useSentinel();
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Filter only drone devices
  const drones = devices.filter(device => device.type === "drone");
  
  // Get the selected drone or the first online drone
  const activeDrone = selectedDrone 
    ? drones.find(drone => drone.id === selectedDrone) 
    : drones.find(drone => drone.status === "online");

  // Get detections for a specific drone
  const getDroneDetections = (droneId: string) => {
    return detections.filter(
      d => d.deviceId === droneId && 
      new Date().getTime() - d.timestamp.getTime() < 30000 // Only show detections from last 30 seconds
    );
  };

  // Get drone's current room name
  const getRoomName = (drone: Device) => {
    if (!drone.location.room) return "Outside Rooms";
    return drone.location.room.replace("room", "Room ");
  };

  // Move drone to specific floor
  const moveDroneToFloor = (floor: number) => {
    if (!activeDrone) return;

    // Update drone location
    setDevices(prevDevices => prevDevices.map(device => {
      if (device.id === activeDrone.id) {
        // Determine a random room on the selected floor
        const roomNumber = Math.floor(Math.random() * 9) + 1;
        const newLocation = {
          ...device.location,
          floor: floor,
          room: `room${roomNumber}`,
          // Adjust x, y, z coordinates
          y: floor * 3, // Height based on floor
          x: 10 + Math.random() * 10, // Random x position
          z: 10 + Math.random() * 10, // Random z position
        };
        
        toast({
          title: "Drone Relocated",
          description: `${device.name} moved to Floor ${floor}, ${newLocation.room.replace("room", "Room ")}`,
          variant: "default"
        });
        
        return { ...device, location: newLocation };
      }
      return device;
    }));
  };

  // Return drone to base
  const returnToBase = () => {
    if (!activeDrone) return;

    setDevices(prevDevices => prevDevices.map(device => {
      if (device.id === activeDrone.id) {
        const newLocation = {
          floor: 1,
          room: "base",
          x: 5,
          y: 0.5,
          z: 5
        };
        
        toast({
          title: "Returning to Base",
          description: `${device.name} is returning to charging station`,
          variant: "default"
        });
        
        return { ...device, location: newLocation, battery: Math.min(100, (device.battery || 0) + 20) };
      }
      return device;
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Drone Surveillance</h1>
        <p className="text-gray-400">Aerial surveillance and monitoring</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium flex items-center">
              <DroneIcon className="h-5 w-5 mr-2 text-sentinel-purple" />
              {activeDrone ? activeDrone.name : "No Drone Selected"}
            </h2>
            <Badge 
              variant="outline" 
              className={
                !activeDrone ? "bg-gray-700 text-gray-300" :
                activeDrone.status === "online" ? "bg-green-500/20 text-green-400" :
                activeDrone.status === "compromised" ? "bg-sentinel-warning/20 text-sentinel-warning" :
                "bg-sentinel-alert/20 text-sentinel-alert"
              }
            >
              {!activeDrone ? "No Drone" : activeDrone.status}
            </Badge>
          </div>
          
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-sentinel-dark">
            {activeDrone ? (
              <div className="relative h-full">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YWVyaWFsJTIwdmlld3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60")`,
                    filter: "grayscale(1) contrast(1.1) brightness(0.9)"
                  }}
                />
                
                <div className="absolute top-0 left-0 right-0 flex justify-between p-4">
                  <div>
                    <div className="text-xs text-sentinel-purple-light font-mono">
                      ID: {activeDrone.id}
                    </div>
                    <div className="text-xs text-sentinel-purple-light font-mono">
                      LOC: {getRoomName(activeDrone)} | FL:{activeDrone.location.floor}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-red-400 font-mono flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-1"></span>
                      LIVE
                    </div>
                    <div className="text-xs text-sentinel-purple-light font-mono">
                      ALT: {Math.round(activeDrone.location.y * 100)}ft
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-0.5 bg-sentinel-purple/50"></div>
                  <div className="absolute top-1/4 right-8 bottom-1/4 w-1.5 flex flex-col">
                    <div className="flex-1 bg-gradient-to-b from-sentinel-purple/80 to-sentinel-purple/20 rounded"></div>
                    <div 
                      className="absolute w-8 h-0.5 bg-white right-2"
                      style={{ top: `${100 - Math.min(100, activeDrone.location.y / 0.09 * 100)}%` }}
                    ></div>
                  </div>
                  <div className="absolute top-8 left-8 flex items-center">
                    <BatteryMedium className="h-4 w-4 text-sentinel-purple mr-1" />
                    <div className="w-20 h-1.5 bg-black/60 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          (activeDrone.battery || 0) > 50 ? "bg-green-500" : 
                          (activeDrone.battery || 0) > 20 ? "bg-sentinel-warning" : 
                          "bg-sentinel-alert"
                        }`}
                        style={{ width: `${activeDrone.battery || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="60" cy="60" r="58" stroke="#9b87f5" strokeWidth="1" strokeOpacity="0.4" />
                      <circle cx="60" cy="60" r="30" stroke="#9b87f5" strokeWidth="1" strokeOpacity="0.6" />
                      <line x1="60" y1="30" x2="60" y2="50" stroke="#9b87f5" strokeWidth="1" />
                      <line x1="60" y1="70" x2="60" y2="90" stroke="#9b87f5" strokeWidth="1" />
                      <line x1="30" y1="60" x2="50" y2="60" stroke="#9b87f5" strokeWidth="1" />
                      <line x1="70" y1="60" x2="90" y2="60" stroke="#9b87f5" strokeWidth="1" />
                    </svg>
                  </div>
                  <div className="absolute left-8 bottom-8 text-xs font-mono text-sentinel-purple-light">
                    <div>SPD: {Math.round(Math.random() * 30 + 10)} KM/H</div>
                    <div>DIS: {Math.round(Math.random() * 100 + 50)}M</div>
                    <div>SIG: {Math.round(Math.random() * 30 + 70)}%</div>
                  </div>
                </div>
                
                {getDroneDetections(activeDrone.id).map((detection) => {
                  const top = 20 + Math.random() * 50;
                  const left = 20 + Math.random() * 60;
                  const width = 60 + Math.random() * 40;
                  const height = 60 + Math.random() * 40;
                  
                  const isThreat = detection.type === "weapon" || 
                    (detection.type === "person" && detection.details?.suspected_threat);
                  
                  return (
                    <div 
                      key={detection.id}
                      className={`absolute border-2 ${isThreat ? "border-sentinel-alert" : "border-green-400"}`}
                      style={{
                        top: `${top}px`,
                        left: `${left}px`,
                        width: `${width}px`,
                        height: `${height}px`
                      }}
                    >
                      <div 
                        className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-mono
                          ${isThreat ? "bg-sentinel-alert text-white" : "bg-green-400 text-black"}`}
                      >
                        {detection.type.toUpperCase()} {Math.round(detection.confidence * 100)}%
                      </div>
                    </div>
                  );
                })}
                
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="w-full h-0.5 bg-sentinel-purple/50 opacity-70 animate-scan"
                    style={{
                      animation: "scanline 2s linear infinite",
                      boxShadow: "0 0 10px rgba(155, 135, 245, 0.7)"
                    }}
                  />
                </div>
                
                <style>
                  {`
                  @keyframes scanline {
                    0% {
                      transform: translateY(0);
                    }
                    100% {
                      transform: translateY(100vh);
                    }
                  }
                  `}
                </style>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <DroneIcon className="h-16 w-16 text-gray-600 mb-4" />
                <div className="text-xl font-bold text-gray-400">No Drone Selected</div>
                <div className="text-sm text-gray-500 mt-2">Select a drone from the list to view the feed</div>
              </div>
            )}
          </div>
          
          {activeDrone && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-sentinel-dark border-sentinel-purple/20">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Battery Status</div>
                  <div className="flex items-center mt-1">
                    <BatteryMedium className="h-4 w-4 mr-1 text-sentinel-info" />
                    <Progress 
                      value={activeDrone.battery || 0} 
                      className="mr-2" 
                    />
                    <span className={`text-sm font-medium ${
                      (activeDrone.battery || 0) > 50 
                        ? "text-green-500" 
                        : (activeDrone.battery || 0) > 20 
                        ? "text-sentinel-warning" 
                        : "text-sentinel-alert"
                    }`}>
                      {activeDrone.battery || 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-sentinel-dark border-sentinel-purple/20">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Current Location</div>
                  <div className="text-sm font-medium mt-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-sentinel-info" />
                    {getRoomName(activeDrone)}, Floor {activeDrone.location.floor}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-sentinel-dark border-sentinel-purple/20">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Signal Strength</div>
                  <div className="flex items-center mt-1">
                    <Wifi className="h-4 w-4 mr-1 text-sentinel-info" />
                    <Progress 
                      value={80 + Math.random() * 20} 
                      className="mr-2" 
                    />
                    <span className="text-sm font-medium">
                      {Math.round(80 + Math.random() * 20)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-sentinel-dark border-sentinel-purple/20">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Detections</div>
                  <div className="text-lg font-medium mt-1 flex items-center">
                    <Crosshair className="h-4 w-4 mr-1 text-sentinel-info" />
                    {getDroneDetections(activeDrone.id).length}
                    {getDroneDetections(activeDrone.id).some(
                      d => d.type === "weapon" || 
                      (d.type === "person" && d.details?.suspected_threat)
                    ) && (
                      <AlertTriangle className="h-4 w-4 ml-2 text-sentinel-alert" />  
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeDrone && (
            <Card className="bg-sentinel-dark border-sentinel-purple/20">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-2">Drone Controls</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button 
                    onClick={() => moveDroneToFloor(1)}
                    className="bg-sentinel-purple/20 text-sentinel-purple hover:bg-sentinel-purple/30 p-2 rounded-md text-sm transition-colors"
                  >
                    Move to Floor 1
                  </button>
                  <button 
                    onClick={() => moveDroneToFloor(2)}
                    className="bg-sentinel-purple/20 text-sentinel-purple hover:bg-sentinel-purple/30 p-2 rounded-md text-sm transition-colors"
                  >
                    Move to Floor 2
                  </button>
                  <button 
                    onClick={() => moveDroneToFloor(3)}
                    className="bg-sentinel-purple/20 text-sentinel-purple hover:bg-sentinel-purple/30 p-2 rounded-md text-sm transition-colors"
                  >
                    Move to Floor 3
                  </button>
                  <button 
                    onClick={returnToBase}
                    className="bg-sentinel-alert/20 text-sentinel-alert hover:bg-sentinel-alert/30 p-2 rounded-md text-sm transition-colors"
                  >
                    Return to Base
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-sentinel-purple" />
                All Drones
              </h3>
              <div className="space-y-2">
                {drones.map(drone => (
                  <div 
                    key={drone.id}
                    className={`p-3 rounded-md cursor-pointer flex items-center justify-between border
                      ${drone.id === activeDrone?.id
                        ? "border-sentinel-purple bg-sentinel-purple/10" 
                        : "border-transparent hover:bg-sentinel-dark"
                      }`}
                    onClick={() => setSelectedDrone(drone.id)}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <div className="h-10 w-10 bg-sentinel-dark/50 rounded-full flex items-center justify-center">
                          <DroneIcon className={`h-5 w-5 ${
                            drone.status === "online" 
                              ? "text-sentinel-purple" 
                              : "text-sentinel-alert"
                          }`} />
                        </div>
                        <span 
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-sentinel-dark
                            ${drone.status === "online"
                              ? "bg-green-500" 
                              : drone.status === "compromised"
                              ? "bg-sentinel-warning"
                              : "bg-sentinel-alert"
                            }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{drone.name}</div>
                        <div className="flex items-center text-xs text-gray-400">
                          <span>{Math.round(drone.battery || 0)}%</span>
                          <span className="mx-1">•</span>
                          <span>Floor {drone.location.floor}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      {drone.status === "online" && getDroneDetections(drone.id).length > 0 && (
                        <Badge 
                          className={`
                            ${getDroneDetections(drone.id).some(
                              d => d.type === "weapon" || 
                              (d.type === "person" && d.details?.suspected_threat)
                            )
                              ? "bg-sentinel-alert/20 text-sentinel-alert" 
                              : "bg-green-500/20 text-green-400"
                            }
                          `}
                        >
                          {getDroneDetections(drone.id).length} detected
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Coverage Map</h3>
                <div className="bg-sentinel-dark/50 p-3 rounded-md">
                  <div className="aspect-square relative rounded-md overflow-hidden border border-sentinel-dark">
                    <div 
                      className="w-full h-full bg-cover bg-center opacity-50"
                      style={{ 
                        backgroundImage: `url("https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60")` 
                      }}
                    />
                    <div className="absolute inset-0 bg-sentinel-dark/80"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/4 h-3/4 border border-sentinel-purple/60 relative">
                        {drones.map(drone => (
                          <div 
                            key={drone.id}
                            className={`absolute h-3 w-3 rounded-full border-2 
                              ${drone.id === activeDrone?.id
                                ? "border-white bg-sentinel-purple" 
                                : "border-sentinel-purple/60 bg-sentinel-dark"
                              }`}
                            style={{ 
                              left: `${(drone.location.x / 30) * 100}%`, 
                              top: `${(drone.location.z / 30) * 100}%`,
                              transform: "translate(-50%, -50%)"
                            }}
                          >
                            {drone.id === activeDrone?.id && (
                              <div className="absolute inset-0 rounded-full animate-ping bg-sentinel-purple opacity-75"></div>
                            )}
                          </div>
                        ))}
                        
                        {drones.filter(d => d.status === "online").map(drone => (
                          <div 
                            key={`coverage-${drone.id}`}
                            className="absolute rounded-full border border-sentinel-purple/30 bg-sentinel-purple/10"
                            style={{ 
                              left: `${(drone.location.x / 30) * 100}%`, 
                              top: `${(drone.location.z / 30) * 100}%`,
                              width: "100px",
                              height: "100px",
                              transform: "translate(-50%, -50%)"
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DroneSurveillance;
