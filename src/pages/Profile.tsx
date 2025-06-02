
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, MapPin, Star, Calendar, Users, Award, Edit, Settings } from 'lucide-react';

const Profile = () => {
  const userProfile = {
    name: 'Sarah Mitchell',
    title: 'Stepping Enthusiast',
    location: 'Houston, TX',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face',
    rating: 4.8,
    eventsAttended: 25,
    classesCompleted: 12,
    verified: true,
    joinDate: 'January 2023',
    specialties: ['Beginner Classes', 'Social Dancing', 'Line Step']
  };

  const recentActivity = [
    {
      id: 1,
      type: 'event',
      title: 'Chicago Steppers Social at Navy Pier',
      date: 'Jan 15, 2024',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200&h=150&fit=crop'
    },
    {
      id: 2,
      type: 'class',
      title: 'Beginner Stepping Fundamentals',
      date: 'Jan 10, 2024',
      image: 'https://images.unsplash.com/photo-1574279606130-09958dc756f4?w=200&h=150&fit=crop'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Completed 12 Classes',
      date: 'Jan 8, 2024'
    }
  ];

  return (
    <div className="min-h-screen bg-background-main pb-20">
      {/* Profile Header */}
      <section className="bg-gradient-to-r from-brand-primary to-brand-primary-hover text-text-on-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img 
                src={userProfile.image} 
                alt={userProfile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
              {userProfile.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-brand-primary" />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="font-serif text-3xl font-bold mb-2">{userProfile.name}</h1>
              <p className="text-xl text-text-on-primary/90 mb-2">{userProfile.title}</p>
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  <span>{userProfile.rating}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {userProfile.specialties.map((specialty, index) => (
                  <Badge key={index} className="bg-white/20 text-white border-white/30">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button className="bg-white text-brand-primary hover:bg-white/90">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Stats */}
      <section className="py-8 bg-surface-card border-b border-border-default">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">{userProfile.eventsAttended}</h3>
              <p className="text-text-secondary">Events Attended</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">{userProfile.classesCompleted}</h3>
              <p className="text-text-secondary">Classes Completed</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brand-primary">{userProfile.rating}</h3>
              <p className="text-text-secondary">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="classes">My Classes</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-8">
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-text-primary">Recent Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentActivity.map((activity) => (
                    <Card key={activity.id} className="bg-surface-card border-border-default">
                      <CardContent className="p-6">
                        {activity.image && (
                          <img 
                            src={activity.image} 
                            alt={activity.title}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                        )}
                        <h3 className="font-semibold text-text-primary mb-2">{activity.title}</h3>
                        <p className="text-text-secondary text-sm">{activity.date}</p>
                        <Badge className="mt-2 capitalize">{activity.type}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-8">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">No Upcoming Events</h3>
                <p className="text-text-secondary mb-6">You haven't registered for any upcoming events yet.</p>
                <Button className="bg-brand-primary hover:bg-brand-primary-hover">
                  Browse Events
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="classes" className="mt-8">
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">No Active Classes</h3>
                <p className="text-text-secondary mb-6">Start your stepping journey by enrolling in a class.</p>
                <Button className="bg-brand-primary hover:bg-brand-primary-hover">
                  Find Classes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-8">
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-text-primary mb-2">Your Achievements</h3>
                <p className="text-text-secondary mb-6">Complete classes and attend events to unlock achievements.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Profile;
