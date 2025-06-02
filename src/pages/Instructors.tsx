
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import InstructorCard from "@/components/InstructorCard";
import { Search, Filter, MapPin, Star, Users, Award } from 'lucide-react';

const Instructors = () => {
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
    },
    {
      id: '5',
      name: 'James Wilson',
      title: 'Youth Program Director',
      location: 'Memphis, TN',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face',
      rating: 4.9,
      students: 180,
      specialties: ['Youth Classes', 'School Programs', 'Community Outreach'],
      verified: true
    },
    {
      id: '6',
      name: 'Angela Martinez',
      title: 'Couples Stepping Specialist',
      location: 'Dallas, TX',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop&crop=face',
      rating: 4.8,
      students: 320,
      specialties: ['Couples Step', 'Wedding Prep', 'Romantic Style'],
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
              Find Your Perfect Instructor
            </h1>
            <p className="text-xl text-text-on-primary/90 max-w-3xl mx-auto mb-8">
              Learn from certified stepping instructors with years of experience. 
              Whether you're a beginner or looking to compete, we have the right instructor for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                <Users className="mr-2 h-5 w-5" />
                Book a Lesson
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Award className="mr-2 h-5 w-5" />
                Become an Instructor
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
              <h3 className="text-2xl font-bold text-brand-primary">500+</h3>
              <p className="text-text-secondary">Certified Instructors</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">15+</h3>
              <p className="text-text-secondary">Cities Covered</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">4.8</h3>
              <p className="text-text-secondary">Average Rating</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">10K+</h3>
              <p className="text-text-secondary">Students Taught</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-surface-contrast">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                <Input 
                  placeholder="Search instructors by name or specialty..."
                  className="pl-10 border-border-input focus:border-border-input-focus"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select>
                <SelectTrigger className="w-40">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="chicago">Chicago, IL</SelectItem>
                  <SelectItem value="atlanta">Atlanta, GA</SelectItem>
                  <SelectItem value="detroit">Detroit, MI</SelectItem>
                  <SelectItem value="houston">Houston, TX</SelectItem>
                  <SelectItem value="dallas">Dallas, TX</SelectItem>
                  <SelectItem value="memphis">Memphis, TN</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="beginner">Beginner Classes</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="couples">Couples Step</SelectItem>
                  <SelectItem value="youth">Youth Programs</SelectItem>
                  <SelectItem value="advanced">Advanced Techniques</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-32">
                  <Star className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-text-primary mb-2">
              Featured Instructors
            </h2>
            <p className="text-text-secondary">
              {instructors.length} verified instructors found
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} {...instructor} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Instructors
            </Button>
          </div>
        </div>
      </section>

      {/* Become an Instructor CTA */}
      <section className="py-16 bg-brand-primary text-text-on-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Award className="h-12 w-12 mx-auto mb-6" />
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">
              Share Your Stepping Expertise
            </h2>
            <p className="text-lg mb-8 text-text-on-primary/90">
              Join our network of certified instructors and help grow the stepping community. 
              Teach what you love and make a difference in dancers' lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                Apply to Teach
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn About Requirements
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Instructors;
