
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
    <Card className="bg-surface-card border-border-default h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'text-feedback-warning fill-current' : 'text-border-default'
              }`}
            />
          ))}
        </div>
        
        <div className="relative mb-6">
          <Quote className="h-6 w-6 text-brand-primary mb-2" />
          <p className="text-text-primary italic leading-relaxed">
            "{testimonial}"
          </p>
        </div>

        <div className="flex items-center">
          <img 
            src={image} 
            alt={name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="font-semibold text-text-primary">{name}</h4>
            {title && <p className="text-sm text-text-secondary">{title}</p>}
            <p className="text-sm text-text-secondary">{location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
