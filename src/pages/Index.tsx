
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Star, ArrowRight, Play, Heart, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import EventCard from '@/components/EventCard';
import TestimonialCard from '@/components/TestimonialCard';
import InstructorCard from '@/components/InstructorCard';
import GlobalSearchForm from '@/components/GlobalSearchForm';

const Index = () => {
  const { user } = useAuth();

  const upcomingEvents = [
    {
      id: 1,
      title: "Chicago Steppers Social",
      date: "2024-02-15",
      time: "8:00 PM",
      location: "Chicago Cultural Center",
      city: "Chicago",
      state: "IL",
      image: "/placeholder.svg",
      price: 15,
      attendees: 120,
      category: "Social",
      instructor: "Angela Davis"
    },
    {
      id: 2, 
      title: "Beginner Workshop",
      date: "2024-02-18",
      time: "2:00 PM", 
      location: "Dance Studio Downtown",
      city: "Chicago",
      state: "IL",
      image: "/placeholder.svg",
      price: 25,
      attendees: 45,
      category: "Workshop",
      instructor: "Marcus Thompson"
    },
    {
      id: 3,
      title: "Advanced Techniques Masterclass",
      date: "2024-02-22",
      time: "7:30 PM",
      location: "Community Center",
      city: "Atlanta",
      state: "GA",
      image: "/placeholder.svg", 
      price: 35,
      attendees: 60,
      category: "Class",
      instructor: "Angela Davis"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Maria Rodriguez",
      location: "Chicago, IL",
      text: "SteppersLife connected me with an amazing community. The classes are top-notch!",
      rating: 5,
      image: "/placeholder.svg",
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "David Johnson", 
      location: "Atlanta, GA",
      text: "Best stepping platform out there. Found my dance partner and made lifelong friends.",
      rating: 5,
      image: "/placeholder.svg",
      date: "2024-01-10"
    }
  ];

  const instructors = [
    {
      id: 1,
      name: "Angela Davis",
      title: "Master Instructor",
      specialties: ["Chicago Stepping", "Advanced Techniques"],
      location: "Chicago, IL",
      rating: 4.9,
      reviewCount: 150,
      experience: "15+ years",
      image: "/placeholder.svg",
      verified: true
    },
    {
      id: 2, 
      name: "Marcus Thompson",
      title: "Community Instructor",
      specialties: ["Beginner Classes", "Social Dancing"],
      location: "Atlanta, GA", 
      rating: 4.8,
      reviewCount: 89,
      experience: "10+ years",
      image: "/placeholder.svg",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-background-main">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-b from-brand-primary/10 to-background-main">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-text-primary mb-6">
            Step Into Your
            <span className="text-brand-primary block">Dancing Journey</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Connect with the vibrant stepping community, find classes, events, and dance partners near you.
          </p>
          
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/classes">
                <Button size="lg" className="bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary">
                  <Play className="mr-2 h-5 w-5" />
                  Find Classes
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10">
                  Explore Events
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" className="bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary">
                  <Play className="mr-2 h-5 w-5" />
                  Join the Community
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4 bg-surface-card">
        <div className="container mx-auto max-w-4xl">
          <GlobalSearchForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-bold text-center text-text-primary mb-12">
            Why Choose SteppersLife?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-border-default">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-xl">Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-text-secondary">
                  Connect with passionate steppers in your city and build lasting friendships through dance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border-default">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-xl">Expert Instruction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-text-secondary">
                  Learn from certified instructors with years of experience in Chicago stepping and social dance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border-default">
              <CardHeader>
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-xl">All Skill Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-text-secondary">
                  From complete beginners to advanced dancers, find classes and events that match your skill level.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4 bg-surface-contrast">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-text-primary">Upcoming Events</h2>
            <Link to="/events">
              <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-3xl font-bold text-text-primary">Featured Instructors</h2>
            <Link to="/instructors">
              <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10">
                Meet All Instructors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-surface-contrast">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-bold text-center text-text-primary mb-12">
            What Our Community Says
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 px-4 bg-brand-primary text-center">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl font-bold text-text-on-primary mb-4">
              Ready to Start Your Stepping Journey?
            </h2>
            <p className="text-xl text-text-on-primary/90 mb-8">
              Join thousands of steppers already connected through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" variant="secondary" className="bg-text-on-primary text-brand-primary hover:bg-text-on-primary/90">
                  Join Free Today
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="outline" className="border-text-on-primary text-text-on-primary hover:bg-text-on-primary/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
