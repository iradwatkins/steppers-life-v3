
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GlobalSearchForm from "@/components/GlobalSearchForm";
import EventCard from "@/components/EventCard";
import InstructorCard from "@/components/InstructorCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Calendar, Users, Star, ArrowRight, Play, BookOpen, Trophy, Heart } from 'lucide-react';

const Index = () => {
  // Mock data for featured events
  const featuredEvents = [
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

  // Mock data for featured instructors
  const featuredInstructors = [
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
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      name: 'Sarah Mitchell',
      location: 'Houston, TX',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      testimonial: "SteppersLife changed my life! I found my stepping family and improved my skills through amazing instructors. The community here is incredible.",
      title: 'Stepping Enthusiast'
    },
    {
      name: 'Michael Thompson',
      location: 'Chicago, IL',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      testimonial: "As an instructor, this platform helps me connect with students nationwide. The event management tools are fantastic for organizing classes.",
      title: 'Professional Instructor'
    },
    {
      name: 'Jessica Brown',
      location: 'Atlanta, GA',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      testimonial: "I was a complete beginner and found the most welcoming community here. The beginner-friendly events made all the difference in my journey."
    }
  ];

  return (
    <div className="min-h-screen bg-background-main">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-primary to-brand-primary-hover text-text-on-primary overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop')"
          }}
        ></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-6">
              Welcome to SteppersLife.com
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-text-on-primary/90">
              The premier destination for the U.S. Stepping community. 
              Discover events, connect with dancers, and step into your rhythm.
            </p>
            
            {/* Search Form */}
            <div className="mt-12">
              <GlobalSearchForm />
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                <Link to="/events">
                  <Play className="mr-2 h-5 w-5" />
                  Explore Events
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/classes">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Find Classes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-surface-card border-b border-border-default">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Calendar className="h-8 w-8 text-brand-primary mb-3" />
              <h3 className="text-3xl font-bold text-text-primary">250+</h3>
              <p className="text-text-secondary">Monthly Events</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-brand-primary mb-3" />
              <h3 className="text-3xl font-bold text-text-primary">12K+</h3>
              <p className="text-text-secondary">Community Members</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-brand-primary mb-3" />
              <h3 className="text-3xl font-bold text-text-primary">15+</h3>
              <p className="text-text-secondary">Cities Nationwide</p>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="h-8 w-8 text-brand-primary mb-3" />
              <h3 className="text-3xl font-bold text-text-primary">500+</h3>
              <p className="text-text-secondary">Certified Instructors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-background-main">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Featured Events
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Don't miss out on the hottest stepping events happening near you. 
              From social dances to workshops and conventions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary-hover">
              <Link to="/events">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Instructors Section */}
      <section className="py-16 bg-surface-contrast">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Featured Instructors
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Learn from the best in the stepping community. Our verified instructors 
              bring years of experience and passion to help you master your craft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredInstructors.map((instructor) => (
              <InstructorCard key={instructor.id} {...instructor} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/instructors">
                View All Instructors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background-main">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Hear from steppers across the nation about how SteppersLife has 
              transformed their dancing journey and connected them with amazing people.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter/Community Section */}
      <section className="py-16 bg-brand-primary text-text-on-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Heart className="h-12 w-12 mx-auto mb-6" />
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">
              Stay Connected with the Stepping Community
            </h2>
            <p className="text-lg mb-8 text-text-on-primary/90">
              Get the latest updates on events, new instructors, and stepping news. 
              Join our newsletter and never miss a beat in the stepping world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-text-primary border-0 focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-brand-primary hover:bg-white/90 px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-surface-contrast">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Ready to Step Into the Community?
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of steppers across the nation. Create your profile, 
            find events, and connect with fellow dancers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-primary hover:bg-brand-primary-hover">
              <Link to="/auth/register">Join the Community</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
