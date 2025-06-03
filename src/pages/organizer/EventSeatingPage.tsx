import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle, Edit3, Armchair } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SeatingSection {
  id: string;
  name: string;
  description?: string; // e.g., "Near the stage", "Bar area"
  capacity?: string;
}

interface SeatingTable {
  id: string;
  nameOrNumber: string;
  seats: string; // Number of seats at the table
  sectionId?: string; // Optional: to assign table to a section
}

type SeatingArrangement = 'general_admission' | 'reserved_seating';

const EventSeatingPage = () => {
  const eventId = 'mock-event-123'; // Placeholder
  const [seatingArrangement, setSeatingArrangement] = useState<SeatingArrangement>('general_admission');
  
  const [sections, setSections] = useState<SeatingSection[]>([]);
  const [currentSection, setCurrentSection] = useState<Partial<SeatingSection>>({});
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [currentTable, setCurrentTable] = useState<Partial<SeatingTable>>({});
  const [editingTableId, setEditingTableId] = useState<string | null>(null);

  // Section Handlers
  const handleSectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSection({ ...currentSection, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateSection = () => {
    if (!currentSection.name) return alert('Section name is required.');
    if (editingSectionId) {
      setSections(sections.map(s => s.id === editingSectionId ? { ...s, ...currentSection } : s));
      setEditingSectionId(null);
    } else {
      setSections([...sections, { ...currentSection, id: Date.now().toString() } as SeatingSection]);
    }
    setCurrentSection({});
  };

  const handleEditSection = (section: SeatingSection) => {
    setEditingSectionId(section.id);
    setCurrentSection(section);
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  // Table Handlers
  const handleTableInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTable({ ...currentTable, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateTable = () => {
    if (!currentTable.nameOrNumber || !currentTable.seats) return alert('Table name/number and seats are required.');
    if (editingTableId) {
      setTables(tables.map(t => t.id === editingTableId ? { ...t, ...currentTable } : t));
      setEditingTableId(null);
    } else {
      setTables([...tables, { ...currentTable, id: Date.now().toString() } as SeatingTable]);
    }
    setCurrentTable({});
  };

  const handleEditTable = (table: SeatingTable) => {
    setEditingTableId(table.id);
    setCurrentTable(table);
  };

  const handleDeleteTable = (id: string) => {
    setTables(tables.filter(t => t.id !== id));
  };
  
  const handleSaveConfiguration = () => {
    console.log('Saving seating configuration:', { eventId, seatingArrangement, sections, tables });
    // API call to save would go here
    alert('Seating configuration saved (mock)!');
  };

  return (
    <div className="min-h-screen bg-background-main py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-surface-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-text-primary flex items-center">
              <Armchair className="mr-2 h-6 w-6 text-brand-primary" />
              Configure Seating for Event ID: {eventId}
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Define seating arrangements like General Admission, Sections, or Tables.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <Label htmlFor="seatingArrangement" className="text-text-primary font-medium">Seating Arrangement Type</Label>
              <Select onValueChange={(value) => setSeatingArrangement(value as SeatingArrangement)} defaultValue={seatingArrangement}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select seating type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general_admission">General Admission</SelectItem>
                  <SelectItem value="reserved_seating">Reserved Seating (Sections/Tables)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {seatingArrangement === 'reserved_seating' && (
              <>
                <Separator />
                {/* Sections Management */}
                <div className="border border-border-default p-6 rounded-lg bg-background-main shadow">
                  <h3 className="text-lg font-semibold text-text-primary mb-1">Manage Sections</h3>
                  <p className="text-sm text-text-secondary mb-4">Define areas like 'VIP', 'Balcony', or 'Floor Section A'.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input name="name" value={currentSection.name || ''} onChange={handleSectionInputChange} placeholder="Section Name (e.g., VIP Area)" />
                    <Input name="capacity" value={currentSection.capacity || ''} onChange={handleSectionInputChange} placeholder="Section Capacity (Optional)" type="number"/>
                  </div>
                  <Input name="description" value={currentSection.description || ''} onChange={handleSectionInputChange} placeholder="Section Description (Optional)" className="mb-4"/>
                  <Button onClick={handleAddOrUpdateSection} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" /> {editingSectionId ? 'Update Section' : 'Add Section'}
                  </Button>
                  {editingSectionId && <Button onClick={() => {setEditingSectionId(null); setCurrentSection({});}} variant="outline" className="ml-2">Cancel</Button>}
                  
                  {sections.length > 0 && <Separator className="my-6"/>}
                  <div className="space-y-3 mt-4">
                    {sections.map(section => (
                      <div key={section.id} className="flex justify-between items-center p-3 bg-surface-accent rounded-md border border-border-default">
                        <div>
                            <p className="font-medium text-text-primary">{section.name} {section.capacity ? `(Capacity: ${section.capacity})` : ''}</p>
                            {section.description && <p className="text-sm text-text-secondary">{section.description}</p>}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditSection(section)}><Edit3 className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSection(section.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
                {/* Tables Management */}
                <div className="border border-border-default p-6 rounded-lg bg-background-main shadow">
                  <h3 className="text-lg font-semibold text-text-primary mb-1">Manage Tables</h3>
                  <p className="text-sm text-text-secondary mb-4">Define individual tables and their seating capacity.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input name="nameOrNumber" value={currentTable.nameOrNumber || ''} onChange={handleTableInputChange} placeholder="Table Name/Number (e.g., Table 10)" />
                    <Input name="seats" value={currentTable.seats || ''} onChange={handleTableInputChange} placeholder="Number of Seats" type="number" />
                  </div>
                  {/* Optional: Select section for table
                  <Select onValueChange={(val) => setCurrentTable({...currentTable, sectionId: val})} value={currentTable.sectionId || ''}>
                     <SelectTrigger><SelectValue placeholder="Assign to Section (Optional)" /></SelectTrigger>
                     <SelectContent>
                        {sections.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                     </SelectContent>
                  </Select>*/}
                  <Button onClick={handleAddOrUpdateTable} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" /> {editingTableId ? 'Update Table' : 'Add Table'}
                  </Button>
                  {editingTableId && <Button onClick={() => {setEditingTableId(null); setCurrentTable({});}} variant="outline" className="ml-2">Cancel</Button>}
                  
                  {tables.length > 0 && <Separator className="my-6"/>}
                  <div className="space-y-3 mt-4">
                    {tables.map(table => (
                      <div key={table.id} className="flex justify-between items-center p-3 bg-surface-accent rounded-md border border-border-default">
                         <p className="font-medium text-text-primary">{table.nameOrNumber} (Seats: {table.seats})</p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditTable(table)}><Edit3 className="h-4 w-4" /></Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteTable(table.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveConfiguration} className="bg-green-600 hover:bg-green-700 text-white">
                Save Seating Configuration
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EventSeatingPage; 