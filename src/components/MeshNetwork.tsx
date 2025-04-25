
import React from "react";
import { useSentinel } from "@/contexts/SentinelContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Wifi, WifiOff, Camera, Mic, Drone, ServerCrash, AlertTriangle } from "lucide-react";

const MeshNetwork: React.FC = () => {
  const { meshNetwork, devices } = useSentinel();
  
  // Calculate network health score
  const activeNodes = meshNetwork.filter(node => node.status === "active").length;
  const totalNodes = meshNetwork.length;
  const networkHealth = Math.round((activeNodes / totalNodes) * 100);

  // Calculate average signal strength
  const avgSignalStrength = Math.round(
    meshNetwork.reduce((acc, node) => acc + node.signalStrength, 0) / meshNetwork.length
  );
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mesh Network</h1>
        <p className="text-gray-400">Offline communication infrastructure status</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Network Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-sentinel-dark border-sentinel-purple/20">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center py-2">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Network Health</h3>
                  <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-sentinel-purple/10"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="36"
                        cx="48"
                        cy="48"
                      />
                      <circle
                        className={`${networkHealth > 70 ? "text-green-500" : networkHealth > 40 ? "text-sentinel-warning" : "text-sentinel-alert"}`}
                        strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - networkHealth / 100)}`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="36"
                        cx="48"
                        cy="48"
                        style={{ transition: "stroke-dashoffset 1s" }}
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold">{networkHealth}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-sentinel-dark border-sentinel-purple/20">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center py-2">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Node Status</h3>
                  <div className="flex space-x-3">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-green-500">{activeNodes}</span>
                      <span className="text-xs text-gray-400">Active</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-sentinel-warning">
                        {meshNetwork.filter(node => node.status === "degraded").length}
                      </span>
                      <span className="text-xs text-gray-400">Degraded</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-sentinel-alert">
                        {meshNetwork.filter(node => node.status === "inactive").length}
                      </span>
                      <span className="text-xs text-gray-400">Inactive</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-sentinel-dark border-sentinel-purple/20">
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center py-2">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Signal Strength</h3>
                  <div className="flex items-center space-x-2">
                    <Wifi className={`h-5 w-5 ${
                      avgSignalStrength > 70 ? "text-green-500" : 
                      avgSignalStrength > 40 ? "text-sentinel-warning" : 
                      "text-sentinel-alert"
                    }`} />
                    <div className="flex space-x-0.5">
                      <div className={`w-1.5 h-4 rounded-sm ${avgSignalStrength > 20 ? "bg-currentColor" : "bg-gray-700"}`} 
                        style={{ color: avgSignalStrength > 70 ? "#22c55e" : avgSignalStrength > 40 ? "#F97316" : "#ea384c" }}></div>
                      <div className={`w-1.5 h-6 rounded-sm ${avgSignalStrength > 40 ? "bg-currentColor" : "bg-gray-700"}`}
                        style={{ color: avgSignalStrength > 70 ? "#22c55e" : avgSignalStrength > 40 ? "#F97316" : "#ea384c" }}></div>
                      <div className={`w-1.5 h-8 rounded-sm ${avgSignalStrength > 60 ? "bg-currentColor" : "bg-gray-700"}`}
                        style={{ color: avgSignalStrength > 70 ? "#22c55e" : "#F97316" }}></div>
                      <div className={`w-1.5 h-10 rounded-sm ${avgSignalStrength > 80 ? "bg-currentColor" : "bg-gray-700"}`}
                        style={{ color: avgSignalStrength > 70 ? "#22c55e" : "#F97316" }}></div>
                    </div>
                    <span className="text-lg font-bold ml-2">{avgSignalStrength}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Network Visualization */}
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Network Graph</h3>
              <div className="relative aspect-video bg-sentinel-dark/50 border border-sentinel-dark rounded-md overflow-hidden">
                {/* Gateway nodes */}
                {meshNetwork
                  .filter(node => node.type === "gateway")
                  .map((node, index) => (
                    <NetworkNode 
                      key={node.id} 
                      node={node} 
                      x={50} 
                      y={50} 
                      devices={devices}
                      meshNetwork={meshNetwork}
                    />
                  ))
                }
                
                {/* Relay nodes in a circle around gateway */}
                {meshNetwork
                  .filter(node => node.type === "relay")
                  .map((node, index, arr) => {
                    const angle = (index / arr.length) * 2 * Math.PI;
                    const x = 50 + 25 * Math.cos(angle);
                    const y = 50 + 25 * Math.sin(angle);
                    return (
                      <NetworkNode 
                        key={node.id} 
                        node={node}
                        x={x}
                        y={y}
                        devices={devices}
                        meshNetwork={meshNetwork}
                      />
                    );
                  })
                }
                
                {/* Device nodes */}
                {meshNetwork
                  .filter(node => node.type === "device")
                  .map((node, index, arr) => {
                    // Position devices in an outer circle
                    const angle = (index / arr.length) * 2 * Math.PI;
                    const x = 50 + 40 * Math.cos(angle);
                    const y = 50 + 40 * Math.sin(angle);
                    return (
                      <NetworkNode 
                        key={node.id} 
                        node={node}
                        x={x}
                        y={y}
                        devices={devices}
                        meshNetwork={meshNetwork}
                      />
                    );
                  })
                }
                
                {/* Background grid */}
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundSize: "20px 20px",
                    backgroundImage: `
                      linear-gradient(to right, rgba(155, 135, 245, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(155, 135, 245, 0.05) 1px, transparent 1px)
                    `
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Node List */}
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3">Network Nodes</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Gateway</h4>
                  <div className="space-y-2">
                    {meshNetwork
                      .filter(node => node.type === "gateway")
                      .map(node => (
                        <NodeListItem key={node.id} node={node} devices={devices} />
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Relays</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {meshNetwork
                      .filter(node => node.type === "relay")
                      .map(node => (
                        <NodeListItem key={node.id} node={node} devices={devices} />
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Critical Nodes</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {meshNetwork
                      .filter(node => node.status !== "active")
                      .map(node => (
                        <NodeListItem key={node.id} node={node} devices={devices} showWarning />
                      ))
                    }
                    {meshNetwork.filter(node => node.status !== "active").length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-2">All nodes operating normally</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Network Stats */}
          <Card className="bg-sentinel-dark border-sentinel-purple/20">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3">Network Stats</h3>
              
              <div className="space-y-3">
                <StatItem 
                  label="Active Connections" 
                  value={meshNetwork.reduce((acc, node) => acc + node.connections.length, 0)} 
                  icon={<Network className="h-4 w-4" />}
                />
                
                <StatItem 
                  label="Mesh Density" 
                  value={`${Math.round((meshNetwork.reduce((acc, node) => acc + node.connections.length, 0) / (meshNetwork.length * (meshNetwork.length - 1))) * 100)}%`} 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M7 3L12 7L17 3"></path>
                    <path d="M17 21L12 17L7 21"></path>
                    <path d="M3 7L7 12L3 17"></path>
                    <path d="M21 17L17 12L21 7"></path>
                  </svg>}
                />
                
                <StatItem 
                  label="Redundancy Level" 
                  value={meshNetwork.filter(node => node.connections.length > 1).length} 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>}
                />
                
                <StatItem 
                  label="Network Coverage" 
                  value={`${Math.round((devices.filter(d => {
                    const node = meshNetwork.find(n => n.id === d.id);
                    return node && node.connections.length > 0;
                  }).length / devices.length) * 100)}%`} 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>}
                />
                
                <StatItem 
                  label="Network Stability" 
                  value={`${Math.round(((activeNodes / totalNodes) * (avgSignalStrength / 100)) * 100)}%`} 
                  icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Warning Card if there are inactive nodes */}
          {meshNetwork.some(node => node.status !== "active") && (
            <Card className="bg-sentinel-alert/10 border-sentinel-alert">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-sentinel-alert mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-sentinel-alert">Network Alert</h3>
                    <p className="text-sm text-white mt-1">
                      {meshNetwork.filter(node => node.status === "inactive").length} nodes are inactive and 
                      {meshNetwork.filter(node => node.status === "degraded").length} are degraded. 
                      Network performance may be affected.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

interface NetworkNodeProps {
  node: any;
  x: number;
  y: number;
  devices: any[];
  meshNetwork: any[];
}

const NetworkNode: React.FC<NetworkNodeProps> = ({ node, x, y, devices, meshNetwork }) => {
  const device = devices.find(d => d.id === node.id);
  
  const nodeSize = node.type === "gateway" ? 20 : node.type === "relay" ? 14 : 10;
  
  const getNodeColor = () => {
    if (node.status === "inactive") return "#ea384c";
    if (node.status === "degraded") return "#F97316";
    return "#9b87f5";
  };
  
  const getNodeIcon = () => {
    if (node.type === "gateway") {
      return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="8" rx="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2"></rect>
        <line x1="6" y1="6" x2="6" y2="6"></line>
        <line x1="6" y1="18" x2="6" y2="18"></line>
      </svg>;
    }
    
    if (node.type === "relay") {
      return <Network className="h-4 w-4" />;
    }
    
    if (device) {
      switch (device.type) {
        case "camera":
          return node.status === "active" ? <Camera className="h-3 w-3" /> : <CameraOff className="h-3 w-3" />;
        case "audio":
          return <Mic className="h-3 w-3" />;
        case "drone":
          return <Drone className="h-3 w-3" />;
        default:
          return <Wifi className="h-3 w-3" />;
      }
    }
    
    return <Wifi className="h-3 w-3" />;
  };

  // Draw connections
  const connections = node.connections.map(connId => {
    const connectedNode = meshNetwork.find(n => n.id === connId);
    if (!connectedNode) return null;
    
    // Find the connected node's position
    let connX = 50, connY = 50;
    
    if (connectedNode.type === "gateway") {
      connX = 50;
      connY = 50;
    } else if (connectedNode.type === "relay") {
      const relayIndex = meshNetwork.filter(n => n.type === "relay").findIndex(n => n.id === connId);
      const relayCount = meshNetwork.filter(n => n.type === "relay").length;
      const angle = (relayIndex / relayCount) * 2 * Math.PI;
      connX = 50 + 25 * Math.cos(angle);
      connY = 50 + 25 * Math.sin(angle);
    } else {
      const deviceIndex = meshNetwork.filter(n => n.type === "device").findIndex(n => n.id === connId);
      const deviceCount = meshNetwork.filter(n => n.type === "device").length;
      const angle = (deviceIndex / deviceCount) * 2 * Math.PI;
      connX = 50 + 40 * Math.cos(angle);
      connY = 50 + 40 * Math.sin(angle);
    }
    
    return (
      <line 
        key={`conn-${node.id}-${connId}`} 
        x1={`${x}%`} 
        y1={`${y}%`} 
        x2={`${connX}%`} 
        y2={`${connY}%`}
        className={`stroke-current ${
          node.status === "active" && connectedNode.status === "active" 
            ? "text-sentinel-purple/30" 
            : "text-sentinel-alert/30 stroke-dasharray-2"
        }`}
        strokeWidth="1" 
      />
    );
  });

  return (
    <>
      {/* Draw SVG lines for connections */}
      <svg className="absolute inset-0 h-full w-full z-0">
        {connections}
      </svg>
      
      {/* Node */}
      <div 
        className={`absolute z-10 rounded-full flex items-center justify-center
          ${node.status === "active" 
            ? "bg-sentinel-purple" 
            : node.status === "degraded" 
            ? "bg-sentinel-warning" 
            : "bg-sentinel-alert"
          }`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${nodeSize}px`,
          height: `${nodeSize}px`,
          transform: "translate(-50%, -50%)"
        }}
      >
        <span className="text-white">
          {getNodeIcon()}
        </span>
        {/* Ping animation for active nodes */}
        {node.status === "active" && (
          <div className={`absolute rounded-full animate-ping opacity-75
            ${node.type === "gateway" 
              ? "bg-sentinel-purple/50 w-5 h-5" 
              : node.type === "relay" 
              ? "bg-sentinel-purple/40 w-4 h-4" 
              : "bg-sentinel-purple/30 w-3 h-3"
            }`}
          />
        )}
      </div>
      
      {/* Label for gateway and relay nodes */}
      {(node.type === "gateway" || node.type === "relay") && (
        <div 
          className="absolute z-10 text-xs text-sentinel-purple-light whitespace-nowrap"
          style={{
            left: `${x}%`,
            top: `${y + (nodeSize / 15) + 1}%`,
            transform: "translate(-50%, 0)"
          }}
        >
          {node.name}
        </div>
      )}
    </>
  );
};

interface NodeListItemProps {
  node: any;
  devices: any[];
  showWarning?: boolean;
}

const NodeListItem: React.FC<NodeListItemProps> = ({ node, devices, showWarning = false }) => {
  const device = devices.find(d => d.id === node.id);
  
  const getNodeTypeIcon = () => {
    if (node.type === "gateway") {
      return <ServerCrash className="h-5 w-5 text-sentinel-purple" />;
    }
    
    if (node.type === "relay") {
      return <Network className="h-5 w-5 text-sentinel-info" />;
    }
    
    if (device) {
      switch (device.type) {
        case "camera":
          return node.status === "active" ? <Camera className="h-5 w-5 text-gray-400" /> : <CameraOff className="h-5 w-5 text-sentinel-alert" />;
        case "audio":
          return <Mic className="h-5 w-5 text-gray-400" />;
        case "drone":
          return <Drone className="h-5 w-5 text-gray-400" />;
        default:
          return <Wifi className="h-5 w-5 text-gray-400" />;
      }
    }
    
    return <Wifi className="h-5 w-5 text-gray-400" />;
  };
  
  const getStatusColor = () => {
    switch (node.status) {
      case "active":
        return "bg-green-500";
      case "degraded":
        return "bg-sentinel-warning";
      case "inactive":
        return "bg-sentinel-alert";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={`p-3 rounded-md flex items-center justify-between ${
      showWarning && node.status !== "active" 
        ? "bg-sentinel-alert/10 border border-sentinel-alert/30" 
        : "bg-sentinel-dark/50"
    }`}>
      <div className="flex items-center">
        <div className="mr-3">{getNodeTypeIcon()}</div>
        <div>
          <div className="font-medium text-sm">{node.name}</div>
          <div className="flex items-center text-xs text-gray-400">
            <span className={`h-2 w-2 rounded-full ${getStatusColor()} mr-1`}></span>
            <span className="capitalize">{node.status}</span>
            <span className="mx-1">•</span>
            <span>{node.connections.length} connections</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center mr-2">
          <Wifi className="h-4 w-4 text-gray-400 mr-1" />
          <span className={`text-xs font-medium ${
            node.signalStrength > 70 
              ? "text-green-500" 
              : node.signalStrength > 40 
              ? "text-sentinel-warning" 
              : "text-sentinel-alert"
          }`}>
            {node.signalStrength}%
          </span>
        </div>
        {showWarning && node.status !== "active" && (
          <AlertTriangle className="h-4 w-4 text-sentinel-alert" />
        )}
      </div>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => {
  return (
    <div className="flex justify-between items-center p-2 rounded bg-sentinel-dark/50">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-sentinel-purple/20 flex items-center justify-center mr-3">
          <span className="text-sentinel-purple">{icon}</span>
        </div>
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export default MeshNetwork;
