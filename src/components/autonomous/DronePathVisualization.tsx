
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Device, Location } from '@/types/sentinel-types';

interface DronePathVisualizationProps {
  drones: Device[];
  scanCompleted: string[]; // Array of room IDs that have been scanned
  detectedThreats: Location[]; // Array of threat locations
}

const PathLine: React.FC<{ points: THREE.Vector3[] }> = ({ points }) => {
  const lineRef = useRef<THREE.Line>();
  const geometry = useMemo(() => {
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    return lineGeometry;
  }, [points]);

  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.rotation.y += 0.001;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" color="#9b87f5" linewidth={2} />
    </line>
  );
};

const DroneModel: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const droneRef = useRef<THREE.Mesh>();
  
  useFrame(() => {
    if (droneRef.current) {
      droneRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={droneRef} position={position}>
      <boxGeometry args={[0.3, 0.1, 0.3]} />
      <meshStandardMaterial color="#9b87f5" />
      {/* Drone propellers */}
      <group position={[0, 0.1, 0]}>
        <mesh position={[0.2, 0, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <mesh position={[-0.2, 0, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <mesh position={[0.2, 0, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <mesh position={[-0.2, 0, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color="#666" />
        </mesh>
      </group>
    </mesh>
  );
};

const RoomMarker: React.FC<{ 
  position: [number, number, number], 
  isScanned: boolean,
  roomId: string 
}> = ({ position, isScanned, roomId }) => {
  return (
    <group position={position}>
      <Text
        position={[0, 0.5, 0]}
        color={isScanned ? "#4ade80" : "#94a3b8"}
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
      >
        {isScanned ? "✓" : roomId}
      </Text>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial 
          color={isScanned ? "#4ade8020" : "#94a3b820"} 
          transparent 
          opacity={0.3} 
        />
      </mesh>
    </group>
  );
};

const ThreatMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const markerRef = useRef<THREE.Group>();

  useFrame(() => {
    if (markerRef.current) {
      markerRef.current.rotation.y += 0.03;
    }
  });

  return (
    <group ref={markerRef} position={position}>
      <mesh>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <Text
        position={[0, 0.5, 0]}
        color="#ef4444"
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
      >
        ⚠️
      </Text>
    </group>
  );
};

const DronePathVisualization: React.FC<DronePathVisualizationProps> = ({ 
  drones, 
  scanCompleted,
  detectedThreats
}) => {
  // Create simulated room positions
  const rooms = useMemo(() => [
    { id: "room1", position: [-2, 0, -2] },
    { id: "room2", position: [0, 0, -2] },
    { id: "room3", position: [2, 0, -2] },
    { id: "room4", position: [-2, 0, 0] },
    { id: "room5", position: [0, 0, 0] },
    { id: "room6", position: [2, 0, 0] },
    { id: "room7", position: [-2, 0, 2] },
    { id: "room8", position: [0, 0, 2] },
    { id: "room9", position: [2, 0, 2] },
  ], []);

  // Create path points for visualization
  const pathPoints = useMemo(() => 
    drones.map(drone => {
      const points = [];
      // Add takeoff point
      points.push(new THREE.Vector3(
        drone.location.x - 15, 
        0,
        drone.location.z - 15
      ));
      
      // Add current position
      points.push(new THREE.Vector3(
        drone.location.x - 15,
        drone.location.y,
        drone.location.z - 15
      ));
      
      return points;
    }), [drones]);

  return (
    <div className="w-full h-[400px] bg-black rounded-lg overflow-hidden">
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Floor grid */}
        <gridHelper args={[20, 20, "#666666", "#222222"]} />
        
        {/* Room markers */}
        {rooms.map((room) => (
          <RoomMarker
            key={room.id}
            position={room.position as [number, number, number]}
            isScanned={scanCompleted.includes(room.id)}
            roomId={room.id}
          />
        ))}
        
        {/* Drone paths */}
        {pathPoints.map((points, index) => (
          <PathLine key={`path-${index}`} points={points} />
        ))}
        
        {/* Drones */}
        {drones.map((drone) => (
          <DroneModel
            key={drone.id}
            position={[
              drone.location.x - 15,
              drone.location.y,
              drone.location.z - 15
            ]}
          />
        ))}
        
        {/* Threat markers */}
        {detectedThreats.map((threat, index) => (
          <ThreatMarker
            key={`threat-${index}`}
            position={[
              threat.x - 15,
              threat.y,
              threat.z - 15
            ]}
          />
        ))}
        
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default DronePathVisualization;
