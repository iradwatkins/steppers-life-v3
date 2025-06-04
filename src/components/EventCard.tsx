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
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-border-default overflow-hidden h-full">
        <div className="relative">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge 
              variant="secondary" 
              className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 backdrop-blur-sm border border-white/20 dark:border-gray-600/50"
            >
              {event.category}
            </Badge>
            {event.featured && (
              <Badge className="bg-brand-primary text-text-on-primary">
                Featured
              </Badge>
            )}
            {event.soldOut && (
              <Badge variant="destructive">
                Sold Out
              </Badge>
            )}
            {isAlmostSoldOut && !event.soldOut && (
              <Badge className="bg-feedback-warning text-white">
                Almost Sold Out
              </Badge>
            )}
            {isPopular && (
              <Badge className="bg-feedback-success text-white flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Popular
              </Badge>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-white/20 dark:border-gray-600/50"
              onClick={handleBookmark}
            >
              <Heart className={`h-4 w-4 transition-colors ${isBookmarked ? 'fill-current text-red-500' : ''}`} />
            </Button>
            <div className="relative">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-white/20 dark:border-gray-600/50"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              {showShareMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowShareMenu(false)}
                  />
                  
                  {/* Share menu */}
                  <div className="absolute top-full right-0 z-50 mt-1 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-xl min-w-[200px]">
                    <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">Share Event</h3>
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
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-text-primary line-clamp-2 group-hover:text-brand-primary transition-colors flex-1">
              {event.title}
            </h3>
            {event.rating && (
              <div className="flex items-center gap-1 ml-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-text-secondary">{event.rating}</span>
              </div>
            )}
          </div>
          {event.skillLevel && (
            <Badge variant="outline" className="w-fit">
              {event.skillLevel}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-text-secondary text-sm">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
            </div>
            <div className="flex items-center text-text-secondary text-sm">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="line-clamp-1 flex-1">{event.location}, {event.city}, {event.state}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 ml-2 text-xs hover:text-brand-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                asChild
              >
                <Link to={`/venue/${event.location.replace(/\s+/g, '-').toLowerCase()}`}>
                  Venue Info
                </Link>
              </Button>
            </div>
            <div className="flex items-center text-text-secondary text-sm">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {event.attendees} {event.capacity ? `of ${event.capacity}` : ''} attending
              </span>
            </div>
          </div>

          {/* Progress bar for capacity */}
          {event.capacity && (
            <div className="mb-4">
              <div className="w-full bg-surface-contrast rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    availabilityPercentage > 90 ? 'bg-feedback-error' :
                    availabilityPercentage > 80 ? 'bg-feedback-warning' :
                    'bg-feedback-success'
                  }`}
                  style={{ width: `${Math.min(availabilityPercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {event.capacity - event.attendees} spots remaining
              </p>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {event.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{event.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Description preview */}
          {event.description && (
            <p className="text-sm text-text-secondary line-clamp-2 mb-4">
              {event.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-brand-primary">${event.price}</span>
              {event.organizer && (
                <span className="text-xs text-text-secondary">by {event.organizer}</span>
              )}
            </div>
            <Button 
              size="sm" 
              className={`
                ${event.soldOut 
                  ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                  : 'bg-brand-primary hover:bg-brand-primary-hover'
                }
              `}
              disabled={event.soldOut}
            >
              {event.soldOut ? 'Sold Out' : 'View Details'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
