
import React, { useState } from "react";
import { useSentinel } from "@/contexts/SentinelContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, User, AlertTriangle, Crosshair } from "lucide-react";

const CameraFeeds: React.FC = () => {
  const { devices, detections } = useSentinel();
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  
  // Filter only camera devices
  const cameras = devices.filter(device => device.type === "camera");
  
  // Get the selected camera or the first online camera
  const activeCamera = selectedCamera 
    ? cameras.find(cam => cam.id === selectedCamera) 
    : cameras.find(cam => cam.status === "online");
  
  // Function to get random static noise pattern
  const getNoisePattern = (seed: number) => {
    const patternId = `noise-${seed}`;
    return (
      <div className="absolute inset-0 bg-black opacity-20"
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
           }}
      />
    );
  };

  // Get detections for a specific camera
  const getCameraDetections = (cameraId: string) => {
    return detections.filter(
      d => d.deviceId === cameraId && 
      new Date().getTime() - d.timestamp.getTime() < 30000 // Only show detections from last 30 seconds
    );
  };

  // Determine if we should show camera feed or offline message
  const showCameraFeed = (camera: typeof cameras[0]) => {
    return camera.status === "online";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Camera Surveillance</h1>
        <p className="text-gray-400">Live and offline camera feeds from the building</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Camera Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium flex items-center">
              <Camera className="h-5 w-5 mr-2 text-sentinel-info" />
              {activeCamera ? activeCamera.name : "No Camera Selected"}
            </h2>
            <Badge 
              variant="outline" 
              className={
                !activeCamera ? "bg-gray-700 text-gray-300" :
                activeCamera.status === "online" ? "bg-green-500/20 text-green-400" :
                activeCamera.status === "compromised" ? "bg-sentinel-warning/20 text-sentinel-warning" :
                "bg-sentinel-alert/20 text-sentinel-alert"
              }
            >
              {!activeCamera ? "No Camera" : activeCamera.status}
            </Badge>
          </div>
          
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-sentinel-dark">
            {activeCamera ? (
              showCameraFeed(activeCamera) ? (
                <div className="relative h-full">
                  {/* Simulated camera feed with room background */}
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url("https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwc3BhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60")`,
                      filter: "grayscale(1) contrast(1.2) brightness(0.8)"
                    }}
                  />
                  
                  {/* Camera UI overlay */}
                  <div className="absolute top-0 left-0 right-0 flex justify-between p-4">
                    <div>
                      <div className="text-xs text-sentinel-purple-light font-mono">
                        ID: {activeCamera.id}
                      </div>
                      <div className="text-xs text-sentinel-purple-light font-mono">
                        LOC: {activeCamera.location.room?.replace("room", "RM-") || "UNKNOWN"} | FL:{activeCamera.location.floor}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-red-400 font-mono flex items-center">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-1"></span>
                        REC
                      </div>
                      <div className="text-xs text-sentinel-purple-light font-mono">
                        {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Detection boxes */}
                  {getCameraDetections(activeCamera.id).map((detection) => {
                    // Randomize box position
                    const top = 20 + Math.random() * 50;
                    const left = 20 + Math.random() * 60;
                    const width = 120 + Math.random() * 100;
                    const height = 200 + Math.random() * 100;
                    
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
                        
                        {detection.type === "person" && (
                          <div className="absolute -bottom-6 left-0 px-2 py-0.5 bg-black/70 text-white text-xs font-mono">
                            {detection.details?.posture || "STANDING"}
                            {detection.details?.suspected_threat && (
                              <span className="ml-2 text-sentinel-alert">THREAT</span>
                            )}
                          </div>
                        )}
                        
                        {/* Crosshair for targets */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Crosshair className={`h-6 w-6 ${isThreat ? "text-sentinel-alert" : "text-green-400"}`} />
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Static noise overlay */}
                  {getNoisePattern(1)}
                  
                  {/* Camera artifacts */}
                  <div className="absolute inset-0">
                    {/* Simulated scan lines */}
                    <div 
                      className="w-full h-full opacity-10" 
                      style={{
                        backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
                        backgroundSize: '100% 4px'
                      }}
                    />
                    
                    {/* Random glitch effect */}
                    {Math.random() > 0.7 && (
                      <div 
                        className="absolute w-full h-8 bg-sentinel-purple/10" 
                        style={{ top: `${Math.random() * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <CameraOff className="h-16 w-16 text-sentinel-alert mb-4" />
                  <div className="text-xl font-bold text-sentinel-alert">Camera {activeCamera.status}</div>
                  <div className="text-sm text-gray-400 mt-2">Last seen: {activeCamera.lastSeen?.toLocaleString() || 'Unknown'}</div>
                  
                  {/* Static animation */}
                  {getNoisePattern(2)}
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center">
                <Camera className="h-16 w-16 text-gray-600 mb-4" />
                <div className="text-xl font-bold text-gray-400">No Camera Selected</div>
                <div className="text-sm text-gray-500 mt-2">Select a camera from the list to view the feed</div>
              </div>
            )}
          </div>
          
          {activeCamera && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-sentinel-dark border-sentinel-purple/20">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Battery</div>
                  <div className="flex items-center mt-1">
                    <div 
                      className={`h-2 rounded-full flex-grow mr-2 ${
                        (activeCamera.battery || 0) > 50 
                          ? "bg-green-500" 
                          : (activeCamera.battery || 0) > 20 
                          ? "bg-sentinel-warning" 
                          : "bg-sentinel-alert"
                      }`}
                      style={{ width: `${activeCamera.battery || 0}%` }}
                    />
                    <span className="text-sm font-medium">{activeCamera.battery || 0}%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-sentinel-dark border-sentinel-purple/20">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Location</div>
                  <div className="text-sm font-medium mt-1">
                    {activeCamera.location.room 
                      ? `Room ${activeCamera.location.room.replace("room", "")}` 
                      : "Unknown"}, Floor {activeCamera.location.floor}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-sentinel-dark border-sentinel-purple/20">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">People Detected</div>
                  <div className="text-lg font-medium mt-1 flex items-center">
                    <User className="h-4 w-4 mr-1 text-sentinel-info" />
                    {getCameraDetections(activeCamera.id).filter(d => d.type === "person").length}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-sentinel-dark border-sentinel-purple/20">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-400">Threats</div>
                  <div className="text-lg font-medium mt-1 flex items-center">
                    <AlertTriangle className={`h-4 w-4 mr-1 
                      ${getCameraDetections(activeCamera.id).some(
                        d => d.type === "weapon" || 
                        (d.type === "person" && d.details?.suspected_threat)
                      ) 
                        ? "text-sentinel-alert" 
                        : "text-gray-400"}`} 
                    />
                    {getCameraDetections(activeCamera.id).filter(
                      d => d.type === "weapon" || 
                      (d.type === "person" && d.details?.suspected_threat)
                    ).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {/* Camera List */}
        <div>
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3">All Cameras</h3>
              <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
                {cameras.map(camera => (
                  <div 
                    key={camera.id}
                    className={`p-3 rounded-md cursor-pointer flex items-start justify-between border
                      ${camera.id === activeCamera?.id
                        ? "border-sentinel-purple bg-sentinel-purple/10" 
                        : "border-transparent hover:bg-sentinel-dark"
                      }`}
                    onClick={() => setSelectedCamera(camera.id)}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <div 
                          className="h-10 w-10 rounded bg-black flex items-center justify-center overflow-hidden"
                          style={{ opacity: camera.status === "online" ? 1 : 0.5 }}
                        >
                          {camera.status === "online" ? (
                            <>
                              <div 
                                className="w-full h-full bg-cover bg-center"
                                style={{ 
                                  backgroundImage: `url("https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwc3BhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60")`,
                                  filter: "grayscale(1) brightness(0.7)"
                                }}
                              />
                              <div className="absolute inset-0 bg-black opacity-30"></div>
                            </>
                          ) : (
                            <CameraOff className="h-5 w-5 text-sentinel-alert" />
                          )}
                        </div>
                        <span 
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-sentinel-dark
                            ${camera.status === "online"
                              ? "bg-green-500" 
                              : camera.status === "compromised"
                              ? "bg-sentinel-warning"
                              : "bg-sentinel-alert"
                            }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{camera.name}</div>
                        <div className="text-xs text-gray-400">
                          Floor {camera.location.floor}
                          {camera.location.room && `, Room ${camera.location.room.replace("room", "")}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      {camera.status === "online" && getCameraDetections(camera.id).length > 0 && (
                        <Badge 
                          className={`
                            ${getCameraDetections(camera.id).some(
                              d => d.type === "weapon" || 
                              (d.type === "person" && d.details?.suspected_threat)
                            )
                              ? "bg-sentinel-alert/20 text-sentinel-alert" 
                              : "bg-green-500/20 text-green-400"
                            }
                          `}
                        >
                          {getCameraDetections(camera.id).length} detected
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CameraFeeds;
