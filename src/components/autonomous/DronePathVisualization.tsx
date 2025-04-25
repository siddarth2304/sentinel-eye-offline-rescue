import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, SoftShadows, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Device, Location } from '@/types/sentinel-types';

interface DronePathVisualizationProps {
  drones: Device[];
  scanCompleted: string[];
  detectedThreats: Location[];
}

const Building: React.FC = () => {
  const buildingRef = useRef<THREE.Group>(null);
  return (
    <group ref={buildingRef} position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#292c31" />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <boxGeometry args={[18, 0.2, 18]} />
        <meshStandardMaterial color="#343740" />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 3, 0]}>
        <boxGeometry args={[18, 0.2, 18]} />
        <meshStandardMaterial color="#343740" />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 6, 0]}>
        <boxGeometry args={[18, 0.2, 18]} />
        <meshStandardMaterial color="#343740" />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 9, 0]}>
        <boxGeometry args={[18, 0.2, 18]} />
        <meshStandardMaterial color="#414550" />
      </mesh>
      {[[-9, -9], [9, -9], [-9, 9], [9, 9]].map((pos, i) => (
        <mesh key={`column-${i}`} castShadow position={[pos[0], 4.5, pos[1]]}>
          <boxGeometry args={[1, 9, 1]} />
          <meshStandardMaterial color="#515561" />
        </mesh>
      ))}
      <mesh castShadow position={[0, 4.5, -9]} rotation={[0, 0, 0]}>
        <boxGeometry args={[18, 9, 0.3]} />
        <meshStandardMaterial color="#474a54" opacity={0.9} transparent />
      </mesh>
      <mesh castShadow position={[0, 4.5, 9]} rotation={[0, 0, 0]}>
        <boxGeometry args={[18, 9, 0.3]} />
        <meshStandardMaterial color="#474a54" opacity={0.9} transparent />
      </mesh>
      <mesh castShadow position={[-9, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[18, 9, 0.3]} />
        <meshStandardMaterial color="#474a54" opacity={0.9} transparent />
      </mesh>
      <mesh castShadow position={[9, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[18, 9, 0.3]} />
        <meshStandardMaterial color="#474a54" opacity={0.9} transparent />
      </mesh>
    </group>
  );
};

const ScanningEffect: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const scanRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0.1);
  useFrame(() => {
    if (scanRef.current) {
      setScale(prev => (prev >= 3 ? 0.1 : prev + 0.05));
      scanRef.current.scale.set(scale, scale, scale);
      scanRef.current.rotation.y += 0.02;
    }
  });
  return (
    <mesh ref={scanRef} position={position}>
      <torusGeometry args={[0.5, 0.02, 16, 100]} />
      <meshStandardMaterial color="#9b87f5" emissive="#9b87f5" emissiveIntensity={2} transparent opacity={0.7} />
    </mesh>
  );
};

const PathLine: React.FC<{ points: THREE.Vector3[] }> = ({ points }) => {
  const lineRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.rotation.y += 0.001;
    }
  });
  return (
    <group ref={lineRef}>
      <Line points={points} color="#9b87f5" lineWidth={1} />
    </group>
  );
};

const DroneModel: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const droneRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (droneRef.current) {
      droneRef.current.rotation.y += 0.02;
    }
  });
  return (
    <mesh ref={droneRef} position={position} castShadow>
      <boxGeometry args={[0.3, 0.1, 0.3]} />
      <meshStandardMaterial color="#9b87f5" emissive="#9b87f5" emissiveIntensity={0.2} />
      <group position={[0, 0.1, 0]}>
        <mesh position={[0.2, 0, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        <mesh position={[-0.2, 0, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        <mesh position={[0.2, 0, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
        <mesh position={[-0.2, 0, -0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.02]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      </group>
      <spotLight
        position={[0, -0.1, 0]}
        angle={0.3}
        penumbra={0.8}
        intensity={2}
        distance={5}
        castShadow
        color="#9b87f5"
      />
      <ScanningEffect position={[0, -0.5, 0]} />
    </mesh>
  );
};

const RoomMarker: React.FC<{
  position: [number, number, number];
  isScanned: boolean;
  roomId: string;
}> = ({ position, isScanned, roomId }) => {
  return (
    <group position={position}>
      <Text
        position={[0, 0.5, 0]}
        color={isScanned ? '#4ade80' : '#94a3b8'}
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
      >
        {isScanned ? '✓' : roomId}
      </Text>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial
          color={isScanned ? '#4ade80' : '#94a3b8'}
          transparent
          opacity={0.3}
          emissive={isScanned ? '#4ade80' : '#94a3b8'}
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};

const ThreatMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const markerRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (markerRef.current) {
      markerRef.current.rotation.y += 0.03;
    }
  });
  return (
    <group ref={markerRef} position={position}>
      <mesh castShadow>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, 0.5, 0]} color="#ef4444" fontSize={0.3} anchorX="center" anchorY="middle">
        ⚠️
      </Text>
      <pointLight color="#ef4444" intensity={1} distance={3} />
    </group>
  );
};

const DronePathVisualization: React.FC<DronePathVisualizationProps> = ({
  drones,
  scanCompleted,
  detectedThreats,
}) => {
  const rooms = useMemo(() => {
    const floorRooms = [];
    for (let floor = 1; floor <= 3; floor++) {
      const yPosition = (floor - 1) * 3;
      floorRooms.push(
        { id: `room${(floor - 1) * 9 + 1}`, position: [-2, yPosition, -2] as [number, number, number], floor },
        { id: `room${(floor - 1) * 9 + 2}`, position: [0, yPosition, -2] as [number, number, number], floor },
        { id: `room${(floor - 1) * 9 + 3}`, position: [2, yPosition, -2] as [number, number, number], floor },
        { id: `room${(floor - 1) * 9 + 4}`, position: [-2, yPosition, 0] as [number, number, number], floor },
        { id: `room${(floor - 1) * 9 + 5}`, position: [0, yPosition, 0] as [number, number, number], floor },
        { id: `room${(floor - 1) * 9 + 6}`, position: [2, yPosition, 0] as [number, number, number], floor },
        { id: `room${(floor - 1) * 9 + 7}`, position: [-2, yPosition, 2] as [number, number, number], floor },
        { id: `room${(floor - 1) * 9 + 8}`, position: [0, yPosition, 2] as [number, number, number], floor },
        { id: `room${(floor - 1) * 9 + 9}`, position: [2, yPosition, 2] as [number, number, number], floor }
      );
    }
    return floorRooms;
  }, []);

  const pathPoints = useMemo(
    () =>
      drones.map((drone) => [
        new THREE.Vector3(drone.location.x - 15, 0, drone.location.z - 15),
        new THREE.Vector3(drone.location.x - 15, drone.location.y, drone.location.z - 15),
      ]),
    [drones]
  );

  return (
    <div className="w-full h-[400px] bg-black rounded-lg overflow-hidden">
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }} gl={{ preserveDrawingBuffer: false }}>
        <SoftShadows size={10} samples={8} />
        <fog attach="fog" args={['#17171b', 15, 25]} />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        <Building />
        {rooms.map((room) => (
          <RoomMarker
            key={room.id}
            position={room.position}
            isScanned={scanCompleted.includes(room.id)}
            roomId={`${room.id.replace('room', '')} (F${room.floor})`}
          />
        ))}
        {pathPoints.map((points, index) => (
          <PathLine key={`path-${index}`} points={points} />
        ))}
        {drones.map((drone) => (
          <DroneModel
            key={drone.id}
            position={[drone.location.x - 15, drone.location.y, drone.location.z - 15] as [number, number, number]}
          />
        ))}
        {detectedThreats.map((threat, index) => (
          <ThreatMarker
            key={`threat-${index}`}
            position={[threat.x - 15, threat.y, threat.z - 15] as [number, number, number]}
          />
        ))}
        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} enableZoom enablePan />
      </Canvas>
    </div>
  );
};

export default DronePathVisualization;
