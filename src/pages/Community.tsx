import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, MapPin, Phone, Globe, Star, Search, Filter, Plus, Clock, CheckCircle } from 'lucide-react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const businesses = [
    {
      id: 1,
      name: "Steppin' Threads Boutique",
      category: "Clothing & Accessories",
      description: "High-quality stepping shoes, apparel, and accessories for dancers of all levels.",
      location: "Chicago, IL",
      phone: "(312) 555-0123",
      website: "www.steppinthreads.com",
      rating: 4.8,
      reviewCount: 67,
      image: "/placeholder.svg",
      verified: true,
      featured: true,
      hours: "Mon-Sat 10AM-8PM",
      specialties: ["Stepping Shoes", "Dance Apparel", "Accessories"]
    },
    {
      id: 2,
      name: "Smooth Moves Dance Studio",
      category: "Studios & Venues",
      description: "Premier dance studio offering private lessons, group classes, and event space rental.",
      location: "Atlanta, GA",
      phone: "(404) 555-0456",
      website: "www.smoothmovesdance.com",
      rating: 4.9,
      reviewCount: 123,
      image: "/placeholder.svg",
      verified: true,
      featured: false,
      hours: "Mon-Sun 9AM-11PM",
      specialties: ["Private Lessons", "Group Classes", "Event Space"]
    },
    {
      id: 3,
      name: "DJ Marcus Events",
      category: "Entertainment Services",
      description: "Professional DJ services for stepping events, socials, and competitions.",
      location: "Detroit, MI",
      phone: "(313) 555-0789",
      website: "www.djmarcusevents.com",
      rating: 4.7,
      reviewCount: 89,
      image: "/placeholder.svg",
      verified: true,
      featured: false,
      hours: "Available 24/7",
      specialties: ["Event DJ", "Stepping Music", "Sound Equipment"]
    },
    {
      id: 4,
      name: "Step Perfect Photography",
      category: "Photography Services",
      description: "Capturing the elegance and passion of stepping through professional photography.",
      location: "Houston, TX",
      phone: "(713) 555-0321",
      website: "www.stepperfectphoto.com",
      rating: 4.6,
      reviewCount: 45,
      image: "/placeholder.svg",
      verified: false,
      featured: false,
      hours: "By Appointment",
      specialties: ["Event Photography", "Competition Photos", "Portrait Sessions"]
    },
    {
      id: 5,
      name: "Urban Groove Catering",
      category: "Food & Catering",
      description: "Soul food catering services for stepping events and celebrations.",
      location: "Memphis, TN",
      phone: "(901) 555-0654",
      website: "www.urbangroovecatering.com",
      rating: 4.5,
      reviewCount: 78,
      image: "/placeholder.svg",
      verified: true,
      featured: false,
      hours: "Mon-Fri 8AM-6PM",
      specialties: ["Event Catering", "Soul Food", "Party Platters"]
    },
    {
      id: 6,
      name: "Stepping Health & Wellness",
      category: "Health & Fitness",
      description: "Physical therapy and wellness services specifically for dancers.",
      location: "Chicago, IL",
      phone: "(312) 555-0987",
      website: "www.steppingwellness.com",
      rating: 4.9,
      reviewCount: 156,
      image: "/placeholder.svg",
      verified: true,
      featured: true,
      hours: "Mon-Fri 7AM-7PM",
      specialties: ["Physical Therapy", "Sports Medicine", "Injury Prevention"]
    }
  ];

  const categories = [
    "All",
    "Clothing & Accessories",
    "Studios & Venues", 
    "Entertainment Services",
    "Photography Services",
    "Food & Catering",
    "Health & Fitness",
    "Music Services",
    "Event Planning"
  ];

  const locations = ["All Locations", "Chicago, IL", "Atlanta, GA", "Detroit, MI", "Houston, TX", "Memphis, TN", "Dallas, TX"];

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeTab === 'all' || business.category === activeTab;
    const matchesLocation = selectedLocation === 'all' || selectedLocation === 'All Locations' || business.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const featuredBusinesses = businesses.filter(business => business.featured);

  return (
    <div className="min-h-screen bg-background-main py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">
                Business & Services Directory
              </h1>
              <p className="text-text-secondary text-lg">
                Discover and connect with stepping community businesses and service providers
              </p>
            </div>
            <Button className="bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary">
              <Plus className="w-4 h-4 mr-2" />
              List Your Business
            </Button>
          </div>
        </div>

        {/* Featured Businesses */}
        {featuredBusinesses.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-text-primary mb-6">Featured Businesses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredBusinesses.map((business) => (
                <Card key={business.id} className="overflow-hidden border-brand-primary/20">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={business.image}
                        alt={business.name}
                        className="w-full h-32 object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-brand-primary text-text-on-primary">
                        Featured
                      </Badge>
                      {business.verified && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-text-primary">{business.name}</h3>
                          <Badge variant="secondary" className="text-xs">{business.category}</Badge>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{business.rating}</span>
                          <span className="text-xs text-text-secondary ml-1">({business.reviewCount})</span>
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm mb-4">{business.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-text-secondary">
                          <MapPin className="w-4 h-4 mr-2" />
                          {business.location}
                        </div>
                        <div className="flex items-center text-text-secondary">
                          <Clock className="w-4 h-4 mr-2" />
                          {business.hours}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search businesses and services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location === 'All Locations' ? 'all' : location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category === 'All' ? 'all' : category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    (activeTab === 'all' && category === 'All') || activeTab === category
                      ? 'bg-brand-primary text-text-on-primary'
                      : 'bg-surface-contrast text-text-secondary hover:text-text-primary hover:bg-surface-card'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Listings */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-text-primary">{business.name}</h3>
                          {business.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">{business.category}</Badge>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{business.rating}</span>
                        <span className="text-xs text-text-secondary ml-1">({business.reviewCount})</span>
                      </div>
                    </div>
                    
                    <p className="text-text-secondary text-sm mb-3 line-clamp-2">{business.description}</p>
                    
                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex items-center text-text-secondary">
                        <MapPin className="w-3 h-3 mr-2" />
                        {business.location}
                      </div>
                      <div className="flex items-center text-text-secondary">
                        <Phone className="w-3 h-3 mr-2" />
                        {business.phone}
                      </div>
                      {business.website && (
                        <div className="flex items-center text-text-secondary">
                          <Globe className="w-3 h-3 mr-2" />
                          {business.website}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {business.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Contact
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Store className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-text-primary mb-2">No businesses found</h3>
              <p className="text-text-secondary mb-6">
                No businesses match your current search criteria. Try adjusting your filters or search terms.
              </p>
              <Button className="bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary">
                <Plus className="w-4 h-4 mr-2" />
                Be the First to List Your Business
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Community;
