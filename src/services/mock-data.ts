import { 
  Device, 
  Detection, 
  Alert, 
  MeshNodeData, 
  BuildingData, 
  Location, 
  DetectionType, 
  AlertType, 
  AlertLevel, 
  DeviceStatus 
} from "@/types/sentinel-types";

// Building layout data
export const buildingData: BuildingData = {
  floors: 3,
  rooms: [
    {
      id: "room1",
      name: "Main Entrance",
      floor: 1,
      coordinates: { x1: 0, y1: 0, z1: 0, x2: 10, y2: 3, z2: 10 }
    },
    {
      id: "room2",
      name: "Lobby",
      floor: 1,
      coordinates: { x1: 10, y1: 0, z1: 0, x2: 30, y2: 3, z2: 20 }
    },
    {
      id: "room3",
      name: "Office A",
      floor: 1,
      coordinates: { x1: 0, y1: 0, z1: 10, x2: 10, y2: 3, z2: 20 }
    },
    {
      id: "room4",
      name: "Meeting Room 1",
      floor: 1,
      coordinates: { x1: 10, y1: 0, z1: 20, x2: 20, y2: 3, z2: 30 }
    },
    {
      id: "room5",
      name: "Hallway",
      floor: 1,
      coordinates: { x1: 20, y1: 0, z1: 0, x2: 30, y2: 3, z2: 30 }
    },
    {
      id: "room6",
      name: "Office B",
      floor: 2,
      coordinates: { x1: 0, y1: 3, z1: 0, x2: 15, y2: 6, z2: 15 }
    },
    {
      id: "room7",
      name: "Executive Room",
      floor: 2,
      coordinates: { x1: 15, y1: 3, z1: 0, x2: 30, y2: 6, z2: 15 }
    },
    {
      id: "room8",
      name: "Storage",
      floor: 2,
      coordinates: { x1: 0, y1: 3, z1: 15, x2: 10, y2: 6, z2: 30 }
    },
    {
      id: "room9",
      name: "Meeting Room 2",
      floor: 2,
      coordinates: { x1: 10, y1: 3, z1: 15, x2: 30, y2: 6, z2: 30 }
    },
    {
      id: "room10",
      name: "Server Room",
      floor: 3,
      coordinates: { x1: 0, y1: 6, z1: 0, x2: 15, y2: 9, z2: 15 }
    },
    {
      id: "room11",
      name: "Security Room",
      floor: 3,
      coordinates: { x1: 15, y1: 6, z1: 0, x2: 30, y2: 9, z2: 30 }
    },
    {
      id: "room12",
      name: "Roof Access",
      floor: 3,
      coordinates: { x1: 0, y1: 6, z1: 15, x2: 15, y2: 9, z2: 30 }
    }
  ]
};

// Mock surveillance devices
export const mockDevices: Device[] = [
  {
    id: "cam1",
    name: "Entrance Camera",
    type: "camera",
    status: "online",
    location: { x: 5, y: 2, z: 5, room: "room1", floor: 1 },
    battery: 78
  },
  {
    id: "cam2",
    name: "Lobby Camera",
    type: "camera",
    status: "online",
    location: { x: 20, y: 2, z: 10, room: "room2", floor: 1 },
    battery: 92
  },
  {
    id: "cam3",
    name: "Office A Camera",
    type: "camera",
    status: "online",
    location: { x: 5, y: 2, z: 15, room: "room3", floor: 1 },
    battery: 85
  },
  {
    id: "cam4",
    name: "Meeting Room 1 Camera",
    type: "camera",
    status: "compromised",
    location: { x: 15, y: 2, z: 25, room: "room4", floor: 1 },
    battery: 45,
    lastSeen: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  {
    id: "cam5",
    name: "Hallway Camera",
    type: "camera",
    status: "offline",
    location: { x: 25, y: 2, z: 15, room: "room5", floor: 1 },
    battery: 0,
    lastSeen: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: "cam6",
    name: "Office B Camera",
    type: "camera",
    status: "online",
    location: { x: 7, y: 5, z: 7, room: "room6", floor: 2 },
    battery: 74
  },
  {
    id: "cam7",
    name: "Executive Room Camera",
    type: "camera",
    status: "online",
    location: { x: 22, y: 5, z: 7, room: "room7", floor: 2 },
    battery: 88
  },
  {
    id: "audio1",
    name: "Lobby Audio Sensor",
    type: "audio",
    status: "online",
    location: { x: 20, y: 2, z: 5, room: "room2", floor: 1 },
    battery: 95
  },
  {
    id: "audio2",
    name: "Meeting Room 1 Audio",
    type: "audio",
    status: "online",
    location: { x: 15, y: 2, z: 22, room: "room4", floor: 1 },
    battery: 87
  },
  {
    id: "audio3",
    name: "Executive Room Audio",
    type: "audio",
    status: "online",
    location: { x: 20, y: 5, z: 10, room: "room7", floor: 2 },
    battery: 91
  },
  {
    id: "drone1",
    name: "Surveillance Drone 1",
    type: "drone",
    status: "online",
    location: { x: 10, y: 8, z: 15, floor: 3 },
    battery: 68
  },
  {
    id: "drone2",
    name: "Rescue Drone",
    type: "drone",
    status: "online",
    location: { x: 25, y: 4, z: 25, floor: 2 },
    battery: 72
  }
];

// Mock detection data
export const mockInitialDetections: Detection[] = [
  {
    id: "d1",
    type: "person",
    confidence: 0.92,
    location: { x: 5, y: 0, z: 5, room: "room1", floor: 1 },
    timestamp: new Date(Date.now() - 120000),
    deviceId: "cam1",
    details: { posture: "standing", suspected_threat: false }
  },
  {
    id: "d2",
    type: "person",
    confidence: 0.89,
    location: { x: 6, y: 0, z: 5, room: "room1", floor: 1 },
    timestamp: new Date(Date.now() - 115000),
    deviceId: "cam1",
    details: { posture: "standing", suspected_threat: true }
  },
  {
    id: "d3",
    type: "weapon",
    confidence: 0.78,
    location: { x: 6, y: 1, z: 5, room: "room1", floor: 1 },
    timestamp: new Date(Date.now() - 110000),
    deviceId: "cam1",
    details: { type: "handgun" }
  },
  {
    id: "d4",
    type: "person",
    confidence: 0.95,
    location: { x: 18, y: 0, z: 8, room: "room2", floor: 1 },
    timestamp: new Date(Date.now() - 90000),
    deviceId: "cam2",
    details: { posture: "sitting", suspected_threat: false }
  },
  {
    id: "d5",
    type: "person",
    confidence: 0.91,
    location: { x: 22, y: 0, z: 12, room: "room2", floor: 1 },
    timestamp: new Date(Date.now() - 85000),
    deviceId: "cam2",
    details: { posture: "standing", suspected_threat: false }
  },
  {
    id: "d6",
    type: "sound",
    confidence: 0.85,
    location: { x: 20, y: 2, z: 5, room: "room2", floor: 1 },
    timestamp: new Date(Date.now() - 60000),
    deviceId: "audio1",
    details: { type: "voices", intensity: "moderate" }
  },
  {
    id: "d7",
    type: "sound",
    confidence: 0.73,
    location: { x: 15, y: 2, z: 22, room: "room4", floor: 1 },
    timestamp: new Date(Date.now() - 30000),
    deviceId: "audio2",
    details: { type: "impact", intensity: "high" }
  }
];

// Mock alerts data
export const mockInitialAlerts: Alert[] = [
  {
    id: "a1",
    type: "threat",
    level: "high",
    message: "Weapon detected in Main Entrance",
    timestamp: new Date(Date.now() - 110000),
    location: { x: 6, y: 1, z: 5, room: "room1", floor: 1 },
    deviceId: "cam1",
    detectionId: "d3",
    acknowledged: false
  },
  {
    id: "a2",
    type: "audio",
    level: "medium",
    message: "Impact sound detected in Meeting Room 1",
    timestamp: new Date(Date.now() - 30000),
    location: { x: 15, y: 2, z: 22, room: "room4", floor: 1 },
    deviceId: "audio2",
    detectionId: "d7",
    acknowledged: false
  },
  {
    id: "a3",
    type: "system",
    level: "critical",
    message: "Camera offline in Hallway",
    timestamp: new Date(Date.now() - 3600000),
    location: { x: 25, y: 2, z: 15, room: "room5", floor: 1 },
    deviceId: "cam5",
    acknowledged: true
  },
  {
    id: "a4",
    type: "system",
    level: "medium",
    message: "Camera compromised in Meeting Room 1",
    timestamp: new Date(Date.now() - 1800000),
    location: { x: 15, y: 2, z: 25, room: "room4", floor: 1 },
    deviceId: "cam4",
    acknowledged: false
  }
];

// Mesh Network Data
export const mockMeshNetwork: MeshNodeData[] = [
  {
    id: "gateway1",
    name: "Main Gateway",
    type: "gateway",
    status: "active",
    connections: ["relay1", "relay2", "cam1"],
    signalStrength: 100
  },
  {
    id: "relay1",
    name: "Relay Floor 1",
    type: "relay",
    status: "active",
    connections: ["gateway1", "cam2", "cam3", "audio1", "audio2"],
    signalStrength: 95
  },
  {
    id: "relay2",
    name: "Relay Floor 2",
    type: "relay",
    status: "active",
    connections: ["gateway1", "cam6", "cam7", "audio3"],
    signalStrength: 87
  },
  {
    id: "cam1",
    name: "Entrance Camera",
    type: "device",
    status: "active",
    connections: ["gateway1"],
    signalStrength: 92
  },
  {
    id: "cam2",
    name: "Lobby Camera",
    type: "device",
    status: "active",
    connections: ["relay1"],
    signalStrength: 89
  },
  {
    id: "cam3",
    name: "Office A Camera",
    type: "device",
    status: "active",
    connections: ["relay1"],
    signalStrength: 91
  },
  {
    id: "cam4",
    name: "Meeting Room 1 Camera",
    type: "device",
    status: "degraded",
    connections: ["relay1"],
    signalStrength: 45
  },
  {
    id: "cam5",
    name: "Hallway Camera",
    type: "device",
    status: "inactive",
    connections: [],
    signalStrength: 0
  },
  {
    id: "cam6",
    name: "Office B Camera",
    type: "device",
    status: "active",
    connections: ["relay2"],
    signalStrength: 84
  },
  {
    id: "cam7",
    name: "Executive Room Camera",
    type: "device",
    status: "active",
    connections: ["relay2"],
    signalStrength: 90
  },
  {
    id: "audio1",
    name: "Lobby Audio Sensor",
    type: "device",
    status: "active",
    connections: ["relay1"],
    signalStrength: 95
  },
  {
    id: "audio2",
    name: "Meeting Room 1 Audio",
    type: "device",
    status: "active",
    connections: ["relay1"],
    signalStrength: 87
  },
  {
    id: "audio3",
    name: "Executive Room Audio",
    type: "device",
    status: "active",
    connections: ["relay2"],
    signalStrength: 93
  },
  {
    id: "drone1",
    name: "Surveillance Drone 1",
    type: "device",
    status: "active",
    connections: ["gateway1", "relay2"],
    signalStrength: 78
  },
  {
    id: "drone2",
    name: "Rescue Drone",
    type: "device",
    status: "active",
    connections: ["gateway1", "relay1"],
    signalStrength: 82
  }
];

// Generate random detections
export function generateRandomDetection(): Detection {
  const deviceIds = mockDevices
    .filter(d => d.status === "online")
    .map(d => d.id);
  const randomDeviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
  const device = mockDevices.find(d => d.id === randomDeviceId)!;
  
  const detectionTypes = ["person", "weapon", "movement", "sound"];
  const randomType = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];
  
  // Define details based on detection type
  let details: { [key: string]: any } = {};
  switch (randomType) {
    case "person":
      details = { 
        posture: ["standing", "sitting", "moving", "crouching"][Math.floor(Math.random() * 4)],
        suspected_threat: Math.random() > 0.7
      };
      break;
    case "weapon":
      details = { 
        type: ["handgun", "rifle", "knife", "unknown"][Math.floor(Math.random() * 4)]
      };
      break;
    case "movement":
      details = { 
        speed: ["slow", "moderate", "fast"][Math.floor(Math.random() * 3)],
        direction: ["north", "south", "east", "west"][Math.floor(Math.random() * 4)]
      };
      break;
    case "sound":
      details = { 
        type: ["voices", "impact", "gunshot", "glass breaking", "footsteps"][Math.floor(Math.random() * 5)],
        intensity: ["low", "moderate", "high"][Math.floor(Math.random() * 3)]
      };
      break;
  }
  
  // Add some randomness to the location near the device
  const location: Location = {
    x: device.location.x + (Math.random() * 10 - 5),
    y: device.location.y,
    z: device.location.z + (Math.random() * 10 - 5),
    room: device.location.room,
    floor: device.location.floor
  };
  
  return {
    id: `d${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: randomType,
    confidence: 0.5 + (Math.random() * 0.5), // between 0.5 and 1.0
    location,
    timestamp: new Date(),
    deviceId: randomDeviceId,
    details
  };
}

// Generate random alert based on a detection
export function generateAlertFromDetection(detection: Detection): Alert | null {
  // Not all detections generate alerts
  if (Math.random() > 0.3) return null;
  
  let type: AlertType = "movement";
  let level: AlertLevel = "low";
  let message = "";
  
  const room = buildingData.rooms.find(r => r.id === detection.location.room)?.name || "Unknown Room";
  
  switch (detection.type) {
    case "person":
      if (detection.details?.suspected_threat) {
        type = "threat";
        level = "high";
        message = `Suspicious person detected in ${room}`;
      } else {
        type = "movement";
        level = "low";
        message = `Person detected in ${room}`;
      }
      break;
    case "weapon":
      type = "threat";
      level = "critical";
      message = `${detection.details?.type || 'Weapon'} detected in ${room}`;
      break;
    case "sound":
      type = "audio";
      if (detection.details?.type === "gunshot") {
        level = "critical";
        message = `Gunshot detected in ${room}`;
      } else if (detection.details?.type === "glass breaking" || detection.details?.intensity === "high") {
        level = "high";
        message = `${detection.details?.type || 'Loud sound'} detected in ${room}`;
      } else {
        level = "medium";
        message = `${detection.details?.type || 'Sound'} detected in ${room}`;
      }
      break;
    case "movement":
      type = "movement";
      level = "low";
      message = `Movement detected in ${room}`;
      break;
  }
  
  return {
    id: `a${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    level,
    message,
    timestamp: new Date(),
    location: detection.location,
    deviceId: detection.deviceId,
    detectionId: detection.id,
    acknowledged: false
  };
}

// Update device status randomly
export function updateDeviceStatus(device: Device): DeviceStatus {
  const currentStatus = device.status;
  
  // 95% chance to remain in current state
  if (Math.random() < 0.95) return currentStatus;
  
  // Otherwise, transition to a new state
  switch (currentStatus) {
    case "online":
      return Math.random() < 0.8 ? "compromised" : "offline";
    case "compromised":
      return Math.random() < 0.3 ? "online" : "offline";
    case "offline":
      return Math.random() < 0.2 ? "online" : "offline";
    default:
      return "online";
  }
}

// Generate system alert for device status change
export function generateDeviceStatusAlert(device: Device): Alert | null {
  if (device.status === "online") return null;
  
  const room = buildingData.rooms.find(r => r.id === device.location.room)?.name || "Unknown Room";
  
  const type: AlertType = "system";
  const level: AlertLevel = device.status === "compromised" ? "medium" : "high";
  const message = `${device.name} is ${device.status} in ${room}`;
  
  return {
    id: `as${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    level,
    message,
    timestamp: new Date(),
    location: device.location,
    deviceId: device.id,
    acknowledged: false
  };
}

// Update drone location
export function updateDroneLocation(drone: Device): Location {
  if (drone.type !== "drone") return drone.location;
  
  // Random movement
  const newLocation: Location = {
    x: drone.location.x + (Math.random() * 6 - 3),
    y: drone.location.y + (Math.random() * 2 - 0.5),
    z: drone.location.z + (Math.random() * 6 - 3),
    floor: drone.location.floor
  };
  
  // Ensure drone stays within building bounds
  newLocation.x = Math.max(0, Math.min(30, newLocation.x));
  newLocation.y = Math.max(0, Math.min(9, newLocation.y));
  newLocation.z = Math.max(0, Math.min(30, newLocation.z));
  
  // Update floor based on height
  if (newLocation.y <= 3) newLocation.floor = 1;
  else if (newLocation.y <= 6) newLocation.floor = 2;
  else newLocation.floor = 3;
  
  // Update room based on location
  const room = buildingData.rooms.find(r => 
    r.floor === newLocation.floor &&
    newLocation.x >= r.coordinates.x1 &&
    newLocation.x <= r.coordinates.x2 &&
    newLocation.z >= r.coordinates.z1 &&
    newLocation.z <= r.coordinates.z2
  );
  
  if (room) {
    newLocation.room = room.id;
  }
  
  return newLocation;
}
