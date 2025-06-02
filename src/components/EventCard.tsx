
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Heart, Share2 } from 'lucide-react';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees: number;
  price?: string;
  featured?: boolean;
}

const EventCard = ({ 
  id, 
  title, 
  date, 
  time, 
  location, 
  category, 
  image, 
  attendees, 
  price,
  featured = false 
}: EventCardProps) => {
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Bookmark event:', id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Share event:', id);
  };

  const handleEventClick = () => {
    console.log('Navigate to event:', id);
  };

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-lg transition-all duration-300 border-border-default overflow-hidden ${
        featured ? 'ring-2 ring-brand-primary' : ''
      }`}
      onClick={handleEventClick}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className="bg-white/90 text-text-primary backdrop-blur-sm"
          >
            {category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-white/90 hover:bg-white text-text-primary"
            onClick={handleBookmark}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-white/90 hover:bg-white text-text-primary"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        {featured && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-brand-primary text-text-on-primary">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg text-text-primary line-clamp-2 group-hover:text-brand-primary transition-colors">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-text-secondary text-sm">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{attendees} attending</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {price ? (
            <span className="text-lg font-semibold text-brand-primary">{price}</span>
          ) : (
            <span className="text-lg font-semibold text-feedback-success">Free</span>
          )}
          <Button size="sm" className="bg-brand-primary hover:bg-brand-primary-hover">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
