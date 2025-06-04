import React, { useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, MapPin, Settings, Eye, Save, Trash2, Download } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface SeatPosition {
  id: string;
  x: number;
  y: number;
  seatNumber: string;
  row?: string;
  section?: string;
  priceCategory: string;
  isADA: boolean;
  status: 'available' | 'sold' | 'reserved' | 'blocked';
}

interface SeatingChart {
  id: string;
  name: string;
  imageUrl: string;
  imageFile?: File;
  seats: SeatPosition[];
  createdAt: Date;
}

interface PriceCategory {
  id: string;
  name: string;
  price: number;
  color: string;
}

const EventSeatingPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [seatingCharts, setSeatingCharts] = useState<SeatingChart[]>([]);
  const [currentChart, setCurrentChart] = useState<SeatingChart | null>(null);
  const [isMapping, setIsMapping] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<SeatPosition | null>(null);
  
  // Price categories
  const [priceCategories, setPriceCategories] = useState<PriceCategory[]>([
    { id: '1', name: 'General Admission', price: 25, color: '#3B82F6' },
    { id: '2', name: 'VIP', price: 50, color: '#F59E0B' },
    { id: '3', name: 'Premium', price: 75, color: '#8B5CF6' }
  ]);

  // Seat configuration form
  const [seatForm, setSeatForm] = useState({
    seatNumber: '',
    row: '',
    section: '',
    priceCategory: '',
    isADA: false
  });

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PNG, JPG, or JPEG files only.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    
    const newChart: SeatingChart = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      imageUrl,
      imageFile: file,
      seats: [],
      createdAt: new Date()
    };

    setSeatingCharts(prev => [...prev, newChart]);
    setCurrentChart(newChart);
    setActiveTab('mapping');

    toast({
      title: "Chart uploaded successfully",
      description: "You can now start mapping seats on your chart."
    });
  }, []);

  const handleChartClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isMapping || !currentChart) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const newSeat: SeatPosition = {
      id: Date.now().toString(),
      x,
      y,
      seatNumber: `S${currentChart.seats.length + 1}`,
      priceCategory: priceCategories[0]?.id || '',
      isADA: false,
      status: 'available'
    };

    const updatedChart = {
      ...currentChart,
      seats: [...currentChart.seats, newSeat]
    };

    setCurrentChart(updatedChart);
    setSeatingCharts(prev => 
      prev.map(chart => chart.id === currentChart.id ? updatedChart : chart)
    );

    setSelectedSeat(newSeat);
    setSeatForm({
      seatNumber: newSeat.seatNumber,
      row: newSeat.row || '',
      section: newSeat.section || '',
      priceCategory: newSeat.priceCategory,
      isADA: newSeat.isADA
    });
  }, [isMapping, currentChart, priceCategories]);

  const handleSeatUpdate = () => {
    if (!selectedSeat || !currentChart) return;

    const updatedSeat = {
      ...selectedSeat,
      seatNumber: seatForm.seatNumber,
      row: seatForm.row,
      section: seatForm.section,
      priceCategory: seatForm.priceCategory,
      isADA: seatForm.isADA
    };

    const updatedChart = {
      ...currentChart,
      seats: currentChart.seats.map(seat => 
        seat.id === selectedSeat.id ? updatedSeat : seat
      )
    };

    setCurrentChart(updatedChart);
    setSeatingCharts(prev => 
      prev.map(chart => chart.id === currentChart.id ? updatedChart : chart)
    );

    toast({
      title: "Seat updated",
      description: `Seat ${seatForm.seatNumber} has been updated.`
    });
  };

  const handleSeatDelete = (seatId: string) => {
    if (!currentChart) return;

    const updatedChart = {
      ...currentChart,
      seats: currentChart.seats.filter(seat => seat.id !== seatId)
    };

    setCurrentChart(updatedChart);
    setSeatingCharts(prev => 
      prev.map(chart => chart.id === currentChart.id ? updatedChart : chart)
    );

    if (selectedSeat?.id === seatId) {
      setSelectedSeat(null);
    }

    toast({
      title: "Seat deleted",
      description: "Seat has been removed from the chart."
    });
  };

  const handleSaveChart = () => {
    if (!currentChart) return;

    // Here you would save to backend
    console.log('Saving seating chart:', currentChart);
    
    toast({
      title: "Chart saved",
      description: `Seating chart "${currentChart.name}" saved successfully with ${currentChart.seats.length} seats.`
    });
  };

  const getPriceCategoryColor = (categoryId: string) => {
    return priceCategories.find(cat => cat.id === categoryId)?.color || '#3B82F6';
  };

  const getSeatStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'sold': return '#EF4444';
      case 'reserved': return '#F59E0B';
      case 'blocked': return '#6B7280';
      default: return '#3B82F6';
    }
  };

  return (
    <div className="min-h-screen bg-background-main py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-surface-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-text-primary flex items-center">
              <MapPin className="mr-2 h-6 w-6 text-brand-primary" />
              Seating Chart Manager - Event ID: {eventId}
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Upload your seating chart image and configure interactive seat selection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Chart
                </TabsTrigger>
                <TabsTrigger value="mapping" disabled={!currentChart}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Map Seats
                </TabsTrigger>
                <TabsTrigger value="configure" disabled={!selectedSeat}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Seat
                </TabsTrigger>
                <TabsTrigger value="preview" disabled={!currentChart}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <div className="border-2 border-dashed border-border-default rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-text-secondary mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    Upload Seating Chart
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Upload PNG, JPG, or JPEG files (max 10MB)
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {seatingCharts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-text-primary">Existing Charts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {seatingCharts.map(chart => (
                        <Card key={chart.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => {setCurrentChart(chart); setActiveTab('mapping');}}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{chart.name}</CardTitle>
                            <Badge variant="secondary">{chart.seats.length} seats</Badge>
                          </CardHeader>
                          <CardContent>
                            <img 
                              src={chart.imageUrl} 
                              alt={chart.name}
                              className="w-full h-32 object-cover rounded"
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="mapping" className="space-y-6">
                {currentChart && (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-text-primary">
                        Mapping: {currentChart.name}
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          variant={isMapping ? "destructive" : "default"}
                          onClick={() => setIsMapping(!isMapping)}
                        >
                          {isMapping ? 'Stop Mapping' : 'Start Mapping'}
                        </Button>
                        <Button onClick={handleSaveChart}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Chart
                        </Button>
                      </div>
                    </div>

                    {isMapping && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-blue-800 font-medium">
                          Click on the chart to add seats. Each click will create a new seat position.
                        </p>
                      </div>
                    )}

                    <div className="relative border border-border-default rounded-lg overflow-hidden">
                      <div
                        className={`relative ${isMapping ? 'cursor-crosshair' : 'cursor-default'}`}
                        onClick={handleChartClick}
                      >
                        <img 
                          src={currentChart.imageUrl} 
                          alt={currentChart.name}
                          className="w-full h-auto"
                        />
                        
                        {/* Render seats */}
                        {currentChart.seats.map(seat => (
                          <div
                            key={seat.id}
                            className="absolute w-6 h-6 rounded-full border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xs font-bold text-white hover:scale-110 transition-transform"
                            style={{
                              left: `${seat.x}%`,
                              top: `${seat.y}%`,
                              backgroundColor: getPriceCategoryColor(seat.priceCategory)
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSeat(seat);
                              setSeatForm({
                                seatNumber: seat.seatNumber,
                                row: seat.row || '',
                                section: seat.section || '',
                                priceCategory: seat.priceCategory,
                                isADA: seat.isADA
                              });
                              setActiveTab('configure');
                            }}
                            title={`${seat.seatNumber} - ${priceCategories.find(cat => cat.id === seat.priceCategory)?.name}`}
                          >
                            {seat.isADA ? '♿' : seat.seatNumber.slice(-2)}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge>Total Seats: {currentChart.seats.length}</Badge>
                      <Badge>ADA Seats: {currentChart.seats.filter(s => s.isADA).length}</Badge>
                      {priceCategories.map(category => (
                        <Badge key={category.id} style={{ backgroundColor: category.color }}>
                          {category.name}: {currentChart.seats.filter(s => s.priceCategory === category.id).length}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="configure" className="space-y-6">
                {selectedSeat && (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-text-primary">
                        Configure Seat: {selectedSeat.seatNumber}
                      </h3>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleSeatDelete(selectedSeat.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Seat
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="seatNumber">Seat Number</Label>
                          <Input
                            id="seatNumber"
                            value={seatForm.seatNumber}
                            onChange={(e) => setSeatForm({...seatForm, seatNumber: e.target.value})}
                            placeholder="e.g., A12, VIP-01"
                          />
                        </div>

                        <div>
                          <Label htmlFor="row">Row (Optional)</Label>
                          <Input
                            id="row"
                            value={seatForm.row}
                            onChange={(e) => setSeatForm({...seatForm, row: e.target.value})}
                            placeholder="e.g., A, B, 1, 2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="section">Section (Optional)</Label>
                          <Input
                            id="section"
                            value={seatForm.section}
                            onChange={(e) => setSeatForm({...seatForm, section: e.target.value})}
                            placeholder="e.g., VIP, General, Balcony"
                          />
                        </div>

                        <div>
                          <Label htmlFor="priceCategory">Price Category</Label>
                          <Select 
                            value={seatForm.priceCategory} 
                            onValueChange={(value) => setSeatForm({...seatForm, priceCategory: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select price category" />
                            </SelectTrigger>
                            <SelectContent>
                              {priceCategories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name} - ${category.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isADA"
                            checked={seatForm.isADA}
                            onCheckedChange={(checked) => setSeatForm({...seatForm, isADA: checked as boolean})}
                          />
                          <Label htmlFor="isADA" className="text-sm">
                            ADA Accessible Seat
                          </Label>
                        </div>

                        <Button onClick={handleSeatUpdate} className="w-full">
                          Update Seat
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-text-primary">Preview</h4>
                        <div className="border border-border-default p-4 rounded-lg space-y-2">
                          <p><strong>Seat:</strong> {seatForm.seatNumber}</p>
                          {seatForm.row && <p><strong>Row:</strong> {seatForm.row}</p>}
                          {seatForm.section && <p><strong>Section:</strong> {seatForm.section}</p>}
                          <p><strong>Price:</strong> ${priceCategories.find(cat => cat.id === seatForm.priceCategory)?.price || 0}</p>
                          <p><strong>Category:</strong> {priceCategories.find(cat => cat.id === seatForm.priceCategory)?.name}</p>
                          {seatForm.isADA && (
                            <Badge variant="secondary">♿ ADA Accessible</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                {currentChart && (
                  <>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-text-primary">
                        Preview: {currentChart.name}
                      </h3>
                      <div className="flex space-x-2">
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Export Chart
                        </Button>
                        <Button onClick={handleSaveChart}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Configuration
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-3">
                        <div className="relative border border-border-default rounded-lg overflow-hidden">
                          <img 
                            src={currentChart.imageUrl} 
                            alt={currentChart.name}
                            className="w-full h-auto"
                          />
                          
                          {/* Render seats with status colors */}
                          {currentChart.seats.map(seat => (
                            <div
                              key={seat.id}
                              className="absolute w-6 h-6 rounded-full border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xs font-bold text-white"
                              style={{
                                left: `${seat.x}%`,
                                top: `${seat.y}%`,
                                backgroundColor: getSeatStatusColor(seat.status)
                              }}
                              title={`${seat.seatNumber} - ${seat.status.toUpperCase()}`}
                            >
                              {seat.isADA ? '♿' : seat.seatNumber.slice(-2)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-text-primary">Legend</h4>
                        
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Seat Status</h5>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <span className="text-sm">Available</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <span className="text-sm">Sold</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">Reserved</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                            <span className="text-sm">Blocked</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">Price Categories</h5>
                          {priceCategories.map(category => (
                            <div key={category.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                <span className="text-sm">{category.name}</span>
                              </div>
                              <span className="text-sm font-medium">${category.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-border-default">
                          <h5 className="text-sm font-medium mb-2">Chart Statistics</h5>
                          <div className="space-y-1 text-sm">
                            <p>Total Seats: {currentChart.seats.length}</p>
                            <p>ADA Seats: {currentChart.seats.filter(s => s.isADA).length}</p>
                            <p>Available: {currentChart.seats.filter(s => s.status === 'available').length}</p>
                            <p>Sold: {currentChart.seats.filter(s => s.status === 'sold').length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventSeatingPage; 