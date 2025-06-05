# H-005: Basic Platform Configuration (Admin - Initial Launch)

**Story:** As a `stepperslife.com` staff member, I want a basic set of configuration tools to manage core platform settings, event categories, and VOD pricing, so that I can adapt the platform to business needs and maintain operational control.

**Acceptance Criteria:**
- ⏳ **AC1:** Interface to manage Hyper-Specific Event Categories & Class Categories (add, edit, deactivate, reorder)
- ⏳ **AC2:** Ability to manage essential site settings (e.g., site name, contact email, default timezones)
- ⏳ **AC3:** Functionality to manage VOD hosting fee amount and introductory offer toggle
- ⏳ **AC4:** Interface to manage pickup locations for the physical store (if applicable)
- ⏳ **AC5:** Secure access control for authorized admin staff

**Tasks / Subtasks:**

- [ ] **Task 1: Platform Configuration Service & API Endpoints**
  - [ ] Develop `platformConfigService.ts` for managing categories, site settings, VOD settings, and pickup locations.
  - [ ] Create API endpoints for updating these configurations.

- [ ] **Task 2: Category Management UI**
  - [ ] Build `CategoryManagementPage.tsx` for adding, editing, deactivating, and reordering event and class categories.
  - [ ] Implement drag-and-drop or reordering controls.

- [ ] **Task 3: General Site Settings & VOD Configuration UI**
  - [ ] Create `GeneralSettingsPage.tsx` for essential site settings.
  - [ ] Build `VODSettingsPanel.tsx` for VOD hosting fee and introductory offer.
  - [ ] Implement `PickupLocationManagement.tsx` if applicable.

- [ ] **Task 4: Permissions Integration**
  - [ ] Ensure only authorized admin roles can modify these settings. 