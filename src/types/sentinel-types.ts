
export type DeviceStatus = "online" | "offline" | "compromised";

export type AlertLevel = "none" | "low" | "medium" | "high" | "critical";

export type AlertType = "threat" | "audio" | "movement" | "system";

export type DetectionType = "person" | "weapon" | "movement" | "sound";

export interface Device {
  id: string;
  name: string;
  type: "camera" | "drone" | "audio" | "sensor";
  status: DeviceStatus;
  location: Location;
  battery?: number; // percentage
  lastSeen?: Date;
}

export interface Location {
  x: number;
  y: number;
  z: number;
  room?: string;
  floor?: number;
}

export interface Detection {
  id: string;
  type: DetectionType;
  confidence: number;
  location: Location;
  timestamp: Date;
  deviceId: string;
  details?: {
    [key: string]: any;
  };
}

export interface Alert {
  id: string;
  type: AlertType;
  level: AlertLevel;
  message: string;
  timestamp: Date;
  location?: Location;
  deviceId?: string;
  detectionId?: string;
  acknowledged: boolean;
}

export interface BuildingData {
  floors: number;
  rooms: RoomData[];
}

export interface RoomData {
  id: string;
  name: string;
  floor: number;
  coordinates: {
    x1: number;
    y1: number;
    z1: number;
    x2: number;
    y2: number;
    z2: number;
  };
}

export interface MeshNodeData {
  id: string;
  name: string;
  type: "gateway" | "relay" | "device";
  status: "active" | "inactive" | "degraded";
  connections: string[]; // IDs of connected nodes
  signalStrength: number; // percentage
}
