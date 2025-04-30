
---

# 🛰️ Sentinel-Eye

**Sentinel-Eye** is an advanced **offline-capable drone surveillance system** built for high-risk crisis scenarios—such as hostage situations—where traditional surveillance infrastructure (CCTV, Wi-Fi, cellular) is compromised.  

🏆 **Winner  at Krithoathon 3.0**, Sentinel-Eye autonomously maps environments, detects threats, and relays mission-critical data using a **LoRa-based mesh network**—ensuring real-time intel even in network-denied zones.

---

## 🚀 Key Features

### 🔐 Core Functionality

- **Autonomous Drone Surveillance**  
  Scans structures like a 1000 sq ft house **without GPS** using **RTAB-Map SLAM** for 3D mapping.

- **Real-Time Threat Detection**  
  Identifies **people and weapons** (e.g., 24 people, 29 threats) using a **mocked YOLOv9-like AI pipeline**.

- **3D Visualization**  
  Interactive 3D renderings of environments and threats using **Three.js** on a web dashboard.

- **Offline Operation**  
  Fully functional **without internet** via a **simulated LoRa mesh** (~1 km range).

- **Rapid Mapping**  
  Generates 3D layouts in **3–10 minutes** using 3 drones equipped with simulated LiDAR.

---

### 🧠 Technical Highlights

#### 🔎 Sensor Simulation

- **LiDAR**: Mocked Velodyne Puck Lite data (~10–20 FPS)  
- **Thermal**: Simulated FLIR Lepton 3.5 (~8.7Hz, ~95% person detection accuracy)  
- **RGB**: Mocked Sony IMX219 (~30 FPS, ~90% weapon detection accuracy)

#### 🧠 AI + Edge Processing

- Mocked **YOLOv9** (95.7% mAP) running on **Jetson Nano** (472 GFLOPS)  
- Processes RGB and thermal data at ~5–10 FPS

#### 🌐 Mesh Networking

- Simulated **LoRa mesh** (10 kbps, 1 km range) via `mockMeshData.json`  
- SVG-based visualization of mesh topology using "golden links" (#FFD700)

#### 🖥️ Dashboard UI (React)

- Metrics like **“24 People, 8 Critical Alerts”** in **sentinel-dark** (`#1A1F2C`)
- Threat alerts in **sentinel-alert** (`#EA384C`)
- 3D model (/autonomous) with color-coded markers:
  - ✅ Safe zones (`#22C55E`)
  - 🚨 Threats (`#EA384C`)

---

## 🧰 Tech Stack

### 💻 Frontend

- **React 18.x** + **TypeScript**
- **Three.js** with `@react-three/fiber` & `@react-three/drei`
- **Tailwind CSS** (custom Sentinel palette)
- **Vite** for fast, offline-ready builds
- **React Router** for navigation (`/`, `/mesh`, `/autonomous`)

### 📦 Data & Processing

- `mockMeshData.json`: Simulates sensor + threat data  
- **YOLOv9** (Mocked): Threat detection AI (targeting Jetson Nano w/ TensorRT)  
- **RTAB-Map** (Planned): SLAM for mapping environments

### 🔌 Communication

- **Simulated LoRa Mesh**: via `MeshNetwork.tsx`, planning hardware with RFM95 modules  
- Optional **Node.js/Express** server (`server.js`) for real-time alert reception

---

## ✈️ Planned Hardware

| Component           | Model / Type            | Purpose                          |
|---------------------|-------------------------|----------------------------------|
| Drone               | DJI Matrice 300 RTK     | Autonomous flight                |
| Flight Controller   | Pixhawk + ArduPilot     | Navigation & stability           |
| Companion Computer  | NVIDIA Jetson Nano      | AI processing & SLAM             |
| LiDAR               | Velodyne Puck Lite      | 3D point cloud generation        |
| Thermal Sensor      | FLIR Lepton 3.5         | Heat-based detection             |
| RGB Camera          | Sony IMX219             | Visual object recognition        |
| Communication       | LoRa RFM95              | Mesh-based data relay (~1 km)    |

---

## 🛠️ Getting Started

### 📋 Prerequisites

- Node.js (v18+)
- npm (v9+)
- Git
- Modern browser (Chrome/Firefox recommended)

### ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/sentinel-eye.git
cd sentinel-eye

# Install dependencies
npm install

# Run locally
npm run dev
```

Open your browser at: [http://localhost:8080](http://localhost:8080)

### ✅ Verify Mock Data

Ensure mock data exists:

```bash
cat src/assets/mockMeshData.json | jq .
```

---

## 📈 Usage Overview

| View               | Description                                      |
|--------------------|--------------------------------------------------|
| `/` (Dashboard)     | View live metrics and alerts                    |
| `/mesh`             | Visualize drone LoRa mesh topology              |
| `/autonomous`       | Explore 3D scanned environments with threat tags |

---

## 🗂️ Project Structure

```
sentinel-eye/
├── src/
│   ├── assets/                   # Sensor mock data
│   ├── components/
│   │   ├── Dashboard.tsx         # Metrics & alerts UI
│   │   ├── MeshNetwork.tsx       # Mesh network visualization
│   │   ├── DronePathVisualization.tsx  # 3D scene
│   │   └── SidebarNav.tsx
│   ├── context/                  # Global state
│   ├── styles/                   # Tailwind custom styles
│   └── App.tsx / Index.tsx
├── public/                       # Static files
├── server.js                     # Optional Express server
├── vite.config.ts / tailwind.config.js
└── package.json / README.md
```

---

## 🧭 Roadmap

- ✅ MVP with mocked data and offline dashboard  
- 🔜 **ROS integration** with real LiDAR + FLIR sensors  
- 🔜 **Jetson Nano deployment** with TensorRT-optimized YOLO  
- 🔜 **Live SLAM** using RTAB-Map + Open3D  
- 🔜 **OLSR routing** for scalable drone swarms  
- 🔜 **Full autonomous navigation** via ArduPilot stack

---

## 🤝 Contributing

1. Fork the repo  
2. Create a new branch  
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add your feature"
   ```
4. Push and open a pull request

---

## 📄 License

[MIT License](LICENSE)

---

## 🙌 Acknowledgments

- Hackathon organizers & judges for recognizing Sentinel-Eye  
- Dev team for outstanding execution under time pressure  
- Open source projects: React, Three.js, Tailwind CSS, ROS, YOLO  

---

> **Sentinel-Eye**: Empowering first responders with AI-driven, network-free situational awareness. 🌐🛸

---
