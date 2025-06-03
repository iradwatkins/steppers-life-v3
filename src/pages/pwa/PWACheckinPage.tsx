import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePWAAuth } from '@/hooks/usePWAAuth';
import { toast } from '@/components/ui/sonner';
import {
  QrCode,
  Scan,
  Camera,
  CameraOff,
  User,
  CheckCircle,
  XCircle,
  Search,
  Clock,
  Users,
  AlertCircle,
  Flashlight,
  FlashlightOff
} from 'lucide-react';

interface AttendeeRecord {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  checkedIn: boolean;
  checkInTime?: string;
}

const PWACheckinPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, hasPermission, isOnline } = usePWAAuth();
  
  const [selectedEvent, setSelectedEvent] = useState(searchParams.get('event') || '1');
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastScanResult, setLastScanResult] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Mock attendee data
  const [attendees] = useState<AttendeeRecord[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      ticketType: 'General Admission',
      checkedIn: false
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      ticketType: 'VIP',
      checkedIn: true,
      checkInTime: '2024-12-19T18:30:00Z'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.w@email.com',
      ticketType: 'Student',
      checkedIn: false
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      ticketType: 'General Admission',
      checkedIn: false
    }
  ]);

  const [checkedInAttendees, setCheckedInAttendees] = useState<AttendeeRecord[]>(
    attendees.filter(a => a.checkedIn)
  );

  // Check permissions
  useEffect(() => {
    if (!hasPermission('check_in')) {
      toast.error('You do not have permission to access check-in functionality');
      navigate('/pwa/dashboard');
    }
  }, [hasPermission, navigate]);

  // Start camera for QR scanning
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsScanning(false);
    setFlashlightOn(false);
  };

  // Toggle flashlight
  const toggleFlashlight = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashlightOn }]
          });
          setFlashlightOn(!flashlightOn);
        } catch (error) {
          toast.error('Flashlight not available on this device');
        }
      } else {
        toast.error('Flashlight not supported on this device');
      }
    }
  };

  // Simulate QR code scan
  const simulateQRScan = (attendeeId: string) => {
    setLastScanResult(attendeeId);
    processCheckIn(attendeeId);
  };

  // Process check-in
  const processCheckIn = (attendeeId: string) => {
    const attendee = attendees.find(a => a.id === attendeeId);
    
    if (!attendee) {
      toast.error('Invalid ticket. Attendee not found.');
      return;
    }

    if (attendee.checkedIn) {
      toast.warning(`${attendee.name} is already checked in.`);
      return;
    }

    // Update attendee record
    attendee.checkedIn = true;
    attendee.checkInTime = new Date().toISOString();
    
    // Add to checked-in list
    setCheckedInAttendees(prev => [...prev, attendee]);
    
    toast.success(`${attendee.name} checked in successfully!`, {
      description: `Ticket: ${attendee.ticketType}`
    });

    // Store offline for sync later
    if (!isOnline) {
      // In a real app, store in IndexedDB for later sync
      console.log('Stored offline check-in for sync:', attendee);
    }
  };

  // Manual check-in by search
  const handleManualCheckIn = (attendee: AttendeeRecord) => {
    processCheckIn(attendee.id);
  };

  // Filter attendees for search
  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCheckInTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Event Check-in</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Badge variant="outline">Event {selectedEvent}</Badge>
          <span>•</span>
          <span>{checkedInAttendees.length} checked in</span>
        </div>
      </div>

      {/* Offline Warning */}
      {!isOnline && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're offline. Check-ins will be saved and synced when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scanner">
            <QrCode className="w-4 h-4 mr-2" />
            QR Scanner
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Search className="w-4 h-4 mr-2" />
            Manual
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="w-4 h-4 mr-2" />
            Recent
          </TabsTrigger>
        </TabsList>

        {/* QR Scanner Tab */}
        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scan className="w-5 h-5" />
                <span>QR Code Scanner</span>
              </CardTitle>
              <CardDescription>
                Point the camera at the attendee's QR code to check them in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera View */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <Camera className="w-12 h-12 mx-auto mb-2" />
                      <p>Camera inactive</p>
                    </div>
                  </div>
                )}

                {/* Scanner Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white rounded-lg opacity-50">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex justify-center space-x-3">
                {!isCameraActive ? (
                  <Button onClick={startCamera}>
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={stopCamera}>
                      <CameraOff className="w-4 h-4 mr-2" />
                      Stop Camera
                    </Button>
                    <Button variant="outline" onClick={toggleFlashlight}>
                      {flashlightOn ? (
                        <FlashlightOff className="w-4 h-4 mr-2" />
                      ) : (
                        <Flashlight className="w-4 h-4 mr-2" />
                      )}
                      Flash
                    </Button>
                  </>
                )}
              </div>

              {/* Demo Scan Buttons */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3">Demo: Simulate QR code scan</p>
                <div className="grid grid-cols-2 gap-2">
                  {attendees.filter(a => !a.checkedIn).slice(0, 4).map((attendee) => (
                    <Button
                      key={attendee.id}
                      variant="outline"
                      size="sm"
                      onClick={() => simulateQRScan(attendee.id)}
                    >
                      Scan {attendee.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Check-in Tab */}
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Manual Check-in</span>
              </CardTitle>
              <CardDescription>
                Search for attendees by name or email to check them in manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Attendees</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Enter name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Attendee List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAttendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{attendee.name}</p>
                        {attendee.checkedIn ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-600">{attendee.email}</p>
                      <p className="text-xs text-gray-500">{attendee.ticketType}</p>
                      {attendee.checkedIn && attendee.checkInTime && (
                        <p className="text-xs text-green-600">
                          Checked in at {formatCheckInTime(attendee.checkInTime)}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      disabled={attendee.checkedIn}
                      onClick={() => handleManualCheckIn(attendee)}
                      variant={attendee.checkedIn ? "outline" : "default"}
                    >
                      {attendee.checkedIn ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Checked In
                        </>
                      ) : (
                        'Check In'
                      )}
                    </Button>
                  </div>
                ))}
                
                {filteredAttendees.length === 0 && searchQuery && (
                  <div className="text-center py-8 text-gray-500">
                    <User className="w-8 h-8 mx-auto mb-2" />
                    <p>No attendees found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Check-ins Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Recent Check-ins</span>
              </CardTitle>
              <CardDescription>
                Recently checked-in attendees ({checkedInAttendees.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {checkedInAttendees.length > 0 ? (
                <div className="space-y-3">
                  {checkedInAttendees
                    .sort((a, b) => new Date(b.checkInTime || 0).getTime() - new Date(a.checkInTime || 0).getTime())
                    .map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium">{attendee.name}</p>
                            <p className="text-sm text-gray-600">{attendee.ticketType}</p>
                          </div>
                        </div>
                        
                        {attendee.checkInTime && (
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {formatCheckInTime(attendee.checkInTime)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(attendee.checkInTime).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <p>No recent check-ins</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PWACheckinPage; 