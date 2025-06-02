
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  image: string;
  rating: number;
  testimonial: string;
  title?: string;
}

const TestimonialCard = ({ 
  name, 
  location, 
  image, 
  rating, 
  testimonial, 
  title 
}: TestimonialCardProps) => {
  return (
    <Card className="bg-surface-card border-border-default hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={image} 
            alt={name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary">{name}</h4>
            {title && (
              <p className="text-sm text-brand-primary font-medium">{title}</p>
            )}
            <p className="text-sm text-text-secondary">{location}</p>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
        </div>
        
        <div className="relative">
          <Quote className="h-6 w-6 text-brand-primary/30 absolute -top-1 -left-1" />
          <p className="text-text-secondary italic pl-4">
            "{testimonial}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
