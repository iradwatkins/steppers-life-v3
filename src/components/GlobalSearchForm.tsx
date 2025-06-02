
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Calendar, Filter } from 'lucide-react';

const GlobalSearchForm = () => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
          <Input 
            placeholder="Search events, classes, or locations..."
            className="pl-10 border-border-input focus:border-border-input-focus"
          />
        </div>

        {/* Location Filter */}
        <Select>
          <SelectTrigger className="border-border-input focus:border-border-input-focus">
            <MapPin className="h-4 w-4 mr-2 text-text-secondary" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Use Current Location</SelectItem>
            <SelectItem value="chicago">Chicago, IL</SelectItem>
            <SelectItem value="atlanta">Atlanta, GA</SelectItem>
            <SelectItem value="detroit">Detroit, MI</SelectItem>
            <SelectItem value="houston">Houston, TX</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select>
          <SelectTrigger className="border-border-input focus:border-border-input-focus">
            <Calendar className="h-4 w-4 mr-2 text-text-secondary" />
            <SelectValue placeholder="When" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="weekend">This Weekend</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button className="bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary flex-1">
          <Search className="h-4 w-4 mr-2" />
          Search Events
        </Button>
        <Button variant="outline" className="border-border-input hover:bg-surface-contrast">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>
    </div>
  );
};

export default GlobalSearchForm;
