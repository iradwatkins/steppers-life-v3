
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Heart, Share2 } from 'lucide-react';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    city: string;
    state: string;
    price: number;
    image: string;
    category: string;
    attendees: number;
    instructor: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Bookmark event:', event.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Share event:', event.id);
  };

  const handleEventClick = () => {
    console.log('Navigate to event:', event.id);
  };

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-border-default overflow-hidden"
      onClick={handleEventClick}
    >
      <div className="relative">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge 
            variant="secondary" 
            className="bg-white/90 text-text-primary backdrop-blur-sm"
          >
            {event.category}
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
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg text-text-primary line-clamp-2 group-hover:text-brand-primary transition-colors">
          {event.title}
        </h3>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-text-secondary text-sm">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-text-secondary text-sm">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.attendees} attending</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-brand-primary">${event.price}</span>
          <Button size="sm" className="bg-brand-primary hover:bg-brand-primary-hover">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
