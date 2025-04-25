
export type DeviceStatus = "online" | "offline" | "compromised";

export type AlertLevel = "none" | "low" | "medium" | "high" | "critical";

export type AlertType = "threat" | "audio" | "movement" | "system";

export type DetectionType = "person" | "weapon" | "movement" | "sound" | "thermal" | "medical";

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

// New interfaces for autonomous drone and AI tracking features
export interface DroneSwarmData {
  id: string;
  name: string;
  drones: string[]; // IDs of drones in swarm
  mission: "surveillance" | "rescue" | "mapping" | "delivery";
  status: "active" | "standby" | "returning";
  coverageArea: {
    floors: number[];
    rooms: string[];
  };
}

export interface PersonTrackingData {
  id: string;
  firstDetectedAt: Date;
  lastSeenAt: Date;
  confidence: number;
  locations: {
    location: Location;
    timestamp: Date;
  }[];
  posture: "standing" | "sitting" | "walking" | "running" | "crouching" | "lying";
  threat: boolean;
  associatedWith?: string[]; // IDs of people this person is associated with
  trackingPath: Location[];
  deviceIds: string[]; // IDs of devices that have detected this person
}

export interface ThermalData {
  id: string;
  intensity: number; // 0-100
  location: Location;
  timestamp: Date;
  deviceId: string;
  size: "small" | "medium" | "large"; // size of heat signature
}

export interface DeliveryPackage {
  id: string;
  type: "medical" | "communication" | "water" | "food";
  status: "loaded" | "in-transit" | "delivered";
  destination: Location;
  droneId?: string;
}

export interface BuildingMap3D {
  id: string;
  timestamp: Date;
  floors: {
    floor: number;
    walls: {
      start: Location;
      end: Location;
    }[];
    obstacles: {
      location: Location;
      size: {
        width: number;
        height: number;
        depth: number;
      };
      type: "furniture" | "debris" | "door" | "window" | "unknown";
    }[];
  }[];
  exploredAreas: Location[];
  unexploredAreas: Location[];
}
