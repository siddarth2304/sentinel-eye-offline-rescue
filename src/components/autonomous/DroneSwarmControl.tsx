import React, { useState, useEffect } from 'react';
import { useSentinel } from "@/contexts/SentinelContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Map, 
  Package, 
  Navigation, 
  ThermometerSun, 
  User, 
  BatteryMedium,
  WifiOff,
  Clock
} from "lucide-react";
import DroneIcon from "../icons/DroneIcon";
import { Location, ThermalData } from "@/types/sentinel-types";
import { useToast } from "@/hooks/use-toast";
import DronePathVisualization from './DronePathVisualization';

interface DroneSwarmControlProps {
  onMissionChange?: (mission: string) => void;
}

const DroneSwarmControl: React.FC<DroneSwarmControlProps> = ({ onMissionChange }) => {
  const { devices, selectedFloor, setSelectedFloor } = useSentinel();
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [scannedRooms, setScannedRooms] = useState<string[]>([]);
  const [detectedThreats, setDetectedThreats] = useState<Location[]>([]);
  const { toast } = useToast();

  const drones = devices.filter(device => device.type === "drone");
  const availableDrones = drones.filter(drone => drone.status === "online");

  useEffect(() => {
    if (activeMission === 'mapping') {
      const interval = setInterval(() => {
        const unscannedRooms = Array.from({ length: 9 }, (_, i) => `room${i + 1}`)
          .filter(room => !scannedRooms.includes(room));
        
        if (unscannedRooms.length > 0) {
          const randomRoom = unscannedRooms[Math.floor(Math.random() * unscannedRooms.length)];
          setScannedRooms(prev => [...prev, randomRoom]);
          
          if (Math.random() < 0.2) {
            setDetectedThreats(prev => [...prev, {
              x: Math.random() * 30,
              y: 2,
              z: Math.random() * 30,
              floor: 1
            }]);
            
            toast({
              title: "Threat Detected",
              description: `Potential threat detected in ${randomRoom}`,
              variant: "destructive"
            });
          }
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [activeMission, scannedRooms, toast]);

  const handleStartMission = (mission: string) => {
    if (availableDrones.length === 0) {
      toast({
        title: "No drones available",
        description: "All drones are currently offline or compromised.",
        variant: "destructive"
      });
      return;
    }
    
    setActiveMission(mission);
    if (onMissionChange) onMissionChange(mission);
    
    toast({
      title: "Mission Started",
      description: `Autonomous ${mission} mission initiated with ${availableDrones.length} drones.`,
      variant: "default"
    });
  };
  
  const handleStopMission = () => {
    setActiveMission(null);
    if (onMissionChange) onMissionChange("none");
    
    toast({
      title: "Mission Aborted",
      description: "All drones are returning to base.",
      variant: "default"
    });
  };

  const toggleAutonomousMode = () => {
    setAutonomousMode(!autonomousMode);
    
    toast({
      title: autonomousMode ? "Manual Control Enabled" : "Autonomous Mode Enabled",
      description: autonomousMode 
        ? "Drones will now follow manual commands" 
        : "Drones will now operate autonomously",
      variant: "default"
    });
  };

  return (
    <div className="space-y-4 p-6">
      <Card className="bg-sentinel-dark border-sentinel-purple/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <DroneIcon className="h-5 w-5 mr-2 text-sentinel-purple" />
            Autonomous Drone Swarm
            <Badge 
              variant="outline" 
              className={`ml-4 ${autonomousMode ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}
            >
              {autonomousMode ? 'Autonomous' : 'Manual'} Mode
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <DronePathVisualization
              drones={drones}
              scanCompleted={scannedRooms}
              detectedThreats={detectedThreats}
            />
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-400">
              {autonomousMode 
                ? 'Drones are operating autonomously without internet or GPS.' 
                : 'Manual control mode active. Drones will follow direct commands.'}
            </p>
            <div className="flex items-center mt-2">
              <WifiOff className="h-4 w-4 text-sentinel-alert mr-1" />
              <span className="text-xs text-sentinel-alert">Offline Mode Active</span>
              <span className="mx-2 text-xs text-gray-500">•</span>
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-xs text-gray-400">
                Uptime: {Math.floor(Math.random() * 120) + 30} minutes
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button 
              variant={autonomousMode ? "default" : "outline"}
              size="sm"
              onClick={() => setAutonomousMode(true)}
              className={autonomousMode ? "bg-sentinel-purple" : ""}
            >
              Autonomous
            </Button>
            <Button 
              variant={!autonomousMode ? "default" : "outline"}
              size="sm"
              onClick={() => setAutonomousMode(false)}
              className={!autonomousMode ? "bg-sentinel-purple" : ""}
            >
              Manual Control
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {drones.map((drone) => (
              <Card key={drone.id} className="bg-sentinel-dark/50 border border-sentinel-purple/20">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DroneIcon className={`h-4 w-4 mr-2 ${
                        drone.status === "online" ? "text-green-400" : 
                        drone.status === "compromised" ? "text-sentinel-warning" : 
                        "text-sentinel-alert"
                      }`} />
                      <div>
                        <div className="text-sm font-medium">{drone.name}</div>
                        <div className="text-xs text-gray-400">
                          Floor {drone.location.floor}
                          {drone.location.room && `, Room ${drone.location.room.replace("room", "")}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <BatteryMedium className="h-4 w-4 mr-1" />
                      <span className={`text-xs ${
                        (drone.battery || 0) > 70 ? "text-green-400" : 
                        (drone.battery || 0) > 30 ? "text-amber-400" : 
                        "text-sentinel-alert"
                      }`}>
                        {drone.battery}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium mb-2">Swarm Missions</div>
            
            <div className="grid grid-cols-2 gap-2">
              <Card 
                className={`bg-sentinel-dark/50 border cursor-pointer hover:bg-sentinel-dark/70 transition-colors
                  ${activeMission === 'mapping' ? 'border-sentinel-purple' : 'border-sentinel-purple/20'}`}
                onClick={() => handleStartMission('mapping')}
              >
                <CardContent className="p-3 flex flex-col items-center">
                  <Map className="h-8 w-8 mb-2 text-sentinel-info" />
                  <div className="text-sm font-medium">3D Mapping</div>
                  <div className="text-xs text-gray-400">Deploy drones to map building interior</div>
                </CardContent>
              </Card>
              
              <Card 
                className={`bg-sentinel-dark/50 border cursor-pointer hover:bg-sentinel-dark/70 transition-colors
                  ${activeMission === 'thermal' ? 'border-sentinel-purple' : 'border-sentinel-purple/20'}`}
                onClick={() => handleStartMission('thermal')}
              >
                <CardContent className="p-3 flex flex-col items-center">
                  <ThermometerSun className="h-8 w-8 mb-2 text-sentinel-warning" />
                  <div className="text-sm font-medium">Thermal Scan</div>
                  <div className="text-xs text-gray-400">Locate heat signatures</div>
                </CardContent>
              </Card>
              
              <Card 
                className={`bg-sentinel-dark/50 border cursor-pointer hover:bg-sentinel-dark/70 transition-colors
                  ${activeMission === 'delivery' ? 'border-sentinel-purple' : 'border-sentinel-purple/20'}`}
                onClick={() => handleStartMission('delivery')}
              >
                <CardContent className="p-3 flex flex-col items-center">
                  <Package className="h-8 w-8 mb-2 text-sentinel-purple" />
                  <div className="text-sm font-medium">Medical Delivery</div>
                  <div className="text-xs text-gray-400">Send supplies to located persons</div>
                </CardContent>
              </Card>
              
              <Card 
                className={`bg-sentinel-dark/50 border cursor-pointer hover:bg-sentinel-dark/70 transition-colors
                  ${activeMission === 'tracking' ? 'border-sentinel-purple' : 'border-sentinel-purple/20'}`}
                onClick={() => handleStartMission('tracking')}
              >
                <CardContent className="p-3 flex flex-col items-center">
                  <User className="h-8 w-8 mb-2 text-sentinel-info" />
                  <div className="text-sm font-medium">Person Tracking</div>
                  <div className="text-xs text-gray-400">Track and analyze movements</div>
                </CardContent>
              </Card>
            </div>
            
            {activeMission && (
              <Button 
                variant="destructive" 
                className="w-full mt-4"
                onClick={handleStopMission}
              >
                Abort Mission
              </Button>
            )}
          </div>
          
          {thermalDetections.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Thermal Detections</div>
              <div className="space-y-2">
                {thermalDetections.map((detection) => (
                  <Card key={detection.id} className="bg-sentinel-dark/50 border border-amber-500/20">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium flex items-center">
                            <ThermometerSun className="h-4 w-4 mr-2 text-amber-400" />
                            Heat Signature ({detection.size})
                          </div>
                          <div className="text-xs text-gray-400">
                            Floor {detection.location.floor}
                            {detection.location.room && `, Room ${detection.location.room.replace("room", "")}`}
                          </div>
                        </div>
                        <Badge className="bg-amber-500/20 text-amber-400">
                          {detection.intensity}% intensity
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DroneSwarmControl;
