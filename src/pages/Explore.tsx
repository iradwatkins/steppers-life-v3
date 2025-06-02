
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlobalSearchForm from "@/components/GlobalSearchForm";
import EventCard from "@/components/EventCard";
import InstructorCard from "@/components/InstructorCard";
import { Search, Filter, MapPin, Calendar, Users, Star } from 'lucide-react';

const Explore = () => {
  const [activeTab, setActiveTab] = useState("events");

  // Mock data for events
  const events = [
    {
      id: '1',
      title: 'Chicago Steppers Social at Navy Pier',
      date: 'Saturday, Jan 15',
      time: '8:00 PM',
      location: 'Navy Pier, Chicago, IL',
      category: 'Social Dance',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop',
      attendees: 127
    },
    {
      id: '2',
      title: 'Beginner Stepping Classes',
      date: 'Monday, Jan 17',
      time: '7:00 PM',
      location: 'South Side Cultural Center',
      category: 'Class',
      image: 'https://images.unsplash.com/photo-1574279606130-09958dc756f4?w=400&h=300&fit=crop',
      attendees: 45
    },
    {
      id: '3',
      title: 'Annual Steppers Convention 2024',
      date: 'Friday, Feb 25',
      time: '6:00 PM',
      location: 'McCormick Place, Chicago, IL',
      category: 'Convention',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      attendees: 1250
    },
    {
      id: '4',
      title: 'Atlanta Steppers Workshop',
      date: 'Saturday, Jan 22',
      time: '2:00 PM',
      location: 'Atlanta Dance Studio',
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      attendees: 85
    }
  ];

  // Mock data for instructors
  const instructors = [
    {
      id: '1',
      name: 'Marcus Williams',
      title: 'Master Stepping Instructor',
      location: 'Chicago, IL',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
      rating: 4.9,
      students: 500,
      specialties: ['Classic Step', 'Speed Step', 'Competition'],
      verified: true
    },
    {
      id: '2',
      name: 'Tanya Johnson',
      title: 'Professional Dance Instructor',
      location: 'Atlanta, GA',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=400&h=300&fit=crop&crop=face',
      rating: 4.8,
      students: 350,
      specialties: ['Beginner Classes', 'Couples Step', 'Line Step'],
      verified: true
    },
    {
      id: '3',
      name: 'Robert Davis',
      title: 'Stepping Pioneer & Judge',
      location: 'Detroit, MI',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
      rating: 5.0,
      students: 750,
      specialties: ['Traditional Step', 'Judge Training', 'History'],
      verified: true
    },
    {
      id: '4',
      name: 'Lisa Thompson',
      title: 'Competition Champion',
      location: 'Houston, TX',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face',
      rating: 4.7,
      students: 200,
      specialties: ['Competition Prep', 'Advanced Techniques', 'Performance'],
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-background-main">
      {/* Header Section */}
      <section className="bg-brand-primary text-text-on-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              Explore the Stepping Community
            </h1>
            <p className="text-xl text-text-on-primary/90 max-w-3xl mx-auto">
              Discover events, classes, and instructors in the vibrant world of stepping. 
              Connect with fellow dancers and take your skills to the next level.
            </p>
          </div>
          
          <GlobalSearchForm />
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-surface-card border-b border-border-default py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-brand-primary text-brand-primary">
                All Locations
              </Badge>
              <Badge variant="outline">Chicago, IL</Badge>
              <Badge variant="outline">Atlanta, GA</Badge>
              <Badge variant="outline">Detroit, MI</Badge>
              <Badge variant="outline">Houston, TX</Badge>
            </div>
            
            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="social">Social Dance</SelectItem>
                  <SelectItem value="class">Classes</SelectItem>
                  <SelectItem value="workshop">Workshops</SelectItem>
                  <SelectItem value="convention">Conventions</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-96 mb-8">
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Events & Classes
              </TabsTrigger>
              <TabsTrigger value="instructors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Instructors
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">
                  Upcoming Events & Classes
                </h2>
                <p className="text-text-secondary">
                  {events.length} events found in your area
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="instructors">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">
                  Featured Instructors
                </h2>
                <p className="text-text-secondary">
                  {instructors.length} verified instructors available
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {instructors.map((instructor) => (
                  <InstructorCard key={instructor.id} {...instructor} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Results
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;
