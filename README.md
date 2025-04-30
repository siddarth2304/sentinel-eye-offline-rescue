Sentinel-Eye
 
Sentinel-Eye is an innovative offline drone surveillance system designed for crisis scenarios, such as hostage situations with disabled CCTV and jammed Wi-Fi/cellular networks. Awarded 3rd Place at the Hackathon, it autonomously maps threats (people, weapons) in real-time, delivering critical intel to rescuers via a LoRa-based mesh network. Built with a robust tech stack, Sentinel-Eye leverages AI, 3D visualization, and swarm navigation to ensure resilience in network-denied environments.
Features
Core Functionality

Autonomous Drone Surveillance: Deploys drones to scan environments (e.g., 1000 sq ft house) without GPS, using RTAB-Map for SLAM (Simultaneous Localization and Mapping).
Real-Time Threat Detection: Identifies people (e.g., 24 detected) and weapons (e.g., guns, knives, 29 threats) with YOLOv9-like AI, mocked in MVP.
3D Visualization: Renders interactive 3D models of scanned areas (walls, threats) using Three.js, displayed on a web dashboard.
Offline Operation: Functions without internet, relying on a LoRa mesh network (simulated via JSON) for data relay across ~1km.
Rapid Mapping: Reconstructs 3D layouts in ~3-10 minutes (3 drones, LiDAR) for unknown blueprints, e.g., a house with no prior floorplan.

Technical Features

Sensor Simulation:
LiDAR: Mocked Velodyne Puck Lite data for high-resolution point clouds (~10-20fps).
Thermal Sensors: Simulated FLIR Lepton 3.5 for heat signature detection (~8.7Hz, 95% accuracy for people).
RGB Cameras: Mocked Sony IMX219 for visual weapon detection (~30fps, 90% accuracy).


AI Processing: Mocked YOLOv9 (95.7% mAP) on NVIDIA Jetson Nano (472 GFLOPS), processing thermal/RGB data at ~5-10fps.
Mesh Network: Simulated LoRa mesh (10kbps, 1km range) via mockMeshData.json, visualizing drone connections as SVG nodes with golden links (#FFD700).
Dashboard UI: Interactive React interface with:
Metrics (e.g., “24 People, 8 Critical Alerts”) in sentinel-dark (#1A1F2C).
Threat alerts (e.g., “Weapon detected”) in sentinel-alert (#EA384C).
3D view (/autonomous) with green (#22C55E) and red (#EA384C) threat markers.


Scalability: Extensible to ROS-based drone swarms and OLSR routing for large-scale deployments.

Tech Stack
Frontend

React (18.x): Core framework for dynamic UI (Index.tsx, Dashboard.tsx).
TypeScript: Type-safe development for robust code.
Three.js: 3D visualization of house layouts and threats (DronePathVisualization.tsx).
@react-three/fiber, @react-three/drei: React bindings for Three.js, enabling OrbitControls.
Tailwind CSS: Responsive styling with custom sentinel colors (sentinel-dark #1A1F2C, sentinel-purple #A855F7, sentinel-alert #EA384C, sentinel-green #22C55E, sentinel-blue #0EA5E9).
React Router: Navigation (/, /autonomous, /mesh).
Vite: Fast build tool, bundling assets for offline use (vite.config.ts).

Data & Processing

mockMeshData.json: Simulates LiDAR, thermal, and RGB sensor data (e.g., {threat: "gun", location: {x: 18, y: 6, z: 18}}).
YOLOv9 (Mocked): AI model for threat detection, planned for Jetson Nano with TensorRT.
RTAB-Map (Planned): SLAM for 3D mapping, integrated with ROS in production.

Communication

LoRa Mesh (Simulated): Mocked in MeshNetwork.tsx, planned with RFM95 transceivers and OLSR routing.
Node.js/Express (Optional): Demo server (server.js) for receiving alerts, not required for offline MVP.

Hardware (Planned)

Drones: DJI Matrice 300 RTK with Pixhawk flight controller and ArduPilot.
Companion Computer: NVIDIA Jetson Nano for onboard AI and SLAM.
Sensors:
LiDAR: Velodyne Puck Lite (300,000 points/s).
Thermal: FLIR Lepton 3.5 (160x120, 8-14μm).
RGB: Sony IMX219 (1080p, 30fps).


Communication: LoRa RFM95 transceivers (~1km range).

Getting Started
Prerequisites

Node.js (v18+): For running the React dashboard.
npm (v9+): For dependency management.
Git: To clone the repository.
Browser: Chrome/Firefox for optimal WebGL rendering.

Installation

Clone the Repository:
git clone https://github.com/yourusername/sentinel-eye.git
cd sentinel-eye


Install Dependencies:
npm install


Run the Development Server:
npm run dev

Open http://localhost:8080 to view the dashboard.

Verify Mock Data:Ensure src/assets/mockMeshData.json is present:
cat src/assets/mockMeshData.json | jq .



Usage

Dashboard: View metrics (e.g., “24 People, 29 Threats”) and alerts (Dashboard.tsx).
Mesh Network: Check drone connections in SVG (MeshNetwork.tsx, /mesh).
3D Visualization: Explore 3D house model with threat markers (DronePathVisualization.tsx, /autonomous).
Offline Mode: Runs entirely locally, no internet required.

Project Structure
sentinel-eye/
├── src/
│   ├── assets/
│   │   └── mockMeshData.json       # Mock sensor data
│   ├── components/
│   │   ├── Dashboard.tsx           # Metrics and alerts
│   │   ├── MeshNetwork.tsx         # LoRa mesh visualization
│   │   ├── DronePathVisualization.tsx # 3D view
│   │   └── SidebarNav.tsx          # Navigation
│   ├── context/
│   │   └── SentinelContext.tsx     # Global state
│   ├── App.tsx                     # Main app
│   ├── Index.tsx                   # Entry point
│   └── styles/
│       └── tailwind.css            # Custom styles
├── public/                         # Static assets
├── server.js                       # Optional demo server
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind settings
├── package.json                    # Dependencies
└── README.md                       # This file

Future Enhancements

Real Sensors: Integrate LiDAR (Velodyne), thermal (FLIR), and RGB (Sony) with ROS.
AI Deployment: Run YOLOv9 on Jetson Nano with TensorRT for ~10fps inference.
Dynamic Mesh: Implement OLSR routing for LoRa mesh with RFM95 transceivers.
Enhanced 3D: Use Open3D for real-time meshing of point clouds.
Swarm Coordination: Add ArduPilot for multi-drone navigation.

Contributing

Fork the repository.
Create a branch (git checkout -b feature/your-feature).
Commit changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a pull request.

License
MIT License
Acknowledgments

Hackathon organizers and judges for the 3rd Place award.
Team for their dedication in building Sentinel-Eye.
Open-source communities: React, Three.js, Tailwind CSS.


Sentinel-Eye: Empowering rescuers with offline, AI-driven surveillance. 🌐🔍
