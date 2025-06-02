
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, MapPin, Calendar, Users, Star } from 'lucide-react';
import EventCard from '@/components/EventCard';
import InstructorCard from '@/components/InstructorCard';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const events = [
    {
      id: 1,
      title: "Chicago Step Championship",
      date: "2024-07-15",
      time: "7:00 PM",
      location: "Chicago Cultural Center",
      city: "Chicago",
      state: "IL",
      price: 45,
      image: "/placeholder.svg",
      category: "Competition",
      attendees: 250,
      instructor: "Marcus Johnson"
    },
    {
      id: 2,
      title: "Beginner Step Workshop",
      date: "2024-07-20",
      time: "2:00 PM",
      location: "Dance Studio One",
      city: "Atlanta",
      state: "GA",
      price: 25,
      image: "/placeholder.svg",
      category: "Workshop",
      attendees: 30,
      instructor: "Lisa Davis"
    },
    {
      id: 3,
      title: "Saturday Step Social",
      date: "2024-07-22",
      time: "8:00 PM",
      location: "Community Center",
      city: "Detroit",
      state: "MI",
      price: 15,
      image: "/placeholder.svg",
      category: "Social",
      attendees: 75,
      instructor: "DJ Smooth"
    }
  ];

  const instructors = [
    {
      id: 1,
      name: "Marcus Johnson",
      title: "Master Stepper",
      location: "Chicago, IL",
      rating: 4.9,
      reviewCount: 127,
      image: "/placeholder.svg",
      specialties: ["Competition", "Advanced"],
      verified: true,
      experience: "15+ years"
    },
    {
      id: 2,
      name: "Lisa Davis",
      title: "Step Instructor",
      location: "Atlanta, GA",
      rating: 4.8,
      reviewCount: 89,
      image: "/placeholder.svg",
      specialties: ["Beginner", "Workshop"],
      verified: true,
      experience: "8+ years"
    },
    {
      id: 3,
      name: "Carlos Martinez",
      title: "Professional Stepper",
      location: "Houston, TX",
      rating: 4.7,
      reviewCount: 156,
      image: "/placeholder.svg",
      specialties: ["Intermediate", "Social"],
      verified: true,
      experience: "12+ years"
    }
  ];

  const cities = ["Chicago, IL", "Atlanta, GA", "Detroit, MI", "Houston, TX", "Dallas, TX", "Memphis, TN"];
  const categories = ["Competition", "Workshop", "Social", "Class", "Performance"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || `${event.city}, ${event.state}` === selectedCity;
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !selectedCity || instructor.location === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-background-main py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">
            Explore Stepping
          </h1>
          <p className="text-text-secondary text-lg">
            Discover events, instructors, and opportunities in the stepping community
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-surface-contrast rounded-lg p-1">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'events'
                ? 'bg-surface-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'instructors'
                ? 'bg-surface-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Instructors
          </button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {activeTab === 'events' && (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button className="bg-brand-primary hover:bg-brand-primary-hover">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-text-primary">
                Events ({filteredEvents.length})
              </h2>
              <div className="flex gap-2">
                <Badge variant="secondary">Upcoming</Badge>
                <Badge variant="outline">This Week</Badge>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'instructors' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-text-primary">
                Instructors ({filteredInstructors.length})
              </h2>
              <div className="flex gap-2">
                <Badge variant="secondary">Verified</Badge>
                <Badge variant="outline">Available</Badge>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstructors.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'events' && filteredEvents.length === 0) || 
          (activeTab === 'instructors' && filteredInstructors.length === 0)) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface-contrast rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No results found
            </h3>
            <p className="text-text-secondary mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('');
                setSelectedCategory('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
