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
      {/* Hero Section - Responsive for all devices including folds */}
      <section className="relative py-12 xs:py-16 sm:py-20 px-3 xs:px-4 text-center bg-gradient-to-b from-brand-primary/10 to-background-main">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl fold-open:text-7xl font-bold text-text-primary mb-4 xs:mb-6 leading-tight">
            Step Into Your
            <span className="text-brand-primary block">Dancing Journey</span>
          </h1>
          <p className="text-base xs:text-lg sm:text-xl text-text-secondary mb-6 xs:mb-8 max-w-2xl mx-auto px-2">
            Connect with the vibrant stepping community, find classes, events, and dance partners near you.
          </p>
          
          {user ? (
            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 xs:gap-4 justify-center items-center">
              <Link to="/classes" className="w-full xs:w-auto">
                <Button size="lg" className="w-full xs:w-auto bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary text-sm xs:text-base">
                  <Play className="mr-2 h-4 w-4 xs:h-5 xs:w-5" />
                  Find Classes
                </Button>
              </Link>
              <Link to="/events" className="w-full xs:w-auto">
                <Button size="lg" variant="outline" className="w-full xs:w-auto border-brand-primary text-brand-primary hover:bg-brand-primary/10 text-sm xs:text-base">
                  Browse Events
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 xs:gap-4 justify-center items-center">
              <Link to="/auth/register" className="w-full xs:w-auto">
                <Button size="lg" className="w-full xs:w-auto bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary text-sm xs:text-base">
                  <Play className="mr-2 h-4 w-4 xs:h-5 xs:w-5" />
                  Join the Community
                </Button>
              </Link>
              <Link to="/auth/login" className="w-full xs:w-auto">
                <Button size="lg" variant="outline" className="w-full xs:w-auto border-brand-primary text-brand-primary hover:bg-brand-primary/10 text-sm xs:text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Search Section - Optimized for all mobile devices */}
      <section className="py-8 xs:py-10 sm:py-12 px-3 xs:px-4 bg-surface-card">
        <div className="container mx-auto max-w-4xl">
          <GlobalSearchForm />
        </div>
      </section>

      {/* Features Section - Responsive grid for all screen sizes */}
      <section className="py-12 xs:py-14 sm:py-16 px-3 xs:px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-2xl xs:text-3xl font-bold text-center text-text-primary mb-8 xs:mb-10 sm:mb-12">
            Why Choose SteppersLife?
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 fold-open:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 xs:gap-8">
            <Card className="text-center border-border-default">
              <CardHeader className="pb-4">
                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
                  <Heart className="h-5 w-5 xs:h-6 xs:w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-lg xs:text-xl">Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-text-secondary text-sm xs:text-base">
                  Connect with passionate steppers in your city and build lasting friendships through dance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border-default">
              <CardHeader className="pb-4">
                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
                  <Zap className="h-5 w-5 xs:h-6 xs:w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-lg xs:text-xl">Expert Instruction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-text-secondary text-sm xs:text-base">
                  Learn from certified instructors with years of experience in Chicago stepping and social dance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-border-default sm:col-span-2 fold-open:col-span-1 md:col-span-1">
              <CardHeader className="pb-4">
                <div className="w-10 h-10 xs:w-12 xs:h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
                  <Target className="h-5 w-5 xs:h-6 xs:w-6 text-brand-primary" />
                </div>
                <CardTitle className="text-lg xs:text-xl">All Skill Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-text-secondary text-sm xs:text-base">
                  From complete beginners to advanced dancers, find classes and events that match your skill level.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Events - Responsive for all devices */}
      <section className="py-12 xs:py-14 sm:py-16 px-3 xs:px-4 bg-surface-contrast">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-6 xs:mb-8 gap-4 xs:gap-0">
            <h2 className="font-serif text-2xl xs:text-3xl font-bold text-text-primary">Upcoming Events</h2>
            <Link to="/events">
              <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 text-sm xs:text-base">
                View All Events
                <ArrowRight className="ml-2 h-3 w-3 xs:h-4 xs:w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 fold-open:grid-cols-3 md:grid-cols-3 gap-4 xs:gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Instructors - Optimized for foldables */}
      <section className="py-12 xs:py-14 sm:py-16 px-3 xs:px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-6 xs:mb-8 gap-4 xs:gap-0">
            <h2 className="font-serif text-2xl xs:text-3xl font-bold text-text-primary">Featured Instructors</h2>
            <Link to="/instructors">
              <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 text-sm xs:text-base">
                Meet All Instructors
                <ArrowRight className="ml-2 h-3 w-3 xs:h-4 xs:w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-1 fold-open:grid-cols-2 md:grid-cols-2 gap-4 xs:gap-6">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Responsive layout */}
      <section className="py-12 xs:py-14 sm:py-16 px-3 xs:px-4 bg-surface-contrast">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-2xl xs:text-3xl font-bold text-center text-text-primary mb-8 xs:mb-10 sm:mb-12">
            What Our Community Says
          </h2>
          <div className="grid grid-cols-1 fold-open:grid-cols-2 md:grid-cols-2 gap-6 xs:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive buttons */}
      {!user && (
        <section className="py-12 xs:py-14 sm:py-16 px-3 xs:px-4 bg-brand-primary text-center">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-2xl xs:text-3xl font-bold text-text-on-primary mb-3 xs:mb-4">
              Ready to Start Your Stepping Journey?
            </h2>
            <p className="text-lg xs:text-xl text-text-on-primary/90 mb-6 xs:mb-8">
              Join thousands of steppers already connected through our platform.
            </p>
            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 xs:gap-4 justify-center items-center">
              <Link to="/auth/register" className="w-full xs:w-auto">
                <Button size="lg" variant="secondary" className="w-full xs:w-auto bg-text-on-primary text-brand-primary hover:bg-text-on-primary/90 text-sm xs:text-base">
                  Join Free Today
                </Button>
              </Link>
              <Link to="/auth/login" className="w-full xs:w-auto">
                <Button size="lg" variant="outline" className="w-full xs:w-auto border-text-on-primary text-text-on-primary hover:bg-text-on-primary/10 text-sm xs:text-base">
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
