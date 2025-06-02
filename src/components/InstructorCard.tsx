
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, CheckCircle, Heart, MessageCircle } from 'lucide-react';

interface InstructorCardProps {
  id: string;
  name: string;
  title: string;
  location: string;
  image: string;
  rating: number;
  students: number;
  specialties: string[];
  verified?: boolean;
  bio?: string;
}

const InstructorCard = ({ 
  id, 
  name, 
  title, 
  location, 
  image, 
  rating, 
  students, 
  specialties, 
  verified = false,
  bio 
}: InstructorCardProps) => {
  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Contact instructor:', id);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Favorite instructor:', id);
  };

  const handleViewProfile = () => {
    console.log('View instructor profile:', id);
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-border-default overflow-hidden"
      onClick={handleViewProfile}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-white/90 hover:bg-white text-text-primary"
            onClick={handleFavorite}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {verified && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-feedback-success text-white flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-text-primary group-hover:text-brand-primary transition-colors">
              {name}
            </h3>
            <p className="text-text-secondary text-sm">{title}</p>
          </div>
          <div className="flex items-center text-sm text-text-secondary">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="font-medium">{rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-text-secondary text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{students}+ students taught</span>
          </div>
        </div>

        {bio && (
          <p className="text-text-secondary text-sm mb-4 line-clamp-2">{bio}</p>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {specialties.slice(0, 3).map((specialty, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs border-brand-primary text-brand-primary"
            >
              {specialty}
            </Badge>
          ))}
          {specialties.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{specialties.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-brand-primary hover:bg-brand-primary-hover"
          >
            View Profile
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            onClick={handleContact}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCard;
