
import React, { useState, useEffect } from 'react';
import { useSentinel } from "@/contexts/SentinelContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Users, 
  AlertTriangle, 
  ArrowUpRight,
  Clock,
  ArrowDownRight,
  ArrowRight,
  Map,
  MapPin
} from "lucide-react";
import { PersonTrackingData, Detection, Location } from "@/types/sentinel-types";
import { useToast } from "@/hooks/use-toast";

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const PersonTrackingSystem: React.FC = () => {
  const { detections, selectedFloor, setSelectedFloor } = useSentinel();
  const { toast } = useToast();
  
  // This would come from a more sophisticated tracking algorithm in a real app
  const [trackedPersons, setTrackedPersons] = useState<PersonTrackingData[]>([
    {
      id: "person-1",
      firstDetectedAt: new Date(Date.now() - 1800000), // 30 min ago
      lastSeenAt: new Date(),
      confidence: 0.92,
      locations: [
        { location: { x: 5, y: 0, z: 5, room: "room1", floor: 1 }, timestamp: new Date(Date.now() - 1800000) },
        { location: { x: 10, y: 0, z: 10, room: "room2", floor: 1 }, timestamp: new Date(Date.now() - 900000) },
        { location: { x: 15, y: 0, z: 15, room: "room4", floor: 1 }, timestamp: new Date() }
      ],
      posture: "walking",
      threat: true,
      trackingPath: [
        { x: 5, y: 0, z: 5, room: "room1", floor: 1 },
        { x: 7, y: 0, z: 7, room: "room2", floor: 1 },
        { x: 10, y: 0, z: 10, room: "room2", floor: 1 },
        { x: 12, y: 0, z: 12, room: "room2", floor: 1 },
        { x: 15, y: 0, z: 15, room: "room4", floor: 1 }
      ],
      deviceIds: ["cam1", "cam2", "cam4"]
    },
    {
      id: "person-2",
      firstDetectedAt: new Date(Date.now() - 1200000), // 20 min ago
      lastSeenAt: new Date(Date.now() - 300000), // 5 min ago
      confidence: 0.85,
      locations: [
        { location: { x: 20, y: 0, z: 5, room: "room2", floor: 1 }, timestamp: new Date(Date.now() - 1200000) },
        { location: { x: 22, y: 0, z: 12, room: "room2", floor: 1 }, timestamp: new Date(Date.now() - 600000) },
        { location: { x: 25, y: 0, z: 15, room: "room5", floor: 1 }, timestamp: new Date(Date.now() - 300000) }
      ],
      posture: "sitting",
      threat: false,
      trackingPath: [
        { x: 20, y: 0, z: 5, room: "room2", floor: 1 },
        { x: 22, y: 0, z: 8, room: "room2", floor: 1 },
        { x: 22, y: 0, z: 12, room: "room2", floor: 1 },
        { x: 24, y: 0, z: 14, room: "room2", floor: 1 },
        { x: 25, y: 0, z: 15, room: "room5", floor: 1 }
      ],
      deviceIds: ["cam2", "cam5"]
    },
    {
      id: "person-3",
      firstDetectedAt: new Date(Date.now() - 600000), // 10 min ago
      lastSeenAt: new Date(),
      confidence: 0.89,
      locations: [
        { location: { x: 7, y: 4, z: 7, room: "room6", floor: 2 }, timestamp: new Date(Date.now() - 600000) },
        { location: { x: 20, y: 4, z: 7, room: "room7", floor: 2 }, timestamp: new Date() }
      ],
      posture: "standing",
      threat: true,
      associatedWith: ["person-4"],
      trackingPath: [
        { x: 7, y: 4, z: 7, room: "room6", floor: 2 },
        { x: 12, y: 4, z: 7, room: "room6", floor: 2 },
        { x: 15, y: 4, z: 7, room: "room7", floor: 2 },
        { x: 20, y: 4, z: 7, room: "room7", floor: 2 }
      ],
      deviceIds: ["cam6", "cam7"]
    },
    {
      id: "person-4",
      firstDetectedAt: new Date(Date.now() - 600000), // 10 min ago
      lastSeenAt: new Date(),
      confidence: 0.78,
      locations: [
        { location: { x: 7, y: 4, z: 8, room: "room6", floor: 2 }, timestamp: new Date(Date.now() - 600000) },
        { location: { x: 20, y: 4, z: 8, room: "room7", floor: 2 }, timestamp: new Date() }
      ],
      posture: "walking",
      threat: false,
      associatedWith: ["person-3"],
      trackingPath: [
        { x: 7, y: 4, z: 8, room: "room6", floor: 2 },
        { x: 12, y: 4, z: 8, room: "room6", floor: 2 },
        { x: 15, y: 4, z: 8, room: "room7", floor: 2 },
        { x: 20, y: 4, z: 8, room: "room7", floor: 2 }
      ],
      deviceIds: ["cam6", "cam7"]
    }
  ]);
  
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  
  const personsOnSelectedFloor = trackedPersons.filter(
    person => person.locations[person.locations.length - 1].location.floor === selectedFloor
  );
  
  const threats = trackedPersons.filter(person => person.threat);
  const hostages = trackedPersons.filter(person => !person.threat);
  
  const getPersonDetails = (personId: string) => {
    return trackedPersons.find(p => p.id === personId);
  };
  
  const getAssociatedPersons = (personId: string) => {
    const person = trackedPersons.find(p => p.id === personId);
    if (!person || !person.associatedWith) return [];
    
    return trackedPersons.filter(p => person.associatedWith?.includes(p.id));
  };
  
  const handleTrackPerson = (personId: string) => {
    setSelectedPerson(personId);
    const person = getPersonDetails(personId);
    
    if (person) {
      // In a real app, this would center the map/view on this person
      const lastLocation = person.locations[person.locations.length - 1].location;
      setSelectedFloor(lastLocation.floor || 1);
      
      toast({
        title: "Tracking Active",
        description: `Now tracking ${person.threat ? "threat" : "person"} in ${lastLocation.room ? `Room ${lastLocation.room.replace("room", "")}` : "unknown location"}`,
        variant: "default"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-sentinel-dark border-sentinel-purple/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-sentinel-info" />
            AI Person Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-sentinel-dark/50 border-sentinel-purple/20">
              <CardContent className="p-4 flex flex-col items-center">
                <Users className="h-8 w-8 mb-2 text-sentinel-info" />
                <div className="text-2xl font-bold">{trackedPersons.length}</div>
                <div className="text-sm text-gray-400">People Tracked</div>
              </CardContent>
            </Card>
            
            <Card className="bg-sentinel-dark/50 border-sentinel-alert/20">
              <CardContent className="p-4 flex flex-col items-center">
                <AlertTriangle className="h-8 w-8 mb-2 text-sentinel-alert" />
                <div className="text-2xl font-bold">{threats.length}</div>
                <div className="text-sm text-gray-400">Threats</div>
              </CardContent>
            </Card>
            
            <Card className="bg-sentinel-dark/50 border-sentinel-purple/20">
              <CardContent className="p-4 flex flex-col items-center">
                <User className="h-8 w-8 mb-2 text-green-400" />
                <div className="text-2xl font-bold">{hostages.length}</div>
                <div className="text-sm text-gray-400">Hostages/Civilians</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">People on Floor {selectedFloor}</div>
              <Badge variant="outline" className="text-xs">
                {personsOnSelectedFloor.length} detected
              </Badge>
            </div>
            
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-2">
                {personsOnSelectedFloor.length > 0 ? (
                  personsOnSelectedFloor.map((person) => (
                    <Card 
                      key={person.id} 
                      className={`bg-sentinel-dark/50 border hover:bg-sentinel-dark/80 cursor-pointer transition-colors
                        ${person.id === selectedPerson ? 'border-sentinel-purple' : person.threat ? 'border-sentinel-alert/20' : 'border-green-500/20'}`}
                      onClick={() => handleTrackPerson(person.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3
                              ${person.threat ? 'bg-sentinel-alert/20 text-sentinel-alert' : 'bg-green-500/20 text-green-400'}`}
                            >
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-sm font-medium flex items-center">
                                Person {person.id.split('-')[1]}
                                {person.threat && (
                                  <Badge className="ml-2 bg-sentinel-alert/20 text-sentinel-alert text-xs">Threat</Badge>
                                )}
                              </div>
                              
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {person.locations[person.locations.length - 1].location.room 
                                  ? `Room ${person.locations[person.locations.length - 1].location.room.replace("room", "")}`
                                  : "Unknown location"}
                              </div>
                              
                              <div className="text-xs text-gray-400 flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                Last seen: {formatTime(person.lastSeenAt)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center text-xs text-gray-400">
                              <Badge 
                                variant="outline" 
                                className="text-xs capitalize"
                              >
                                {person.posture}
                              </Badge>
                            </div>
                            
                            <div className="mt-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // In a real app, this would focus the view on this person
                                  handleTrackPerson(person.id);
                                }}
                              >
                                Track
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {person.associatedWith && person.associatedWith.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-800">
                            <div className="text-xs text-gray-400 mb-1">Associated with:</div>
                            <div className="flex gap-1">
                              {getAssociatedPersons(person.id).map((associatedPerson) => (
                                <Badge 
                                  key={associatedPerson.id}
                                  variant="outline"
                                  className={`text-xs ${
                                    associatedPerson.threat ? 'bg-sentinel-alert/10 text-sentinel-alert' : 'bg-green-500/10 text-green-400'
                                  }`}
                                >
                                  Person {associatedPerson.id.split('-')[1]}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-2 pt-2 border-t border-gray-800">
                          <div className="text-xs text-gray-400 mb-1">Movement pattern:</div>
                          <div className="flex items-center space-x-1">
                            {person.trackingPath.slice(-4).map((location, index, array) => (
                              <React.Fragment key={index}>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {location.room?.replace("room", "R")}
                                </Badge>
                                {index < array.length - 1 && (
                                  <ArrowRight className="h-3 w-3 text-gray-500" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No people detected on this floor
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          {selectedPerson && (
            <Card className="bg-sentinel-dark/30 border-sentinel-purple/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex justify-between items-center">
                  <span>Movement Timeline</span>
                  <Badge variant="outline" className="text-xs">
                    Confidence: {(getPersonDetails(selectedPerson)?.confidence || 0) * 100}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {getPersonDetails(selectedPerson)?.locations.map((locationData, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-2">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-green-400' : 'bg-sentinel-purple'}`}></div>
                        {index < (getPersonDetails(selectedPerson)?.locations.length || 0) - 1 && (
                          <div className="w-0.5 h-full bg-gray-700"></div>
                        )}
                      </div>
                      <div className="pb-3">
                        <div className="text-xs text-gray-400">
                          {formatTime(locationData.timestamp)}
                        </div>
                        <div className="text-sm">
                          {locationData.location.room 
                            ? `Room ${locationData.location.room.replace("room", "")}` 
                            : "Unknown"}
                          , Floor {locationData.location.floor}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonTrackingSystem;
