
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "@/components/EventCard";
import { Calendar, MapPin, Clock, Users, Plus } from 'lucide-react';

const Events = () => {
  // Mock events data with more variety
  const upcomingEvents = [
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
    }
  ];

  const featuredEvents = [
    {
      id: '4',
      title: 'Masters Workshop with Chicago Legends',
      date: 'Sunday, Jan 30',
      time: '1:00 PM',
      location: 'Dance Center Chicago',
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      attendees: 200
    },
    {
      id: '5',
      title: 'Valentine\'s Day Stepping Party',
      date: 'Friday, Feb 14',
      time: '8:00 PM',
      location: 'Grand Ballroom, Atlanta',
      category: 'Social Dance',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      attendees: 300
    }
  ];

  return (
    <div className="min-h-screen bg-background-main">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-primary to-brand-primary-hover text-text-on-primary py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              Stepping Events & Classes
            </h1>
            <p className="text-xl text-text-on-primary/90 max-w-3xl mx-auto mb-8">
              Join the community at exciting stepping events nationwide. From social dances 
              to intensive workshops, find your next stepping adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                <Plus className="mr-2 h-5 w-5" />
                Create Event
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Calendar className="mr-2 h-5 w-5" />
                View Calendar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-surface-card border-b border-border-default">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">25+</h3>
              <p className="text-text-secondary">This Week</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">150+</h3>
              <p className="text-text-secondary">This Month</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">15</h3>
              <p className="text-text-secondary">Cities</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">5K+</h3>
              <p className="text-text-secondary">Attendees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-96 mb-8">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
                  Upcoming Events
                </h2>
                <p className="text-text-secondary text-lg">
                  Don't miss these exciting stepping events happening soon.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="featured">
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
                  Featured Events
                </h2>
                <p className="text-text-secondary text-lg">
                  Special events you won't want to miss.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <div className="mb-8 text-center">
                <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
                  Past Events
                </h2>
                <p className="text-text-secondary text-lg">
                  Check out highlights from previous events.
                </p>
                <div className="mt-8 p-8 border-2 border-dashed border-border-default rounded-lg">
                  <Calendar className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                  <p className="text-text-secondary">Past events archive coming soon</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-surface-contrast">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
            Host Your Own Event
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Ready to organize a stepping event? Our platform makes it easy to create, 
            promote, and manage your own stepping gatherings.
          </p>
          <Button size="lg" className="bg-brand-primary hover:bg-brand-primary-hover">
            <Plus className="mr-2 h-5 w-5" />
            Create Your Event
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Events;
