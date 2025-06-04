import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar, MapPin, Users, Clock, DollarSign, Filter, Plus, Star, Search, Grid, List, Map, Bookmark, SlidersHorizontal, ChevronDown, Heart, Share2, Navigation } from 'lucide-react';
import { DatePicker } from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import EventCard from '@/components/EventCard';
import EventMapView from '@/components/EventMapView';

const Events = () => {
  // View and layout state
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [sortBy, setSortBy] = useState('date');
  const [distance, setDistance] = useState(50); // miles
  
  // Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Enhanced mock events data with more properties for search/discovery
  const events = [
    {
      id: 1,
      title: "Chicago Step Championship",
      date: "2024-07-15",
      time: "7:00 PM",
      location: "Chicago Cultural Center",
      address: "78 E Washington St, Chicago, IL 60602",
      city: "Chicago",
      state: "IL",
      price: 45,
      image: "/placeholder.svg",
      category: "Competition",
      attendees: 250,
      capacity: 300,
      instructor: "Marcus Johnson",
      skillLevel: "Advanced",
      tags: ["stepping", "competition", "championship"],
      rating: 4.8,
      description: "Annual championship showcasing the best steppers in the Midwest. Competitive divisions and workshops available.",
      organizer: "Chicago Step Alliance",
      coordinates: { lat: 41.8836, lng: -87.6270 },
      featured: true,
      soldOut: false
    },
    {
      id: 2,
      title: "Beginner Step Workshop",
      date: "2024-07-20",
      time: "2:00 PM",
      location: "Dance Studio One",
      address: "1234 Peachtree St, Atlanta, GA 30309",
      city: "Atlanta",
      state: "GA",
      price: 25,
      image: "/placeholder.svg",
      category: "Workshop",
      attendees: 30,
      capacity: 35,
      instructor: "Lisa Davis",
      skillLevel: "Beginner",
      tags: ["stepping", "workshop", "beginner", "fundamentals"],
      rating: 4.9,
      description: "Perfect introduction to stepping for newcomers. Learn basic steps and rhythm patterns.",
      organizer: "Atlanta Step Academy",
      coordinates: { lat: 33.7490, lng: -84.3880 },
      featured: false,
      soldOut: false
    },
    {
      id: 3,
      title: "Saturday Step Social",
      date: "2024-07-22",
      time: "8:00 PM",
      location: "Community Center",
      address: "456 Motor City Blvd, Detroit, MI 48201",
      city: "Detroit",
      state: "MI",
      price: 15,
      image: "/placeholder.svg",
      category: "Social",
      attendees: 75,
      capacity: 100,
      instructor: "DJ Smooth",
      skillLevel: "All Levels",
      tags: ["stepping", "social", "dancing", "community"],
      rating: 4.6,
      description: "Weekly social dancing event with live DJ and friendly atmosphere for all skill levels.",
      organizer: "Motor City Steppers",
      coordinates: { lat: 42.3314, lng: -83.0458 },
      featured: false,
      soldOut: false
    },
    {
      id: 4,
      title: "Advanced Technique Masterclass",
      date: "2024-07-25",
      time: "6:00 PM",
      location: "Elite Dance Academy",
      address: "789 Space City Dr, Houston, TX 77058",
      city: "Houston",
      state: "TX",
      price: 35,
      image: "/placeholder.svg",
      category: "Class",
      attendees: 45,
      capacity: 50,
      instructor: "Carlos Martinez",
      skillLevel: "Advanced",
      tags: ["stepping", "technique", "advanced", "masterclass"],
      rating: 4.7,
      description: "Intensive technique workshop focusing on advanced stepping patterns and performance quality.",
      organizer: "Houston Step Elite",
      coordinates: { lat: 29.7604, lng: -95.3698 },
      featured: false,
      soldOut: true
    },
    {
      id: 5,
      title: "Monthly Step Showcase",
      date: "2024-07-28",
      time: "7:30 PM",
      location: "Grand Theater",
      address: "321 Arts District Dr, Dallas, TX 75201",
      city: "Dallas",
      state: "TX",
      price: 20,
      image: "/placeholder.svg",
      category: "Performance",
      attendees: 150,
      capacity: 200,
      instructor: "Multiple Artists",
      skillLevel: "All Levels",
      tags: ["stepping", "showcase", "performance", "entertainment"],
      rating: 4.5,
      description: "Monthly showcase featuring local and visiting step teams. Great entertainment for the whole family.",
      organizer: "Dallas Step Society",
      coordinates: { lat: 32.7767, lng: -96.7970 },
      featured: false,
      soldOut: false
    },
    {
      id: 6,
      title: "Youth Step Training Camp",
      date: "2024-08-02",
      time: "10:00 AM",
      location: "Youth Center",
      address: "654 Beale St, Memphis, TN 38103",
      city: "Memphis",
      state: "TN",
      price: 30,
      image: "/placeholder.svg",
      category: "Workshop",
      attendees: 40,
      capacity: 60,
      instructor: "Coach Williams",
      skillLevel: "Youth",
      tags: ["stepping", "youth", "training", "camp"],
      rating: 4.8,
      description: "Summer training camp for young steppers ages 8-18. Build confidence and skills in a supportive environment.",
      organizer: "Memphis Youth Step Program",
      coordinates: { lat: 35.1495, lng: -90.0490 },
      featured: false,
      soldOut: false
    },
    {
      id: 7,
      title: "Step & Line Dance Fusion",
      date: "2024-08-05",
      time: "7:00 PM",
      location: "Cultural Arts Center",
      address: "987 Music Row, Nashville, TN 37203",
      city: "Nashville",
      state: "TN",
      price: 28,
      image: "/placeholder.svg",
      category: "Workshop",
      attendees: 65,
      capacity: 80,
      instructor: "Maria Rodriguez",
      skillLevel: "Intermediate",
      tags: ["stepping", "line dance", "fusion", "crossover"],
      rating: 4.4,
      description: "Unique fusion class combining stepping with line dance elements. Great for expanding your dance vocabulary.",
      organizer: "Nashville Dance Collective",
      coordinates: { lat: 36.1627, lng: -86.7816 },
      featured: false,
      soldOut: false
    },
    {
      id: 8,
      title: "International Step Convention",
      date: "2024-08-10",
      time: "9:00 AM",
      location: "Convention Center",
      address: "123 Convention Blvd, Las Vegas, NV 89109",
      city: "Las Vegas",
      state: "NV",
      price: 85,
      image: "/placeholder.svg",
      category: "Convention",
      attendees: 500,
      capacity: 800,
      instructor: "Various International Instructors",
      skillLevel: "All Levels",
      tags: ["stepping", "convention", "international", "weekend"],
      rating: 4.9,
      description: "Three-day convention featuring workshops, competitions, and performances from steppers worldwide.",
      organizer: "International Step Association",
      coordinates: { lat: 36.1699, lng: -115.1398 },
      featured: true,
      soldOut: false
    }
  ];

  const categories = ['Competition', 'Workshop', 'Social', 'Class', 'Performance', 'Convention'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels', 'Youth'];
  const cities = [...new Set(events.map(event => `${event.city}, ${event.state}`))];
  const sortOptions = [
    { value: 'date', label: 'Date (Earliest First)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Distance' }
  ];

  // Filter and search logic
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      // Text search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower) ||
        event.city.toLowerCase().includes(searchLower) ||
        event.instructor.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        event.description.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory.toLowerCase();
      
      // City filter
      const matchesCity = selectedCity === 'all' || `${event.city}, ${event.state}` === selectedCity;
      
      // Skill level filter
      const matchesSkillLevel = selectedSkillLevel === 'all' || event.skillLevel.toLowerCase() === selectedSkillLevel.toLowerCase();
      
      // Price range filter
      const matchesPrice = event.price >= priceRange[0] && event.price <= priceRange[1];
      
      // Date range filter
      const eventDate = new Date(event.date);
      const matchesDateFrom = !dateFrom || eventDate >= dateFrom;
      const matchesDateTo = !dateTo || eventDate <= dateTo;
      
      // Distance filter (only when location is enabled)
      let matchesDistance = true;
      if (locationEnabled && userLocation) {
        const eventDistance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          event.coordinates.lat, 
          event.coordinates.lng
        );
        matchesDistance = eventDistance <= distance;
      }
      
      return matchesSearch && matchesCategory && matchesCity && matchesSkillLevel && 
             matchesPrice && matchesDateFrom && matchesDateTo && matchesDistance;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popularity':
          return b.attendees - a.attendees;
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          if (locationEnabled && userLocation) {
            const distanceA = calculateDistance(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
            const distanceB = calculateDistance(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
            return distanceA - distanceB;
          }
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedCity, selectedSkillLevel, priceRange, dateFrom, dateTo, sortBy, locationEnabled, userLocation, distance]);

  const featuredEvents = events.filter(event => event.featured);
  const upcomingEvents = filteredAndSortedEvents.filter(event => new Date(event.date) >= new Date());

  // Get user's location
  const getCurrentLocation = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationEnabled(true);
          setSortBy('distance'); // Auto-sort by distance when location is enabled
          setGpsLoading(false);
        },
        (error) => {
          console.error('Location access denied:', error);
          setGpsLoading(false);
          // Show error toast in real implementation
        }
      );
    } else {
      setGpsLoading(false);
      alert('Geolocation is not supported by this browser');
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="min-h-screen bg-background-main py-8">
      <div className="container mx-auto px-4">
        {/* Header with Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-4xl font-bold text-text-primary mb-2">
                Discover Step Events
              </h1>
              <p className="text-text-secondary text-lg">
                Find and join stepping events near you
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Bookmark className="w-4 h-4 mr-2" />
                Saved Searches
              </Button>
              <Button asChild className="bg-brand-primary hover:bg-brand-primary-hover">
                <Link to="/organizer/events/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
              <Input
                placeholder="Search events, locations, instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {/* GPS Location Button */}
              <Button 
                variant={locationEnabled ? "default" : "outline"}
                onClick={getCurrentLocation}
                disabled={gpsLoading}
                className="flex items-center gap-2"
              >
                <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
                {gpsLoading ? 'Finding...' : locationEnabled ? 'GPS On' : 'Near Me'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              {/* View Mode Toggle */}
              <div className="flex border border-border-default rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none border-x"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="rounded-l-none"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Location</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skill Level Filter */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Skill Level</label>
                  <Select value={selectedSkillLevel} onValueChange={setSelectedSkillLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {skillLevels.map(level => (
                        <SelectItem key={level} value={level.toLowerCase()}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={100}
                    min={0}
                    step={5}
                    className="mt-2"
                  />
                </div>

                {/* Date From */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">From Date</label>
                  <DatePicker
                    date={dateFrom}
                    onDateChange={setDateFrom}
                    placeholder="Select start date"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">To Date</label>
                  <DatePicker
                    date={dateTo}
                    onDateChange={setDateTo}
                    placeholder="Select end date"
                  />
                </div>

                {/* Distance (for location-based search) */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    {locationEnabled ? `Distance: ${distance} miles` : 'Distance Filter'}
                  </label>
                  {locationEnabled ? (
                    <Slider
                      value={[distance]}
                      onValueChange={(value) => setDistance(value[0])}
                      max={200}
                      min={5}
                      step={5}
                      className="mt-2"
                    />
                  ) : (
                    <div className="mt-2 p-3 bg-gray-50 rounded border text-center">
                      <p className="text-xs text-gray-500 mb-2">Enable GPS to filter by distance</p>
                      <Button size="sm" variant="outline" onClick={getCurrentLocation} disabled={gpsLoading}>
                        <Navigation className="w-3 h-3 mr-1" />
                        {gpsLoading ? 'Finding...' : 'Enable GPS'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedCity('all');
                    setSelectedSkillLevel('all');
                    setPriceRange([0, 100]);
                    setDateFrom(undefined);
                    setDateTo(undefined);
                    setSortBy('date');
                    setDistance(50);
                  }}
                >
                  Clear All Filters
                </Button>
                <Button>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-text-primary mb-4">Featured Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredEvents.slice(0, 2).map((event) => (
                <Card key={event.id} className="overflow-hidden bg-gradient-to-r from-brand-primary to-brand-primary-hover text-text-on-primary">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-text-on-primary text-brand-primary">
                        Featured
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-text-on-primary hover:bg-white/20">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-text-on-primary hover:bg-white/20">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-serif text-2xl font-bold mb-3">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.location}, {event.city}, {event.state}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.rating} rating • {event.attendees} attending</span>
                      </div>
                    </div>
                    <p className="text-sm mb-4 opacity-90">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${event.price}</span>
                      <Button asChild className="bg-text-on-primary text-brand-primary hover:bg-text-on-primary/90">
                        <Link to={`/event/${event.id}/tickets`}>
                          Get Tickets
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Category Filters */}
        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              All Events
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category.toLowerCase() ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">
              {searchQuery ? 'Search Results' : locationEnabled ? 'Events Near You' : 'Upcoming Events'} ({upcomingEvents.length})
            </h2>
            {searchQuery && (
              <p className="text-text-secondary">
                Showing results for "{searchQuery}"
              </p>
            )}
            {locationEnabled && !searchQuery && (
              <p className="text-text-secondary flex items-center gap-1">
                <Navigation className="w-4 h-4" />
                Within {distance} miles of your location
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Display */}
        {viewMode === 'map' ? (
          <EventMapView 
            events={upcomingEvents} 
            userLocation={userLocation}
            locationEnabled={locationEnabled}
          />
        ) : (
          <div className={`
            ${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          `}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">No Events Found</h3>
                  <p className="text-text-secondary mb-4">
                    Try adjusting your search criteria or filters
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedCity('all');
                      setSelectedSkillLevel('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-surface-contrast">
          <CardContent className="p-8 text-center">
            <h3 className="font-serif text-2xl font-bold text-text-primary mb-4">
              Don't See What You're Looking For?
            </h3>
            <p className="text-text-secondary mb-6">
              Create your own event or save your search to get notified when new events match your criteria
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-brand-primary hover:bg-brand-primary-hover">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
              <Button variant="outline">
                <Bookmark className="w-4 h-4 mr-2" />
                Save This Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Events;
