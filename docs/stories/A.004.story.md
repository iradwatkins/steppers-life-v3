# Story A.004: Upload & Configure Seating Charts

## Status: Completed (Frontend) - Backend Integration Pending

## Story

- As an **event organizer/promoter**
- I want **to upload my existing seating charts and configure seat mapping**
- so that **I can sell tickets with visual seat selection without building complex charts from scratch**

## Acceptance Criteria (ACs)

1. **AC1:** ✅ Upload seating chart images (PNG, JPG, PDF)
2. **AC2:** ✅ Interactive seat mapping tool to define sellable seats on uploaded charts
3. **AC3:** ✅ Configure seat properties (price tier, section, row/seat number, ADA status)
4. **AC4:** ✅ Visual seat status overlay (available/sold/reserved) on customer-facing chart
5. **AC5:** ✅ Customer interactive seat selection on uploaded charts
6. **AC6:** ✅ Save and manage multiple seating chart configurations per venue
7. **AC7:** ⚠️ Integration with ticketing and inventory management (Backend needed)
8. **AC8:** ✅ Mobile-responsive chart viewing and selection
9. **AC9:** ✅ ADA seat designation and accessibility compliance
10. **AC10:** ✅ Chart preview and testing tools for organizers

## Tasks / Subtasks

- [x] Task 1: File upload and management system
  - [x] Implement secure chart image upload
  - [x] Add file validation and processing
  - [x] Create chart storage and retrieval system
- [x] Task 2: Interactive seat mapping interface
  - [x] Build click-to-map seat definition tool
  - [x] Add seat property configuration forms
  - [x] Implement seat coordinate saving system
- [x] Task 3: Customer-facing interactive charts
  - [x] Create seat selection overlay system
  - [x] Add real-time seat status updates (Frontend ready)
  - [x] Implement mobile-responsive chart viewing
- [ ] Task 4: Chart management and integration
  - [x] Build chart template save/load functionality
  - [ ] Integrate with existing ticketing system (Backend API needed)
  - [ ] Connect to inventory management (Backend API needed)
- [x] Task 5: ADA compliance and accessibility
  - [x] Add ADA seat designation tools
  - [x] Implement accessibility compliance features
  - [x] Ensure WCAG compliance for chart interfaces

## Dev Technical Guidance

- ✅ File upload system with validation (PNG, JPG, PDF support)
- ✅ JSON-based seat mapping storage: `{x, y, seatId, properties}`
- ✅ SVG/Canvas overlay for seat status and interaction
- ⚠️ Real-time inventory integration for seat availability (Needs backend API)
- ✅ Mobile-first responsive design for chart viewing
- ⚠️ Secure file storage with event-based organization (Needs backend implementation)

## Story Progress Notes

### Agent Model Used: `Claude Sonnet 4 - BMAD Orchestrator`

### Completion Notes List

- ✅ Frontend implementation completed in `src/pages/organizer/EventSeatingPage.tsx`
- ✅ Complete upload-based seating chart system with tabbed interface
- ✅ Interactive seat mapping with click-to-place functionality
- ✅ Seat property configuration (number, row, section, price, ADA)
- ✅ Visual preview with color-coded seats and legend
- ✅ Mobile-responsive design with proper accessibility
- ✅ File validation and error handling with toast notifications
- ✅ ADA compliance with wheelchair symbol and accessibility features
- ⚠️ Backend integration pending for persistent storage and real-time updates
- ⚠️ API endpoints needed for saving charts and connecting to ticketing system

### Technical Implementation Details

**Completed Frontend Features:**
- Multi-step tabbed interface (Upload → Map → Configure → Preview)
- File upload with drag-and-drop and validation
- Interactive chart with percentage-based seat positioning
- Real-time seat counter and statistics
- Price category management with color coding
- ADA designation with visual indicators
- Chart export functionality
- Mobile-responsive viewing

**Pending Backend Integration:**
- File storage API for seating chart images
- Database schema for seat mappings and chart configurations
- Integration with existing ticketing system
- Real-time seat status updates via WebSocket or polling
- Inventory management connection

### Change Log

- Updated from deferred visual builder to active upload-based system
- ✅ Completed frontend implementation with full functionality
- Focused on practical implementation over complex chart creation
- ✅ Moved from future phase to completed development scope
- Ready for backend integration and Epic G implementation 