# Story L: Classes Module (Initial Launch)

## Epic Reference
Based on Epic L: Classes Module (docs/epic-l.md)

## User Stories

### L.0 General Instructor Features
**As an** instructor on the platform  
**I want** enhanced profile features and follower capabilities  
**So that** I can build my community and manage my teaching business

**Acceptance Criteria:**
- Instructors can have followers (follow/unfollow functionality)
- Instructor profile includes editable contact info for workshop/hiring inquiries
- Instructors get lists of attendees for their VOD classes
- Follower count and management features in instructor dashboard

### L.1 Physical Class Management (Free Tier)
**As an** instructor  
**I want** to create and manage physical classes and workshops  
**So that** I can offer in-person instruction to my community

**Acceptance Criteria:**
- "Add Class" button prominently displayed on instructor dashboard
- Create/Edit Physical Class form with comprehensive fields:
  - Class Type (Regular Class/Workshop)
  - Title, Level (Beginner/Intermediate/Advanced/Footwork)
  - Location (Venue, Address)
  - Complex recurring schedule patterns (weekly/monthly)
  - Start/End time, cost settings
  - Capacity, RSVP tracking, class images
  - Contact info, prerequisites, special notes
- Unlimited physical class listings per instructor
- Class validity notification system with periodic confirmations
- Auto-deletion of unconfirmed classes
- PWA push notifications for class updates to attendees

### L.2 Physical Class Discovery (Attendee Experience)
**As a** steppers community member  
**I want** to discover and attend physical classes  
**So that** I can learn from instructors in my area

**Acceptance Criteria:**
- Browse classes by categories, levels, instructor
- Keyword search functionality
- Location-based search ("near me", specific cities/regions)
- Filter by class type, level, availability
- Interest list functionality ("I want to attend")
- Class detail pages with all information and attendee lists
- RSVP/interest tracking for capacity management

### L.3 VOD Class Setup (Paid Tier - $40/month)
**As an** instructor  
**I want** to create and sell video-on-demand classes  
**So that** I can monetize my teaching and reach a broader audience

**Acceptance Criteria:**
- $40/month VOD hosting fee subscription management
- Admin-configurable pricing and intro offers
- Create/Edit VOD Class Series interface
- Structure classes with sections and skill levels
- Video upload and management system
- Platform video optimization and compression
- Instructor-set pricing (minimum $40, configurable)
- Video ordering within classes/sections

### L.4 VOD Class Purchasing (Attendee Experience)
**As a** steppers community member  
**I want** to purchase and access video classes  
**So that** I can learn at my own pace and schedule

**Acceptance Criteria:**
- Browse and filter VOD classes by level/category/location
- View detailed class information and instructor profiles
- Purchase access to full classes or specific levels
- Access control system for purchased content
- Video player with progress tracking
- Automated payout system for instructor earnings

### L.5 Promotional Products Store (Exclusive Access)
**As a** qualified platform user (Promoter/Instructor/Business)  
**I want** access to promotional materials at special prices  
**So that** I can market my services and events effectively

**Acceptance Criteria:**
- Exclusive access for users with active qualifying roles
- Product catalog: Business Cards, Banners, Flyers, Tickets, Wristbands, Lawn Signs
- Admin-managed product information and pricing
- Artwork upload system with drag & drop
- Checkout without artwork (email submission option)
- Chicago pickup vs shipping options
- Order notes for customization requests
- "Promotional Materials" section in user dashboard

### L.6 T-Shirt Merchandise (Instructor Sales)
**As an** instructor  
**I want** to sell branded t-shirts through my profile  
**So that** I can create additional revenue and brand awareness

**Acceptance Criteria:**
- Steppers Life provided/designed t-shirt options
- Instructor opt-in for t-shirt sales
- Instructor-set retail pricing (e.g., $35)
- Fixed platform portion (e.g., $10) configurable by admin
- Design selection interface for instructors
- Customer purchase flow through instructor profiles
- Revenue sharing and payout system

## Technical Notes
- Implement recurring schedule pattern system for complex class timing
- Design scalable video hosting and streaming infrastructure
- Build secure payment processing for multiple revenue streams
- Create role-based access control for exclusive features
- Implement geolocation services for class discovery
- Design push notification system for class updates
- Plan for video compression and CDN distribution
- Build automated payout system for instructor earnings

## Integration Requirements
- Integrate with existing user authentication and role system
- Connect with payment processing for subscriptions and purchases
- Link with notification system for class updates
- Integrate with community features for instructor following
- Connect with analytics for tracking class performance

## Definition of Done
- [ ] Instructor profile enhancements implemented
- [ ] Physical class creation and management system functional
- [ ] Class discovery and search features working
- [ ] VOD subscription and payment system operational
- [ ] Video upload and streaming platform ready
- [ ] Promotional products store accessible to qualified users
- [ ] T-shirt sales system integrated with instructor profiles
- [ ] Payment and payout systems tested and secure
- [ ] Mobile responsive design verified
- [ ] Push notification system operational
- [ ] Admin management tools for all class features complete 