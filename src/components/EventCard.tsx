import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Heart, Share2, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SocialShareButtons, { type EventData } from '@/components/SocialShareButtons';
import socialSharingService from '@/services/socialSharingService';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    address?: string;
    city: string;
    state: string;
    price: number;
    image: string;
    category: string;
    attendees: number;
    capacity?: number;
    instructor: string;
    skillLevel?: string;
    tags?: string[];
    rating?: number;
    description?: string;
    organizer?: string;
    coordinates?: { lat: number; lng: number };
    featured?: boolean;
    soldOut?: boolean;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
    console.log('Bookmark event:', event.id, isBookmarked ? 'removed' : 'added');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowShareMenu(!showShareMenu);
  };

  // Convert event data to EventData interface for social sharing
  const eventForSharing: EventData = {
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time,
    location: event.location,
    city: event.city,
    state: event.state,
    price: event.price,
    description: event.description,
    image: event.image,
    category: event.category,
    organizer: event.organizer
  };

  const availabilityPercentage = event.capacity ? (event.attendees / event.capacity) * 100 : 0;
  const isAlmostSoldOut = availabilityPercentage > 80;
  const isPopular = event.attendees && event.attendees > 100;

  return (
    <Link to={`/event/${event.id}/tickets`} className="block group">
      <Card className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-full bg-white rounded-3xl">
        <div className="relative">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Price Badge - Top Left */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
              <span className="text-xl font-bold text-gray-900">${event.price}</span>
            </div>
          </div>
          
          {/* Action buttons - Top Right */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-lg border-0"
              onClick={handleBookmark}
            >
              <Heart className={`h-4 w-4 transition-colors ${isBookmarked ? 'fill-current text-red-500' : 'text-gray-700'}`} />
            </Button>
            <div className="relative">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-10 w-10 bg-white/95 hover:bg-white backdrop-blur-sm rounded-full shadow-lg border-0"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 text-gray-700" />
              </Button>
              
              {showShareMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowShareMenu(false)}
                  />
                  
                  {/* Share menu */}
                  <div className="absolute top-full right-0 z-50 mt-2 p-3 bg-white rounded-xl border border-gray-200 shadow-xl min-w-[200px]">
                    <h3 className="text-sm font-medium mb-3 text-gray-900">Share Event</h3>
                    <SocialShareButtons
                      event={eventForSharing}
                      campaign="event_card_share"
                      platforms={['facebook', 'twitter', 'whatsapp', 'copy']}
                      size="sm"
                      variant="outline"
                      orientation="vertical"
                      showLabels={true}
                      className="gap-2"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Status badges - Bottom Left */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <Badge 
              className="bg-white/95 text-gray-900 backdrop-blur-sm border-0 rounded-xl px-3 py-1.5 font-medium shadow-lg"
            >
              {event.category}
            </Badge>
            {event.featured && (
              <Badge className="bg-brand-primary text-white rounded-xl px-3 py-1.5 font-medium shadow-lg">
                Featured
              </Badge>
            )}
            {event.soldOut && (
              <Badge variant="destructive" className="rounded-xl px-3 py-1.5 font-medium shadow-lg">
                Sold Out
              </Badge>
            )}
            {isAlmostSoldOut && !event.soldOut && (
              <Badge className="bg-orange-500 text-white rounded-xl px-3 py-1.5 font-medium shadow-lg">
                Almost Sold Out
              </Badge>
            )}
            {isPopular && (
              <Badge className="bg-green-500 text-white rounded-xl px-3 py-1.5 font-medium shadow-lg flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Popular
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 flex flex-col">
          {/* Title and Rating */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-brand-primary transition-colors flex-1 leading-tight pr-2">
                {event.title}
              </h3>
              {event.rating && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{event.rating}</span>
                </div>
              )}
            </div>
            
            {event.skillLevel && (
              <Badge variant="outline" className="rounded-full border-gray-300 text-gray-700 text-xs">
                {event.skillLevel}
              </Badge>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-3 mb-5 flex-1">
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar className="h-4 w-4 mr-3 flex-shrink-0 text-gray-500" />
              <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="font-medium">{event.time}</span>
            </div>
            
            <div className="flex items-start text-gray-600 text-sm">
              <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-gray-500" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{event.location}</div>
                <div className="text-gray-500 text-xs">{event.city}, {event.state}</div>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <Users className="h-4 w-4 mr-3 flex-shrink-0 text-gray-500" />
              <span className="font-medium">
                {event.attendees} {event.capacity ? `of ${event.capacity}` : ''} attending
              </span>
            </div>

            {/* Instructor */}
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Instructor</div>
              <div className="font-medium text-gray-900">{event.instructor}</div>
              {event.organizer && (
                <div className="text-xs text-gray-500">by {event.organizer}</div>
              )}
            </div>
          </div>

          {/* Progress bar for capacity */}
          {event.capacity && (
            <div className="mb-4">
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    availabilityPercentage > 90 ? 'bg-red-500' :
                    availabilityPercentage > 80 ? 'bg-orange-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(availabilityPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {event.capacity - event.attendees} spots remaining
              </p>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {event.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs rounded-full border-gray-300 text-gray-600 px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 2 && (
                <Badge variant="outline" className="text-xs rounded-full border-gray-300 text-gray-600 px-2 py-0.5">
                  +{event.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button 
            className={`w-full rounded-full py-3 font-medium transition-all ${
              event.soldOut 
                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                : 'bg-brand-primary hover:bg-brand-primary-hover hover:scale-105'
            }`}
            disabled={event.soldOut}
          >
            {event.soldOut ? 'Sold Out' : 'View Details'}
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default EventCard;
