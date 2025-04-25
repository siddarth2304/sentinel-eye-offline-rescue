
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Alert, 
  Detection, 
  Device, 
  MeshNodeData
} from "@/types/sentinel-types";
import { 
  mockInitialAlerts, 
  mockDevices, 
  mockInitialDetections, 
  mockMeshNetwork,
  generateRandomDetection,
  generateAlertFromDetection,
  updateDeviceStatus,
  generateDeviceStatusAlert,
  updateDroneLocation
} from "@/services/mock-data";
import { useToast } from "@/hooks/use-toast";

interface SentinelContextType {
  devices: Device[];
  detections: Detection[];
  alerts: Alert[];
  meshNetwork: MeshNodeData[];
  selectedFloor: number;
  setSelectedFloor: (floor: number) => void;
  selectedRoom: string | null;
  setSelectedRoom: (room: string | null) => void;
  acknowledgeAlert: (alertId: string) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  isPaused: boolean;
  togglePause: () => void;
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

export function SentinelProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [detections, setDetections] = useState<Detection[]>(mockInitialDetections);
  const [alerts, setAlerts] = useState<Alert[]>(mockInitialAlerts);
  const [meshNetwork, setMeshNetwork] = useState<MeshNodeData[]>(mockMeshNetwork);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const { toast } = useToast();

  // Toggle pause state
  const togglePause = () => setIsPaused(prev => !prev);

  // Acknowledge an alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  // Generate new detections and alerts
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      // Update drone locations
      const updatedDevices = devices.map(device => {
        if (device.type === "drone") {
          return { ...device, location: updateDroneLocation(device) };
        }
        
        // Randomly update other device statuses
        if (Math.random() < 0.05) {
          const newStatus = updateDeviceStatus(device);
          if (newStatus !== device.status) {
            const statusAlert = generateDeviceStatusAlert({
              ...device,
              status: newStatus,
              lastSeen: newStatus === "offline" ? new Date() : device.lastSeen
            });
            
            if (statusAlert) {
              setAlerts(prevAlerts => [...prevAlerts, statusAlert]);
              
              // Show toast for status change
              toast({
                title: "Device Status Changed",
                description: statusAlert.message,
                variant: newStatus === "compromised" ? "destructive" : "default"
              });
            }
            
            return {
              ...device,
              status: newStatus,
              lastSeen: newStatus === "offline" ? new Date() : device.lastSeen
            };
          }
        }
        
        return device;
      });
      
      setDevices(updatedDevices);

      // Generate new detections based on simulation speed
      const newDetectionsCount = Math.floor(Math.random() * 3 * simulationSpeed);
      const newDetections: Detection[] = [];
      
      for (let i = 0; i < newDetectionsCount; i++) {
        newDetections.push(generateRandomDetection());
      }
      
      // Generate alerts from new detections
      const newAlerts: Alert[] = [];
      newDetections.forEach(detection => {
        const alert = generateAlertFromDetection(detection);
        if (alert) {
          newAlerts.push(alert);
          
          // Show toast for critical alerts
          if (alert.level === "critical" || alert.level === "high") {
            toast({
              title: "Alert: " + alert.level.toUpperCase(),
              description: alert.message,
              variant: "destructive"
            });
          }
        }
      });
      
      // Update state
      setDetections(prevDetections => [...prevDetections, ...newDetections]);
      setAlerts(prevAlerts => [...prevAlerts, ...newAlerts]);
      
    }, 5000 / simulationSpeed); // Update every 5 seconds, adjusted by simulation speed
    
    return () => clearInterval(interval);
  }, [devices, simulationSpeed, isPaused, toast]);

  // Limit the number of detections and alerts to prevent memory issues
  useEffect(() => {
    if (detections.length > 100) {
      setDetections(prevDetections => prevDetections.slice(-100));
    }
    
    if (alerts.length > 50) {
      setAlerts(prevAlerts => prevAlerts.slice(-50));
    }
  }, [detections, alerts]);

  return (
    <SentinelContext.Provider
      value={{
        devices,
        detections,
        alerts,
        meshNetwork,
        selectedFloor,
        setSelectedFloor,
        selectedRoom,
        setSelectedRoom,
        acknowledgeAlert,
        simulationSpeed,
        setSimulationSpeed,
        isPaused,
        togglePause
      }}
    >
      {children}
    </SentinelContext.Provider>
  );
}

export const useSentinel = () => {
  const context = useContext(SentinelContext);
  if (context === undefined) {
    throw new Error("useSentinel must be used within a SentinelProvider");
  }
  return context;
};
