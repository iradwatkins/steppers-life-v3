import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Edit, Settings, Eye, Send, Archive, CalendarCheck2, Ticket, Armchair, MessageSquarePlus, Tag as TagIcon, RefreshCw, DollarSign } from 'lucide-react';

// Mock event data structure
interface MockEvent {
  id: string;
  name: string;
  status: 'Draft' | 'Published' | 'Unpublished' | 'Pending Review';
  // Add other relevant event details if needed for display
  date?: string;
  location?: string;
}

// Simulate fetching event data (replace with actual API call later)
const fetchMockEvent = (eventId: string): Promise<MockEvent> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: eventId,
        name: `Sample Event: The Big Steppers Bash ${eventId.slice(-3)}`,
        status: 'Draft',
        date: '2025-10-15',
        location: 'Community Grand Hall'
      });
    }, 500);
  });
};

const ManageEventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<MockEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchMockEvent(eventId).then(data => {
        setEvent(data);
        setLoading(false);
      });
    } else {
      // Handle case where eventId is not present, perhaps redirect or show error
      setLoading(false);
      // navigate('/organizer/dashboard'); // Example redirect
    }
  }, [eventId, navigate]);

  const handleStatusChange = (newStatus: MockEvent['status']) => {
    if (event) {
      setEvent({ ...event, status: newStatus });
      // Here you would call an API to update the event status in the backend
      console.log(`Event ${event.id} status changed to ${newStatus}`);
      // Potentially show a toast notification for success
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background-main flex items-center justify-center"><p className="text-text-secondary">Loading event details...</p></div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-background-main flex items-center justify-center"><p className="text-destructive">Event not found or ID missing.</p></div>;
  }

  const managementLinks = [
    {
      label: 'Event Details',
      icon: <Edit className="h-5 w-5 text-brand-primary" />,
      description: 'Update name, date, location, description, and image.',
      path: `/organizer/events/create`, // This could be an edit page /organizer/event/${eventId}/edit-details
      note: eventId ? `(for event ${event.name}) (Currently links to Create Page)` : '(Currently links to Create Page)'
    },
    {
      label: 'Ticketing Configuration',
      icon: <Ticket className="h-5 w-5 text-brand-primary" />,
      description: 'Manage ticket types, prices, and sales periods.',
      path: `/organizer/event/${eventId}/ticketing`,
    },
    {
      label: 'Seating Arrangements',
      icon: <Armchair className="h-5 w-5 text-brand-primary" />,
      description: 'Define sections, tables, or general admission.',
      path: `/organizer/event/${eventId}/seating`,
    },
    {
      label: 'Custom Attendee Questions',
      icon: <MessageSquarePlus className="h-5 w-5 text-brand-primary" />,
      description: 'Add custom questions for attendees during registration.',
      path: `/organizer/event/${eventId}/custom-questions`,
    },
    {
      label: 'Promotional Codes',
      icon: <TagIcon className="h-5 w-5 text-brand-primary" />,
      description: 'Create and manage discount codes for your event.',
      path: `/organizer/event/${eventId}/promo-codes`,
    },
    {
      label: 'Refunds & Cancellations',
      icon: <RefreshCw className="h-5 w-5 text-brand-primary" />,
      description: 'Process refund requests and handle ticket cancellations.',
      path: `/organizer/event/${eventId}/refunds`,
    },
    {
      label: 'Cash Payment Management',
      icon: <DollarSign className="h-5 w-5 text-brand-primary" />,
      description: 'Generate codes for cash payments and verify transactions.',
      path: `/organizer/event/${eventId}/cash-payments`,
    },
  ];

  return (
    <div className="min-h-screen bg-background-main py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-surface-card mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold text-text-primary">Manage Event: {event.name}</CardTitle>
                <CardDescription className="text-text-secondary">Event ID: {event.id}</CardDescription>
              </div>
              <Badge 
                className="text-sm font-semibold px-3 py-1 bg-yellow-100 text-yellow-700 border-yellow-300"
              >
                Status: {event.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-text-secondary"><strong className="text-text-primary">Date:</strong> {event.date || 'Not set'} | <strong className="text-text-primary">Location:</strong> {event.location || 'Not set'}</p>
            <Separator />
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-text-primary font-medium mr-2">Actions:</span>
              {event.status !== 'Published' && (
                <Button onClick={() => handleStatusChange('Published')} className="bg-green-600 hover:bg-green-700 text-white">
                  <CalendarCheck2 className="mr-2 h-4 w-4" /> Publish Event
                </Button>
              )}
              {event.status === 'Published' && (
                <Button onClick={() => handleStatusChange('Unpublished')} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                  <Archive className="mr-2 h-4 w-4" /> Unpublish Event
                </Button>
              )}
              {event.status !== 'Draft' && event.status !== 'Published' && (
                <Button onClick={() => handleStatusChange('Draft')} variant="outline">
                  Move to Draft
                </Button>
              )}
              {/* Add 'Submit for Review' button if that state is implemented */}
              {/* <Button onClick={() => handleStatusChange('Pending Review')} variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
                <Send className="mr-2 h-4 w-4" /> Submit for Review
              </Button> */}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate('/explore')} className="mr-auto">
                <Eye className="mr-2 h-4 w-4" /> View Public Page (Placeholder)
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {managementLinks.map((link) => (
            <Link to={link.path} key={link.label} className="block hover:no-underline">
              <Card className="bg-surface-card hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
                <CardHeader className="flex-row items-start justify-between pb-3">
                  <div className="flex items-center">
                    {link.icon}
                    <CardTitle className="text-xl font-semibold text-text-primary ml-3">{link.label}</CardTitle>
                  </div>
                  <ChevronRight className="h-5 w-5 text-text-tertiary" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-text-secondary text-sm">{link.description}</p>
                  {link.note && <p className="text-xs text-text-tertiary mt-1">{link.note}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageEventPage; 