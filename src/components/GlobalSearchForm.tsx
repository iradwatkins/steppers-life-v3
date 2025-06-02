
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar } from 'lucide-react';

const GlobalSearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search submitted:', { searchTerm, location, category });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <Input
            type="text"
            placeholder="Search events, classes, instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 bg-white border-border-default focus:border-brand-primary"
          />
        </div>
        
        <div className="relative min-w-48">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary z-10 pointer-events-none" />
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-12 pl-10 bg-white border-border-default">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="chicago">Chicago, IL</SelectItem>
              <SelectItem value="atlanta">Atlanta, GA</SelectItem>
              <SelectItem value="detroit">Detroit, MI</SelectItem>
              <SelectItem value="houston">Houston, TX</SelectItem>
              <SelectItem value="la">Los Angeles, CA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative min-w-48">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary z-10 pointer-events-none" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 pl-10 bg-white border-border-default">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="social">Social Dance</SelectItem>
              <SelectItem value="classes">Classes</SelectItem>
              <SelectItem value="workshops">Workshops</SelectItem>
              <SelectItem value="conventions">Conventions</SelectItem>
              <SelectItem value="competitions">Competitions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="lg" className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </form>
    </div>
  );
};

export default GlobalSearchForm;
