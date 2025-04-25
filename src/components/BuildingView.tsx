import React, { useState, useEffect } from "react";
import { useSentinel } from "@/contexts/SentinelContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers3, Camera, Mic, User, AlertTriangle, Search, Move, Plus, Minus, RotateCcw, User2 } from "lucide-react";
import DroneIcon from "./icons/DroneIcon";

const BuildingView: React.FC = () => {
  const { devices, detections, alerts, selectedFloor, setSelectedFloor } = useSentinel();
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  
  const floors = [1, 2, 3];
  
  // Filter devices by floor
  const floorDevices = devices.filter(device => device.location.floor === selectedFloor);
  
  // Filter detections by floor and recent timeframe
  const floorDetections = detections.filter(
    d => {
      const device = devices.find(dev => dev.id === d.deviceId);
      return device?.location.floor === selectedFloor && 
        new Date().getTime() - d.timestamp.getTime() < 60000; // Only show detections from last minute
    }
  );
  
  // Filter alerts by floor and unacknowledged status
  const floorAlerts = alerts.filter(
    a => {
      const device = devices.find(dev => dev.id === a.deviceId);
      return device?.location.floor === selectedFloor && !a.acknowledged;
    }
  );
  
  // Calculate people and threats on this floor
  const peopleCount = floorDetections.filter(d => d.type === "person").length;
  const threatCount = floorDetections.filter(
    d => d.type === "weapon" || (d.type === "person" && d.details?.suspected_threat)
  ).length;
  
  const roomNames = {
    "room1": "Main Entrance",
    "room2": "Lobby",
    "room3": "Office A",
    "room4": "Meeting Room 1",
    "room5": "Hallway",
    "room6": "Office B",
    "room7": "Executive Room",
    "room8": "Storage",
    "room9": "Meeting Room 2",
    "room10": "Server Room",
    "room11": "Security Room",
    "room12": "Roof Access",
  };

  // Helper function to get room color based on alerts and detections
  const getRoomColor = (roomId: string) => {
    // Check if any critical alerts in this room
    const hasCriticalAlert = floorAlerts.some(
      a => a.location?.room === roomId && 
      (a.level === "critical" || a.level === "high")
    );
    
    if (hasCriticalAlert) return "bg-sentinel-alert/30 border-sentinel-alert";
    
    // Check for threats
    const hasThreats = floorDetections.some(
      d => d.location.room === roomId && 
      (d.type === "weapon" || (d.type === "person" && d.details?.suspected_threat))
    );
    
    if (hasThreats) return "bg-sentinel-warning/30 border-sentinel-warning";
    
    // Check for people
    const hasPeople = floorDetections.some(
      d => d.location.room === roomId && d.type === "person"
    );
    
    if (hasPeople) return "bg-sentinel-purple/30 border-sentinel-purple";
    
    //Check if room has device
    const hasDevice = floorDevices.some(
      d => d.location.room === roomId
    );
    
    if (hasDevice) return "bg-sentinel-info/10 border-sentinel-info/30";
    
    // Default
    return "bg-sentinel-dark/50 border-gray-700";
  };

  // Function to position elements on the floor plan
  const positionOnFloorPlan = (x: number, y: number, totalWidth: number, totalHeight: number) => {
    const xPercent = (x / 30) * 100;
    const yPercent = (y / 30) * 100;
    return { left: `${xPercent}%`, top: `${yPercent}%` };
  };
  
  // Determine rooms for this floor
  const floorRooms = [
    // Floor 1
    selectedFloor === 1 ? [
      { id: "room1", name: "Main Entrance", x1: 0, z1: 0, x2: 10, z2: 10 },
      { id: "room2", name: "Lobby", x1: 10, z1: 0, x2: 30, z2: 20 },
      { id: "room3", name: "Office A", x1: 0, z1: 10, x2: 10, z2: 20 },
      { id: "room4", name: "Meeting Room 1", x1: 10, z1: 20, x2: 20, z2: 30 },
      { id: "room5", name: "Hallway", x1: 20, z1: 0, x2: 30, z2: 30 }
    ] : [],
    
    // Floor 2
    selectedFloor === 2 ? [
      { id: "room6", name: "Office B", x1: 0, z1: 0, x2: 15, z2: 15 },
      { id: "room7", name: "Executive Room", x1: 15, z1: 0, x2: 30, z2: 15 },
      { id: "room8", name: "Storage", x1: 0, z1: 15, x2: 10, z2: 30 },
      { id: "room9", name: "Meeting Room 2", x1: 10, z1: 15, x2: 30, z2: 30 }
    ] : [],
    
    // Floor 3
    selectedFloor === 3 ? [
      { id: "room10", name: "Server Room", x1: 0, z1: 0, x2: 15, z2: 15 },
      { id: "room11", name: "Security Room", x1: 15, z1: 0, x2: 30, z2: 30 },
      { id: "room12", name: "Roof Access", x1: 0, z1: 15, x2: 15, z2: 30 }
    ] : []
  ].flat();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Building Overview</h1>
        <p className="text-gray-400">3D visualization and floor plans</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-sentinel-dark border-sentinel-purple/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Floor</div>
              <div className="text-2xl font-bold">{selectedFloor}</div>
            </div>
            <div className="flex space-x-2">
              {floors.map(floor => (
                <button 
                  key={floor} 
                  className={`h-10 w-10 rounded-md flex items-center justify-center ${
                    selectedFloor === floor 
                      ? "bg-sentinel-purple text-white" 
                      : "bg-sentinel-dark/50 text-gray-400 hover:bg-sentinel-purple/20"
                  }`}
                  onClick={() => setSelectedFloor(floor)}
                >
                  {floor}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-sentinel-dark border-sentinel-purple/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Devices</div>
              <div className="text-2xl font-bold">{floorDevices.length}</div>
            </div>
            <div className="flex space-x-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <Camera className="h-4 w-4 text-sentinel-purple mr-1" />
                  <span>{floorDevices.filter(d => d.type === "camera").length}</span>
                </div>
                <span className="text-xs text-gray-400">Cameras</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <Mic className="h-4 w-4 text-sentinel-info mr-1" />
                  <span>{floorDevices.filter(d => d.type === "audio").length}</span>
                </div>
                <span className="text-xs text-gray-400">Audio</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <DroneIcon className="h-4 w-4 text-sentinel-warning mr-1" />
                  <span>{floorDevices.filter(d => d.type === "drone").length}</span>
                </div>
                <span className="text-xs text-gray-400">Drones</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-sentinel-dark border-sentinel-purple/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">People</div>
              <div className="text-2xl font-bold">{peopleCount}</div>
            </div>
            <div className="flex space-x-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-green-500 mr-1" />
                  <span>{peopleCount - threatCount}</span>
                </div>
                <span className="text-xs text-gray-400">Safe</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-sentinel-alert mr-1" />
                  <span>{threatCount}</span>
                </div>
                <span className="text-xs text-gray-400">Threats</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-sentinel-dark border-sentinel-purple/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Alerts</div>
              <div className="text-2xl font-bold">{floorAlerts.length}</div>
            </div>
            <div className="flex space-x-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full bg-sentinel-alert mr-1`}></span>
                  <span>{floorAlerts.filter(a => a.level === "critical" || a.level === "high").length}</span>
                </div>
                <span className="text-xs text-gray-400">Critical</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full bg-sentinel-warning mr-1`}></span>
                  <span>{floorAlerts.filter(a => a.level === "medium").length}</span>
                </div>
                <span className="text-xs text-gray-400">Medium</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full bg-sentinel-purple mr-1`}></span>
                  <span>{floorAlerts.filter(a => a.level === "low").length}</span>
                </div>
                <span className="text-xs text-gray-400">Low</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Building visualization */}
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Layers3 className="h-5 w-5 mr-2 text-sentinel-purple" />
                  Floor {selectedFloor} Layout
                </h3>
                <div className="flex items-center space-x-2">
                  <button 
                    className="h-8 w-8 flex items-center justify-center rounded-md bg-sentinel-dark/50 text-gray-400 hover:bg-sentinel-purple/20"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    disabled={zoom <= 0.5}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <button 
                    className="h-8 w-8 flex items-center justify-center rounded-md bg-sentinel-dark/50 text-gray-400 hover:bg-sentinel-purple/20"
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    disabled={zoom >= 2}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  
                  <button 
                    className="h-8 w-8 flex items-center justify-center rounded-md bg-sentinel-dark/50 text-gray-400 hover:bg-sentinel-purple/20"
                    onClick={() => setRotation((rotation + 90) % 360)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="relative aspect-square border border-sentinel-dark rounded-md overflow-hidden">
                {/* Building grid and background */}
                <div 
                  className="absolute inset-0 bg-sentinel-dark"
                  style={{
                    backgroundSize: "20px 20px",
                    backgroundImage: `
                      linear-gradient(to right, rgba(155, 135, 245, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(155, 135, 245, 0.05) 1px, transparent 1px)
                    `
                  }}
                />
                
                {/* Floor plan */}
                <div 
                  className="absolute inset-0 transform-gpu"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: "center center",
                    transition: "transform 0.3s ease"
                  }}
                >
                  {/* Rooms */}
                  {floorRooms.map(room => {
                    const width = ((room.x2 - room.x1) / 30) * 100;
                    const height = ((room.z2 - room.z1) / 30) * 100;
                    const left = (room.x1 / 30) * 100;
                    const top = (room.z1 / 30) * 100;
                    
                    return (
                      <div 
                        key={room.id}
                        className={`absolute border ${getRoomColor(room.id)}`}
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          width: `${width}%`,
                          height: `${height}%`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/70">
                          {room.name}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Devices */}
                  {floorDevices.map(device => {
                    const position = positionOnFloorPlan(device.location.x, device.location.z, 30, 30);
                    
                    return (
                      <div 
                        key={device.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: position.left,
                          top: position.top
                        }}
                      >
                        <div 
                          className={`h-4 w-4 rounded-full flex items-center justify-center
                            ${device.status === "online" 
                              ? "bg-sentinel-purple text-white" 
                              : device.status === "compromised"
                              ? "bg-sentinel-warning text-white"
                              : "bg-sentinel-alert text-white"
                            }`}
                          title={`${device.name} (${device.status})`}
                        >
                          {device.type === "camera" && <Camera className="h-2 w-2" />}
                          {device.type === "audio" && <Mic className="h-2 w-2" />}
                          {device.type === "drone" && <DroneIcon className="h-2 w-2" />}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Detections */}
                  {floorDetections
                    .filter(d => d.type === "person")
                    .map(detection => {
                      const position = positionOnFloorPlan(detection.location.x, detection.location.z, 30, 30);
                      const isThreat = detection.details?.suspected_threat === true;
                      
                      return (
                        <div 
                          key={detection.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: position.left,
                            top: position.top
                          }}
                        >
                          <div 
                            className={`h-5 w-5 rounded-full flex items-center justify-center
                              ${isThreat 
                                ? "bg-sentinel-alert text-white animate-pulse" 
                                : "bg-green-500 text-white"
                              }`}
                            title={`Person ${isThreat ? '(Threat)' : ''}`}
                          >
                            <User className="h-3 w-3" />
                          </div>
                        </div>
                      );
                    })}
                  
                  {/* Weapon detections */}
                  {floorDetections
                    .filter(d => d.type === "weapon")
                    .map(detection => {
                      const position = positionOnFloorPlan(detection.location.x, detection.location.z, 30, 30);
                      
                      return (
                        <div 
                          key={detection.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: position.left,
                            top: position.top
                          }}
                        >
                          <div 
                            className="h-5 w-5 rounded-full bg-sentinel-alert text-white animate-pulse flex items-center justify-center"
                            title="Weapon"
                          >
                            <AlertTriangle className="h-3 w-3" />
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                {/* Compass */}
                <div className="absolute top-4 right-4">
                  <div 
                    className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center relative"
                    style={{ transform: `rotate(${-rotation}deg)` }}
                  >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3 w-1 bg-sentinel-alert mr-1"></div>
                    <div className="h-1 w-1 rounded-full bg-white"></div>
                    <div className="absolute text-xs text-white" style={{ top: '2px', left: 'calc(50% + 14px)' }}>E</div>
                    <div className="absolute text-xs text-white" style={{ top: '2px', left: 'calc(50% - 18px)' }}>W</div>
                    <div className="absolute text-xs text-white" style={{ top: 'calc(50% - 18px)', left: 'calc(50% - 3px)' }}>N</div>
                    <div className="absolute text-xs text-white" style={{ top: 'calc(50% + 14px)', left: 'calc(50% - 3px)' }}>S</div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded text-xs">
                  <div className="flex items-center mb-1">
                    <div className="h-3 w-3 rounded-full bg-sentinel-purple mr-2"></div>
                    <span className="text-white">Device</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-white">Person</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-sentinel-alert mr-2"></div>
                    <span className="text-white">Threat</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* 3D Building Preview (simplified visualization) */}
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2 text-sentinel-purple">
                  <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"></path>
                  <path d="M8 2v16"></path>
                  <path d="M16 6v16"></path>
                </svg>
                3D View
              </h3>
              
              <div className="aspect-square relative border border-sentinel-dark rounded-md overflow-hidden bg-gradient-to-b from-sentinel-dark to-black">
                {/* Simple 3D building representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="relative w-3/4 h-3/4 transform-gpu"
                    style={{ 
                      perspective: "800px",
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* Building base */}
                    <div 
                      className="absolute inset-0 border-2 border-sentinel-purple/30 bg-sentinel-dark/50 transform-gpu"
                      style={{ 
                        transform: "translateZ(-20px) rotateX(60deg) rotateZ(-45deg)"
                      }}
                    >
                      {/* Floors */}
                      {[1, 2, 3].map(floor => (
                        <div 
                          key={floor}
                          className={`absolute inset-0 border border-sentinel-purple/30 ${
                            selectedFloor === floor 
                              ? "bg-sentinel-purple/20" 
                              : "bg-transparent"
                          }`}
                          style={{ 
                            transform: `translateZ(${floor * 20}px)`,
                            opacity: selectedFloor === floor ? 1 : 0.3
                          }}
                        />
                      ))}
                      
                      {/* Floor indicators */}
                      {[1, 2, 3].map(floor => (
                        <div 
                          key={`label-${floor}`}
                          className={`absolute text-xs font-bold ${
                            selectedFloor === floor 
                              ? "text-sentinel-purple" 
                              : "text-gray-500"
                          }`}
                          style={{ 
                            left: '5px',
                            bottom: `${(floor - 0.7) * 20}px`, 
                            transform: "rotateX(-60deg) rotateZ(45deg)"
                          }}
                        >
                          F{floor}
                        </div>
                      ))}
                      
                      {/* People/threat indicators */}
                      {peopleCount > 0 && (
                        <div 
                          className="absolute text-xs font-bold text-green-500"
                          style={{ 
                            right: '5px',
                            top: `${(selectedFloor - 0.7) * 20}px`,
                            transform: "rotateX(-60deg) rotateZ(45deg)"
                          }}
                        >
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {peopleCount}
                          </div>
                        </div>
                      )}
                      
                      {threatCount > 0 && (
                        <div 
                          className="absolute text-xs font-bold text-sentinel-alert animate-pulse"
                          style={{ 
                            right: '35px',
                            top: `${(selectedFloor - 0.7) * 20}px`,
                            transform: "rotateX(-60deg) rotateZ(45deg)"
                          }}
                        >
                          <div className="flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {threatCount}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Floor selector */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {floors.map(floor => (
                    <button 
                      key={floor} 
                      className={`h-8 w-8 rounded-md flex items-center justify-center ${
                        selectedFloor === floor 
                          ? "bg-sentinel-purple text-white" 
                          : "bg-black/50 text-gray-400 hover:bg-sentinel-purple/20"
                      }`}
                      onClick={() => setSelectedFloor(floor)}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Room List */}
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3">Rooms on Floor {selectedFloor}</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {floorRooms.map(room => {
                  // Count people and threats in this room
                  const roomPeople = floorDetections.filter(
                    d => d.type === "person" && d.location.room === room.id
                  ).length;
                  
                  const roomThreats = floorDetections.filter(
                    d => d.location.room === room.id && (
                      d.type === "weapon" || 
                      (d.type === "person" && d.details?.suspected_threat)
                    )
                  ).length;
                  
                  const roomDevices = floorDevices.filter(
                    d => d.location.room === room.id
                  ).length;
                  
                  // Determine room status
                  let statusColor = "bg-gray-600";
                  if (roomThreats > 0) {
                    statusColor = "bg-sentinel-alert";
                  } else if (roomPeople > 0) {
                    statusColor = "bg-green-500";
                  } else if (roomDevices > 0) {
                    statusColor = "bg-sentinel-info";
                  }
                  
                  return (
                    <div 
                      key={room.id} 
                      className={`p-3 rounded-md ${
                        roomThreats > 0 
                          ? "bg-sentinel-alert/10 border border-sentinel-alert/30" 
                          : "bg-sentinel-dark/50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className={`h-3 w-3 rounded-full ${statusColor} mr-2`}></span>
                          <span className="font-medium">{room.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Room {room.id.replace("room", "")}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {roomPeople > 0 && (
                          <div className="px-2 py-1 rounded-md bg-sentinel-dark flex items-center text-xs">
                            <User className="h-3 w-3 mr-1 text-green-500" />
                            {roomPeople - roomThreats} safe
                          </div>
                        )}
                        
                        {roomThreats > 0 && (
                          <div className="px-2 py-1 rounded-md bg-sentinel-dark flex items-center text-xs animate-pulse">
                            <AlertTriangle className="h-3 w-3 mr-1 text-sentinel-alert" />
                            {roomThreats} threats
                          </div>
                        )}
                        
                        {roomDevices > 0 && (
                          <div className="px-2 py-1 rounded-md bg-sentinel-dark flex items-center text-xs">
                            <Camera className="h-3 w-3 mr-1 text-sentinel-purple" />
                            {roomDevices} devices
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuildingView;
