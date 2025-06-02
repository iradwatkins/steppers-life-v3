
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees?: number;
}

const EventCard = ({ id, title, date, time, location, category, image, attendees }: EventCardProps) => {
  return (
    <Link to={`/events/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-surface-card border-border-default">
        <div className="relative">
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-brand-primary text-text-on-primary">
            {category}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-serif font-semibold text-lg text-text-primary mb-2 line-clamp-2">
            {title}
          </h3>
          
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{date} at {time}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="truncate">{location}</span>
            </div>
            
            {attendees && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{attendees} attending</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
