import { apiClient } from './apiClient';

export interface EventCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EventLocation {
  venue_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  slug: string;
  start_datetime: string;
  end_datetime: string;
  timezone: string;
  location: EventLocation;
  category_id: number;
  category?: EventCategory;
  creator_id: number;
  creator?: any; // User object
  max_attendees?: number;
  current_attendees: number;
  price?: number;
  early_bird_price?: number;
  early_bird_deadline?: string;
  registration_deadline?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  image_url?: string;
  banner_image_url?: string;
  video_url?: string;
  tags: string[];
  is_featured: boolean;
  is_private: boolean;
  allow_guest_registration: boolean;
  require_approval: boolean;
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  timezone: string;
  location: EventLocation;
  category_id: number;
  max_attendees?: number;
  price?: number;
  early_bird_price?: number;
  early_bird_deadline?: string;
  registration_deadline?: string;
  image_url?: string;
  banner_image_url?: string;
  video_url?: string;
  tags?: string[];
  is_featured?: boolean;
  is_private?: boolean;
  allow_guest_registration?: boolean;
  require_approval?: boolean;
  custom_fields?: Record<string, any>;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
}

export interface EventFilters {
  category_id?: number;
  status?: string;
  is_featured?: boolean;
  is_private?: boolean;
  start_date?: string;
  end_date?: string;
  search?: string;
  tags?: string[];
  city?: string;
  state?: string;
  country?: string;
  creator_id?: number;
  skip?: number;
  limit?: number;
}

class EventService {
  private static instance: EventService;

  static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  // Get all events with optional filters
  async getEvents(filters?: EventFilters): Promise<{
    success: boolean;
    events?: Event[];
    total?: number;
    error?: string;
  }> {
    try {
      const response = await apiClient.getEvents(filters);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return {
        success: true,
        events: response.data?.events || response.data || [],
        total: response.data?.total
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch events'
      };
    }
  }

  // Get single event by ID
  async getEvent(eventId: number): Promise<{
    success: boolean;
    event?: Event;
    error?: string;
  }> {
    try {
      const response = await apiClient.getEvent(eventId);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return {
        success: true,
        event: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch event'
      };
    }
  }

  // Get event by slug
  async getEventBySlug(slug: string): Promise<{
    success: boolean;
    event?: Event;
    error?: string;
  }> {
    try {
      // For now, we'll fetch all events and find by slug
      // In the future, add a dedicated endpoint for this
      const response = await this.getEvents({ search: slug, limit: 1 });
      
      if (!response.success) {
        return { success: false, error: response.error };
      }

      const event = response.events?.find(e => e.slug === slug);
      if (!event) {
        return { success: false, error: 'Event not found' };
      }

      return { success: true, event };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch event'
      };
    }
  }

  // Create new event
  async createEvent(eventData: CreateEventData): Promise<{
    success: boolean;
    event?: Event;
    error?: string;
  }> {
    try {
      const response = await apiClient.createEvent(eventData);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return {
        success: true,
        event: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create event'
      };
    }
  }

  // Update existing event
  async updateEvent(eventId: number, eventData: UpdateEventData): Promise<{
    success: boolean;
    event?: Event;
    error?: string;
  }> {
    try {
      const response = await apiClient.updateEvent(eventId, eventData);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return {
        success: true,
        event: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update event'
      };
    }
  }

  // Delete event
  async deleteEvent(eventId: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.deleteEvent(eventId);
      
      if (response.error) {
        return { success: false, error: response.error };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete event'
      };
    }
  }

  // Publish event (change status to published)
  async publishEvent(eventId: number): Promise<{
    success: boolean;
    event?: Event;
    error?: string;
  }> {
    return this.updateEvent(eventId, { status: 'published' });
  }

  // Unpublish event (change status to draft)
  async unpublishEvent(eventId: number): Promise<{
    success: boolean;
    event?: Event;
    error?: string;
  }> {
    return this.updateEvent(eventId, { status: 'draft' });
  }

  // Cancel event
  async cancelEvent(eventId: number): Promise<{
    success: boolean;
    event?: Event;
    error?: string;
  }> {
    return this.updateEvent(eventId, { status: 'cancelled' });
  }

  // Mark event as completed
  async completeEvent(eventId: number): Promise<{
    success: boolean;
    event?: Event;
    error?: string;
  }> {
    return this.updateEvent(eventId, { status: 'completed' });
  }

  // Get featured events
  async getFeaturedEvents(limit: number = 10): Promise<{
    success: boolean;
    events?: Event[];
    error?: string;
  }> {
    return this.getEvents({
      is_featured: true,
      status: 'published',
      limit
    });
  }

  // Get upcoming events
  async getUpcomingEvents(limit: number = 10): Promise<{
    success: boolean;
    events?: Event[];
    error?: string;
  }> {
    const now = new Date().toISOString();
    return this.getEvents({
      start_date: now,
      status: 'published',
      limit
    });
  }

  // Get events by category
  async getEventsByCategory(categoryId: number, limit: number = 20): Promise<{
    success: boolean;
    events?: Event[];
    error?: string;
  }> {
    return this.getEvents({
      category_id: categoryId,
      status: 'published',
      limit
    });
  }

  // Get events by location
  async getEventsByLocation(city: string, state?: string, country?: string): Promise<{
    success: boolean;
    events?: Event[];
    error?: string;
  }> {
    return this.getEvents({
      city,
      state,
      country,
      status: 'published'
    });
  }

  // Search events
  async searchEvents(query: string, limit: number = 20): Promise<{
    success: boolean;
    events?: Event[];
    error?: string;
  }> {
    return this.getEvents({
      search: query,
      status: 'published',
      limit
    });
  }

  // Get user's events (events created by user)
  async getUserEvents(userId: number, status?: string): Promise<{
    success: boolean;
    events?: Event[];
    error?: string;
  }> {
    return this.getEvents({
      creator_id: userId,
      status
    });
  }

  // Get events user is attending (would need tickets endpoint)
  async getUserAttendingEvents(userId: number): Promise<{
    success: boolean;
    events?: Event[];
    error?: string;
  }> {
    // This would require integration with tickets service
    // For now, return empty array
    return {
      success: true,
      events: []
    };
  }

  // Check if event is full
  isEventFull(event: Event): boolean {
    if (!event.max_attendees) return false;
    return event.current_attendees >= event.max_attendees;
  }

  // Check if event registration is open
  isRegistrationOpen(event: Event): boolean {
    if (event.status !== 'published') return false;
    if (this.isEventFull(event)) return false;
    
    const now = new Date();
    const eventStart = new Date(event.start_datetime);
    const registrationDeadline = event.registration_deadline 
      ? new Date(event.registration_deadline) 
      : eventStart;
    
    return now < registrationDeadline;
  }

  // Check if early bird pricing is active
  isEarlyBirdActive(event: Event): boolean {
    if (!event.early_bird_price || !event.early_bird_deadline) return false;
    
    const now = new Date();
    const deadline = new Date(event.early_bird_deadline);
    
    return now < deadline;
  }

  // Get effective price for event
  getEffectivePrice(event: Event): number {
    if (this.isEarlyBirdActive(event) && event.early_bird_price) {
      return event.early_bird_price;
    }
    return event.price || 0;
  }

  // Format event date/time for display
  formatEventDateTime(event: Event): {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    duration: string;
  } {
    const start = new Date(event.start_datetime);
    const end = new Date(event.end_datetime);
    
    const formatDate = (date: Date) => date.toLocaleDateString();
    const formatTime = (date: Date) => date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    const durationStr = duration >= 24 
      ? `${Math.floor(duration / 24)} day${Math.floor(duration / 24) !== 1 ? 's' : ''}`
      : `${duration} hour${duration !== 1 ? 's' : ''}`;
    
    return {
      startDate: formatDate(start),
      startTime: formatTime(start),
      endDate: formatDate(end),
      endTime: formatTime(end),
      duration: durationStr
    };
  }

  // Generate event URL/slug
  generateEventUrl(event: Event): string {
    return `/events/${event.slug}`;
  }

  // Check if user can edit event
  canUserEditEvent(event: Event, userId: number, userRole: string): boolean {
    if (userRole === 'admin') return true;
    if (userRole === 'organizer' && event.creator_id === userId) return true;
    return false;
  }
}

// Export singleton instance
export const eventService = EventService.getInstance();
export default eventService; 