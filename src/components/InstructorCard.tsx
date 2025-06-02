
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  verified = false 
}: InstructorCardProps) => {
  return (
    <Link to={`/instructors/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-surface-card border-border-default">
        <div className="relative">
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover"
          />
          {verified && (
            <Badge className="absolute top-3 left-3 bg-feedback-success text-text-on-primary">
              Verified
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-serif font-semibold text-lg text-text-primary mb-1">
            {name}
          </h3>
          <p className="text-text-secondary text-sm mb-3">{title}</p>
          
          <div className="space-y-2 text-sm text-text-secondary mb-3">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{location}</span>
            </div>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-feedback-warning" />
              <span>{rating}/5.0</span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{students} students</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {specialties.slice(0, 2).map((specialty, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-border-default text-text-secondary"
              >
                {specialty}
              </Badge>
            ))}
            {specialties.length > 2 && (
              <Badge variant="outline" className="text-xs border-border-default text-text-secondary">
                +{specialties.length - 2} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default InstructorCard;
