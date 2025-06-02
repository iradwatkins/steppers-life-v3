
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, DollarSign, Filter, Plus, Star } from 'lucide-react';
import EventCard from '@/components/EventCard';

const Events = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');

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
    },
    {
      id: 4,
      title: "Advanced Technique Masterclass",
      date: "2024-07-25",
      time: "6:00 PM",
      location: "Elite Dance Academy",
      city: "Houston",
      state: "TX",
      price: 35,
      image: "/placeholder.svg",
      category: "Class",
      attendees: 45,
      instructor: "Carlos Martinez"
    },
    {
      id: 5,
      title: "Monthly Step Showcase",
      date: "2024-07-28",
      time: "7:30 PM",
      location: "Grand Theater",
      city: "Dallas",
      state: "TX",
      price: 20,
      image: "/placeholder.svg",
      category: "Performance",
      attendees: 150,
      instructor: "Multiple Artists"
    },
    {
      id: 6,
      title: "Youth Step Training Camp",
      date: "2024-08-02",
      time: "10:00 AM",
      location: "Youth Center",
      city: "Memphis",
      state: "TN",
      price: 30,
      image: "/placeholder.svg",
      category: "Workshop",
      attendees: 40,
      instructor: "Coach Williams"
    }
  ];

  const cities = ["Chicago, IL", "Atlanta, GA", "Detroit, MI", "Houston, TX", "Dallas, TX", "Memphis, TN"];
  
  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.category.toLowerCase() === filterType;
    const matchesCity = !selectedCity || `${event.city}, ${event.state}` === selectedCity;
    return matchesType && matchesCity;
  });

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const featuredEvent = upcomingEvents[0];

  return (
    <div className="min-h-screen bg-background-main py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-text-primary mb-2">
              Stepping Events
            </h1>
            <p className="text-text-secondary text-lg">
              Discover and join stepping events in your area
            </p>
          </div>
          <Button className="bg-brand-primary hover:bg-brand-primary-hover mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Featured Event */}
        {featuredEvent && (
          <Card className="mb-8 overflow-hidden bg-gradient-to-r from-brand-primary to-brand-primary-hover text-text-on-primary">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-text-on-primary text-brand-primary mb-4">
                    Featured Event
                  </Badge>
                  <h2 className="font-serif text-3xl font-bold mb-4">
                    {featuredEvent.title}
                  </h2>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3" />
                      <span>{new Date(featuredEvent.date).toLocaleDateString()} at {featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span>{featuredEvent.location}, {featuredEvent.city}, {featuredEvent.state}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3" />
                      <span>{featuredEvent.attendees} attending</span>
                    </div>
                  </div>
                  <Button className="bg-text-on-primary text-brand-primary hover:bg-text-on-primary/90">
                    Register Now - ${featuredEvent.price}
                  </Button>
                </div>
                <div className="hidden md:block">
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  size="sm"
                >
                  All Events
                </Button>
                <Button
                  variant={filterType === 'competition' ? 'default' : 'outline'}
                  onClick={() => setFilterType('competition')}
                  size="sm"
                >
                  Competitions
                </Button>
                <Button
                  variant={filterType === 'workshop' ? 'default' : 'outline'}
                  onClick={() => setFilterType('workshop')}
                  size="sm"
                >
                  Workshops
                </Button>
                <Button
                  variant={filterType === 'social' ? 'default' : 'outline'}
                  onClick={() => setFilterType('social')}
                  size="sm"
                >
                  Socials
                </Button>
                <Button
                  variant={filterType === 'class' ? 'default' : 'outline'}
                  onClick={() => setFilterType('class')}
                  size="sm"
                >
                  Classes
                </Button>
              </div>
              
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Cities</SelectItem>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Event Categories */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {['Competition', 'Workshop', 'Social', 'Class', 'Performance'].map((category) => (
            <Card key={category} className="text-center cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-text-on-primary" />
                </div>
                <h3 className="font-semibold text-text-primary">{category}</h3>
                <p className="text-sm text-text-secondary">
                  {events.filter(e => e.category === category).length} events
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Events Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-text-primary">
            Upcoming Events ({filteredEvents.length})
          </h2>
          <div className="flex gap-2">
            <Badge variant="secondary">This Week</Badge>
            <Badge variant="outline">This Month</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-surface-contrast">
          <CardContent className="p-8 text-center">
            <h3 className="font-serif text-2xl font-bold text-text-primary mb-4">
              Don't See Your Event?
            </h3>
            <p className="text-text-secondary mb-6">
              Create and promote your own stepping event to reach the community
            </p>
            <Button className="bg-brand-primary hover:bg-brand-primary-hover">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;
