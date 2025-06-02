
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TestimonialCard from "@/components/TestimonialCard";
import { Users, MessageCircle, Heart, Star, Camera, Calendar, MapPin, Zap } from 'lucide-react';

const Community = () => {
  const communityStats = [
    { icon: Users, label: 'Active Members', value: '12,000+' },
    { icon: MessageCircle, label: 'Monthly Posts', value: '5,000+' },
    { icon: Heart, label: 'Connections Made', value: '25,000+' },
    { icon: Star, label: 'Events Hosted', value: '500+' }
  ];

  const featuredPosts = [
    {
      id: 1,
      author: 'Marcus Williams',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      time: '2 hours ago',
      content: 'Just finished an amazing workshop in Chicago! The energy was incredible. Shoutout to everyone who came out to learn and grow together. 🕺',
      likes: 45,
      comments: 12,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      author: 'Tanya Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=100&h=100&fit=crop&crop=face',
      time: '5 hours ago',
      content: 'Beginners class was off the charts tonight! So proud of my students\' progress. Remember, it\'s all about the rhythm and having fun! 💃',
      likes: 32,
      comments: 8
    },
    {
      id: 3,
      author: 'Robert Davis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      time: '1 day ago',
      content: 'Throwback to the legendary steppers who paved the way for all of us. Their dedication and passion built this beautiful community we have today. Much respect! 🙏',
      likes: 78,
      comments: 23
    }
  ];

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
      <section className="bg-gradient-to-r from-brand-primary to-brand-primary-hover text-text-on-primary py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4">
              Join the Stepping Community
            </h1>
            <p className="text-xl text-text-on-primary/90 max-w-3xl mx-auto mb-8">
              Connect with fellow steppers, share your journey, and be part of a 
              vibrant community that celebrates the art of stepping.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Discussion
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-12 bg-surface-card border-b border-border-default">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {communityStats.map(({ icon: Icon, label, value }, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-1">{value}</h3>
                <p className="text-text-secondary">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-background-main">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
              Community Highlights
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              See what's happening in the stepping community. Share your experiences, 
              celebrate achievements, and connect with fellow dancers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="bg-surface-card border-border-default">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={post.avatar} 
                      alt={post.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary">{post.author}</h4>
                      <p className="text-sm text-text-secondary">{post.time}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-text-primary mb-4">{post.content}</p>
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt="Post image"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="flex items-center space-x-6 text-text-secondary">
                    <button className="flex items-center space-x-2 hover:text-brand-primary transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-brand-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-brand-primary hover:bg-brand-primary-hover">
              View All Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16 bg-surface-contrast">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
              Community Features
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Discover all the ways you can connect, learn, and grow with the stepping community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center bg-surface-card border-border-default hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Discussion Forums</h3>
                <p className="text-text-secondary text-sm">
                  Join conversations about techniques, events, and stepping culture.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-surface-card border-border-default hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Photo & Video Sharing</h3>
                <p className="text-text-secondary text-sm">
                  Share your stepping moments and learn from others' performances.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-surface-card border-border-default hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Event Organization</h3>
                <p className="text-text-secondary text-sm">
                  Create and promote your own stepping events with our tools.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-surface-card border-border-default hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">Mentor Network</h3>
                <p className="text-text-secondary text-sm">
                  Connect with experienced steppers for guidance and support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="py-16 bg-background-main">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-text-primary mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Hear from steppers across the nation about how our community has 
              impacted their stepping journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 bg-brand-primary text-text-on-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Zap className="h-12 w-12 mx-auto mb-6" />
            <h2 className="font-serif text-3xl lg:text-4xl font-bold mb-4">
              Ready to Join the Movement?
            </h2>
            <p className="text-lg mb-8 text-text-on-primary/90">
              Become part of the most vibrant stepping community online. Share your passion, 
              learn from others, and help grow the stepping culture nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-white/90">
                Join the Community
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;
