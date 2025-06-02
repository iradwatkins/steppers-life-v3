
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Clock, Users, Star, Play, Filter, Search } from 'lucide-react';

const Classes = () => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const classes = [
    {
      id: 1,
      title: "Fundamentals of Chicago Stepping",
      instructor: "Marcus Johnson",
      instructorImage: "/placeholder.svg",
      level: "Beginner",
      duration: "8 weeks",
      price: 120,
      rating: 4.9,
      students: 45,
      image: "/placeholder.svg",
      category: "Technique",
      description: "Master the basic steps and timing of Chicago stepping in this comprehensive beginner course."
    },
    {
      id: 2,
      title: "Advanced Footwork Patterns",
      instructor: "Lisa Davis",
      instructorImage: "/placeholder.svg",
      level: "Advanced",
      duration: "6 weeks",
      price: 150,
      rating: 4.8,
      students: 28,
      image: "/placeholder.svg",
      category: "Technique",
      description: "Elevate your stepping with complex footwork patterns and advanced techniques."
    },
    {
      id: 3,
      title: "Partner Connection & Leading",
      instructor: "Carlos Martinez",
      instructorImage: "/placeholder.svg",
      level: "Intermediate",
      duration: "4 weeks",
      price: 80,
      rating: 4.7,
      students: 32,
      image: "/placeholder.svg",
      category: "Partnership",
      description: "Learn how to connect with your partner and develop strong leading skills."
    },
    {
      id: 4,
      title: "Competition Preparation",
      instructor: "Angela Thompson",
      instructorImage: "/placeholder.svg",
      level: "Advanced",
      duration: "12 weeks",
      price: 200,
      rating: 4.9,
      students: 18,
      image: "/placeholder.svg",
      category: "Competition",
      description: "Intensive training for stepping competitions with performance techniques."
    },
    {
      id: 5,
      title: "Styling & Personal Expression",
      instructor: "Michael Brown",
      instructorImage: "/placeholder.svg",
      level: "Intermediate",
      duration: "6 weeks",
      price: 100,
      rating: 4.6,
      students: 38,
      image: "/placeholder.svg",
      category: "Style",
      description: "Develop your unique style and personal expression in stepping."
    },
    {
      id: 6,
      title: "Youth Stepping Basics",
      instructor: "Coach Williams",
      instructorImage: "/placeholder.svg",
      level: "Beginner",
      duration: "10 weeks",
      price: 90,
      rating: 4.8,
      students: 25,
      image: "/placeholder.svg",
      category: "Youth",
      description: "Age-appropriate stepping instruction for young dancers (ages 8-16)."
    }
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const categories = ["Technique", "Partnership", "Competition", "Style", "Youth"];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || classItem.level === selectedLevel;
    const matchesCategory = !selectedCategory || classItem.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background-main py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">
            Stepping Classes
          </h1>
          <p className="text-text-secondary text-lg">
            Learn from expert instructors and master the art of stepping
          </p>
        </div>

        {/* Featured Class */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-brand-primary to-brand-primary-hover text-text-on-primary">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="bg-text-on-primary text-brand-primary mb-4">
                  Most Popular
                </Badge>
                <h2 className="font-serif text-3xl font-bold mb-4">
                  Fundamentals of Chicago Stepping
                </h2>
                <p className="text-text-on-primary/90 mb-6">
                  Perfect for beginners! Learn the essential moves, timing, and techniques that form the foundation of Chicago stepping.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-1" />
                    <span>4.9 (45 students)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-1" />
                    <span>8 weeks</span>
                  </div>
                </div>
                <Button className="bg-text-on-primary text-brand-primary hover:bg-text-on-primary/90">
                  Enroll Now - $120
                </Button>
              </div>
              <div className="hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="Featured Class"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

              <Button className="bg-brand-primary hover:bg-brand-primary-hover">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Class Categories */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => (
            <Card key={category} className="text-center cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-text-on-primary" />
                </div>
                <h3 className="font-semibold text-text-primary">{category}</h3>
                <p className="text-sm text-text-secondary">
                  {classes.filter(c => c.category === category).length} classes
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Classes Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-text-primary">
            Available Classes ({filteredClasses.length})
          </h2>
          <div className="flex gap-2">
            <Badge variant="secondary">New</Badge>
            <Badge variant="outline">Popular</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <Card key={classItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={classItem.image}
                  alt={classItem.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-brand-primary">
                  {classItem.level}
                </Badge>
                <div className="absolute top-3 right-3 bg-black/50 rounded-full p-2">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={classItem.instructorImage}
                    alt={classItem.instructor}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-text-primary">{classItem.instructor}</p>
                    <p className="text-sm text-text-secondary">{classItem.category}</p>
                  </div>
                </div>
                
                <h3 className="font-serif text-xl font-semibold text-text-primary mb-2">
                  {classItem.title}
                </h3>
                
                <p className="text-text-secondary text-sm mb-4">
                  {classItem.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-text-secondary">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{classItem.rating}</span>
                    <span className="ml-1">({classItem.students})</span>
                  </div>
                  <div className="flex items-center text-sm text-text-secondary">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{classItem.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-brand-primary">
                    ${classItem.price}
                  </span>
                  <Button className="bg-brand-primary hover:bg-brand-primary-hover">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-surface-contrast">
          <CardContent className="p-8 text-center">
            <h3 className="font-serif text-2xl font-bold text-text-primary mb-4">
              Become an Instructor
            </h3>
            <p className="text-text-secondary mb-6">
              Share your stepping expertise and teach students worldwide
            </p>
            <Button className="bg-brand-primary hover:bg-brand-primary-hover">
              Apply to Teach
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Classes;
