
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Star, ArrowRight, Play, CheckCircle } from 'lucide-react';
import EventCard from '@/components/EventCard';
import InstructorCard from '@/components/InstructorCard';
import TestimonialCard from '@/components/TestimonialCard';

const Index = () => {
  const featuredEvents = [
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
    }
  ];

  const featuredInstructors = [
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
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Angela Smith",
      location: "Chicago, IL",
      rating: 5,
      text: "SteppersLife has completely transformed my stepping journey. The community is amazing and the instructors are top-notch!",
      image: "/placeholder.svg",
      date: "2024-06-15"
    },
    {
      id: 2,
      name: "Michael Brown",
      location: "Detroit, MI",
      rating: 5,
      text: "Found my stepping crew through this platform. The events are well-organized and the atmosphere is always positive.",
      image: "/placeholder.svg",
      date: "2024-06-10"
    }
  ];

  return (
    <div className="min-h-screen bg-background-main">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary to-brand-primary-hover text-text-on-primary py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Your Stepping Journey Starts Here
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-text-on-primary/90 max-w-2xl mx-auto">
            Connect with the stepping community, find events, learn from master instructors, and elevate your stepping experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-surface-card text-text-primary hover:bg-surface-card/90">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
            <Link to="/auth/register">
              <Button size="lg" variant="outline" className="border-text-on-primary text-text-on-primary hover:bg-text-on-primary hover:text-brand-primary">
                Join Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything You Need to Step
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              From finding events to connecting with instructors, SteppersLife is your all-in-one platform for the stepping community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Calendar className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <CardTitle>Discover Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Find stepping events, competitions, and workshops in your area or nationwide.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <CardTitle>Connect with Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Join a vibrant community of steppers, share experiences, and make lasting connections.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Star className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <CardTitle>Learn from Masters</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">
                  Access classes and workshops from verified master steppers and experienced instructors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 px-4 bg-surface-contrast">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">
                Featured Events
              </h2>
              <p className="text-text-secondary">Don't miss these upcoming stepping events</p>
            </div>
            <Link to="/events">
              <Button variant="outline">
                View All Events
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">
                Master Instructors
              </h2>
              <p className="text-text-secondary">Learn from the best in the stepping community</p>
            </div>
            <Link to="/instructors">
              <Button variant="outline">
                View All Instructors
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {featuredInstructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-surface-contrast">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
              What Our Community Says
            </h2>
            <p className="text-text-secondary text-lg">
              Real stories from real steppers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-brand-primary text-text-on-primary">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Stepping Community?
          </h2>
          <p className="text-xl mb-8 text-text-on-primary/90 max-w-2xl mx-auto">
            Start your journey today and connect with steppers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register">
              <Button size="lg" className="bg-surface-card text-text-primary hover:bg-surface-card/90">
                <CheckCircle className="w-5 h-5 mr-2" />
                Sign Up Free
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="border-text-on-primary text-text-on-primary hover:bg-text-on-primary hover:text-brand-primary">
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
