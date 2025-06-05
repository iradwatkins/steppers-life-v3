# H-004: Content Management (Basic - for Platform-Owned Static Content - Initial Launch)

**Story:** As a `stepperslife.com` staff member, I want a basic content management system to update static website pages, so that I can easily maintain essential information like 'About Us', 'Terms of Service', and 'FAQ' without developer intervention.

**Acceptance Criteria:**
- ⏳ **AC1:** Rich text editor for editing static pages (About Us, Contact Us, ToS, Privacy Policy, FAQ)
- ⏳ **AC2:** Ability to preview content changes before publishing
- ⏳ **AC3:** Version history for static pages with rollback capabilities
- ⏳ **AC4:** Secure access control for authorized admin staff
- ⏳ **AC5:** Simple interface for managing page URLs/slugs

**Tasks / Subtasks:**

- [ ] **Task 1: Static Content Service & API Endpoints**
  - [ ] Develop `staticContentService.ts` for fetching, updating, and managing static content.
  - [ ] Create API endpoints for CRUD operations on static pages, including versioning.

- [ ] **Task 2: Content Management UI**
  - [ ] Build `StaticContentManagementPage.tsx` with a list of static pages.
  - [ ] Integrate a rich text editor component (e.g., Quill, TinyMCE, or a simpler one) for editing page content.
  - [ ] Implement preview functionality.

- [ ] **Task 3: Versioning & Publishing Workflow**
  - [ ] Implement basic version history display and rollback functionality.
  - [ ] Add a publish/save draft mechanism. 