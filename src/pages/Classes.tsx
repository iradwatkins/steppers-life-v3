
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import EventCard from "@/components/EventCard";
import InstructorCard from "@/components/InstructorCard";
import { BookOpen, Users, Clock, Star, MapPin, Play } from 'lucide-react';

const Classes = () => {
  const classes = [
    {
      id: '1',
      title: 'Beginner Stepping Fundamentals',
      date: 'Every Monday',
      time: '7:00 PM',
      location: 'South Side Cultural Center',
      category: 'Beginner',
      image: 'https://images.unsplash.com/photo-1574279606130-09958dc756f4?w=400&h=300&fit=crop',
      attendees: 15
    },
    {
      id: '2',
      title: 'Intermediate Step Techniques',
      date: 'Every Wednesday',
      time: '8:00 PM',
      location: 'Chicago Dance Studio',
      category: 'Intermediate',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      attendees: 12
    },
    {
      id: '3',
      title: 'Advanced Competition Prep',
      date: 'Every Friday',
      time: '7:30 PM',
      location: 'Elite Dance Academy',
      category: 'Advanced',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop',
      attendees: 8
    }
  ];

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
    }
  ];

  return (
    <div className="min-h-screen bg-background-main">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-primary to-brand-primary-hover text-text-on-primary py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              Stepping Classes & Workshops
            </h1>
            <p className="text-xl text-text-on-primary/90 max-w-3xl mx-auto mb-8">
              Master the art of stepping with our expert instructors. From beginner basics 
              to advanced techniques, find the perfect class for your skill level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                <Play className="mr-2 h-5 w-5" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Curriculum
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Class Levels Overview */}
      <section className="py-16 bg-surface-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
              Find Your Level
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Our structured curriculum ensures you progress at the right pace, 
              building skills and confidence every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center bg-surface-card border-border-default hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-feedback-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-feedback-success" />
                </div>
                <h3 className="font-serif text-xl font-bold text-text-primary mb-2">Beginner</h3>
                <p className="text-text-secondary mb-4">
                  Learn the fundamental steps, basic rhythm, and proper posture. 
                  Perfect for those new to stepping.
                </p>
                <Badge className="bg-feedback-success text-white">
                  New to Stepping
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center bg-surface-card border-border-default hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-feedback-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-feedback-warning" />
                </div>
                <h3 className="font-serif text-xl font-bold text-text-primary mb-2">Intermediate</h3>
                <p className="text-text-secondary mb-4">
                  Build on basics with complex patterns, partner work, and 
                  performance techniques.
                </p>
                <Badge className="bg-feedback-warning text-white">
                  Some Experience
                </Badge>
              </CardContent>
            </Card>

            <Card className="text-center bg-surface-card border-border-default hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-text-primary mb-2">Advanced</h3>
                <p className="text-text-secondary mb-4">
                  Master advanced techniques, competition preparation, and 
                  creative expression.
                </p>
                <Badge className="bg-brand-primary text-white">
                  Experienced Stepper
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Classes */}
      <section className="py-16 bg-background-main">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
              Current Classes
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Join our ongoing classes and start your stepping journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {classes.map((classItem) => (
              <EventCard key={classItem.id} {...classItem} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-brand-primary hover:bg-brand-primary-hover">
              View All Classes
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section className="py-16 bg-surface-contrast">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
              Learn from the Best
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Our certified instructors bring years of experience and passion 
              to help you master the art of stepping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} {...instructor} />
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline">
              View All Instructors
            </Button>
          </div>
        </div>
      </section>

      {/* Private Lessons CTA */}
      <section className="py-16 bg-brand-primary text-text-on-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Want Personalized Instruction?
          </h2>
          <p className="text-lg text-text-on-primary/90 mb-8 max-w-2xl mx-auto">
            Book private lessons with our certified instructors for personalized 
            attention and accelerated learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
              Book Private Lesson
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Classes;
