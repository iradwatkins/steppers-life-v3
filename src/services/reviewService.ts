// Review Service for managing event reviews and ratings
export interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1-5 stars
  reviewText?: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean; // Has user attended the event
  organizerReply?: {
    text: string;
    createdAt: Date;
    organizerName: string;
  };
  reported: boolean;
  reportCount: number;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewRequest {
  eventId: string;
  rating: number;
  reviewText?: string;
}

export interface UpdateReviewRequest {
  reviewId: string;
  rating: number;
  reviewText?: string;
}

export interface OrganizerReplyRequest {
  reviewId: string;
  replyText: string;
  organizerName: string;
}

class ReviewService {
  private reviews: Review[] = [];
  private readonly EDIT_WINDOW_DAYS = 30;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockReviews: Review[] = [
      {
        id: 'rev-001',
        eventId: '1', // Chicago Step Championship
        userId: 'user-001',
        userName: 'Sarah Johnson',
        userEmail: 'sarah@example.com',
        rating: 5,
        reviewText: 'Amazing championship event! The competition was fierce and the organization was top-notch. Marcus is an incredible instructor and the venue was perfect for the event. Will definitely be back next year!',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        verified: true,
        reported: false,
        reportCount: 0,
        organizerReply: {
          text: 'Thank you so much Sarah! We\'re thrilled you had such a great time. Looking forward to seeing you at our next event!',
          createdAt: new Date('2024-01-16'),
          organizerName: 'Chicago Step Alliance'
        }
      },
      {
        id: 'rev-002',
        eventId: '1',
        userId: 'user-002',
        userName: 'Mike Davis',
        userEmail: 'mike@example.com',
        rating: 4,
        reviewText: 'Great championship event! Loved the variety of competition levels and the workshops. The venue was excellent and the atmosphere was electric. Only minor issue was the parking situation.',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
        verified: true,
        reported: false,
        reportCount: 0
      },
      {
        id: 'rev-003',
        eventId: '1',
        userId: 'user-003',
        userName: 'Lisa Chen',
        userEmail: 'lisa@example.com',
        rating: 5,
        reviewText: 'Absolutely incredible event! As someone new to competitive stepping, I felt so welcomed and supported. The beginner workshops were perfect and watching the advanced competitions was inspiring.',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
        verified: true,
        reported: false,
        reportCount: 0
      },
      {
        id: 'rev-004',
        eventId: 'atlanta-stepping-workshop-002',
        userId: 'user-004',
        userName: 'Robert Williams',
        userEmail: 'robert@example.com',
        rating: 4,
        reviewText: 'Solid workshop with good fundamentals. Could use more advanced techniques for experienced dancers, but overall worth attending.',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
        verified: true,
        reported: false,
        reportCount: 0
      },
      {
        id: 'rev-005',
        eventId: 'detroit-competition-003',
        userId: 'user-005',
        userName: 'Angela Thompson',
        userEmail: 'angela@example.com',
        rating: 5,
        reviewText: 'Incredible competition! The judges were fair, the organization was top-notch, and the level of talent was amazing. Can\'t wait for the next one!',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        verified: true,
        reported: false,
        reportCount: 0
      }
    ];

    this.reviews = mockReviews;
  }

  // Get reviews for a specific event
  async getEventReviews(eventId: string, sortBy: 'recent' | 'rating' = 'recent'): Promise<Review[]> {
    let eventReviews = this.reviews.filter(review => 
      review.eventId === eventId && !review.reported
    );

    // Sort reviews
    if (sortBy === 'recent') {
      eventReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortBy === 'rating') {
      eventReviews.sort((a, b) => b.rating - a.rating);
    }

    return eventReviews;
  }

  // Get review statistics for an event
  async getEventReviewStats(eventId: string): Promise<ReviewStats> {
    const eventReviews = this.reviews.filter(review => 
      review.eventId === eventId && !review.reported
    );

    if (eventReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalRating = eventReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / eventReviews.length) * 10) / 10;

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    eventReviews.forEach(review => {
      ratingBreakdown[review.rating as keyof typeof ratingBreakdown]++;
    });

    return {
      averageRating,
      totalReviews: eventReviews.length,
      ratingBreakdown
    };
  }

  // Check if user can review an event
  async canUserReview(eventId: string, userId: string): Promise<boolean> {
    // Mock logic: Check if user has purchased tickets for this event
    // In real implementation, this would check ticket purchase history
    const existingReview = this.reviews.find(review => 
      review.eventId === eventId && review.userId === userId
    );
    
    // User can review if they haven't reviewed yet and have purchased tickets
    return !existingReview && this.hasUserPurchasedTickets(eventId, userId);
  }

  // Mock method to check if user has purchased tickets
  private hasUserPurchasedTickets(eventId: string, userId: string): boolean {
    // Mock logic - in real implementation, this would check actual ticket purchases
    return true; // For demo purposes, allow all users to review
  }

  // Create a new review
  async createReview(request: CreateReviewRequest, userId: string, userName: string, userEmail: string): Promise<Review> {
    const canReview = await this.canUserReview(request.eventId, userId);
    if (!canReview) {
      throw new Error('User cannot review this event. Must have purchased tickets and not already reviewed.');
    }

    if (request.rating < 1 || request.rating > 5) {
      throw new Error('Rating must be between 1 and 5 stars.');
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      eventId: request.eventId,
      userId,
      userName,
      userEmail,
      rating: request.rating,
      reviewText: request.reviewText?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      verified: true, // In real implementation, verify actual attendance
      reported: false,
      reportCount: 0
    };

    this.reviews.push(newReview);
    return newReview;
  }

  // Update an existing review
  async updateReview(request: UpdateReviewRequest, userId: string): Promise<Review> {
    const review = this.reviews.find(r => r.id === request.reviewId && r.userId === userId);
    if (!review) {
      throw new Error('Review not found or user not authorized to edit.');
    }

    // Check if review is within edit window
    const daysSinceCreation = (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > this.EDIT_WINDOW_DAYS) {
      throw new Error(`Reviews can only be edited within ${this.EDIT_WINDOW_DAYS} days of creation.`);
    }

    if (request.rating < 1 || request.rating > 5) {
      throw new Error('Rating must be between 1 and 5 stars.');
    }

    review.rating = request.rating;
    review.reviewText = request.reviewText?.trim();
    review.updatedAt = new Date();

    return review;
  }

  // Delete a review
  async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    const reviewIndex = this.reviews.findIndex(r => r.id === reviewId && r.userId === userId);
    if (reviewIndex === -1) {
      throw new Error('Review not found or user not authorized to delete.');
    }

    const review = this.reviews[reviewIndex];
    
    // Check if review is within edit window
    const daysSinceCreation = (Date.now() - review.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > this.EDIT_WINDOW_DAYS) {
      throw new Error(`Reviews can only be deleted within ${this.EDIT_WINDOW_DAYS} days of creation.`);
    }

    this.reviews.splice(reviewIndex, 1);
    return true;
  }

  // Add organizer reply to a review
  async addOrganizerReply(request: OrganizerReplyRequest): Promise<Review> {
    const review = this.reviews.find(r => r.id === request.reviewId);
    if (!review) {
      throw new Error('Review not found.');
    }

    if (review.organizerReply) {
      throw new Error('Organizer has already replied to this review.');
    }

    review.organizerReply = {
      text: request.replyText.trim(),
      createdAt: new Date(),
      organizerName: request.organizerName
    };

    return review;
  }

  // Report a review
  async reportReview(reviewId: string, userId: string): Promise<boolean> {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found.');
    }

    if (review.userId === userId) {
      throw new Error('Cannot report your own review.');
    }

    review.reportCount++;
    
    // Auto-hide reviews with multiple reports (mock moderation)
    if (review.reportCount >= 3) {
      review.reported = true;
    }

    return true;
  }

  // Get user's reviews
  async getUserReviews(userId: string): Promise<Review[]> {
    return this.reviews.filter(review => review.userId === userId);
  }
}

export const reviewService = new ReviewService(); 