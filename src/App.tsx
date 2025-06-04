import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "./components/layout/AppLayout";
import PWALayout from "./components/layout/PWALayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Classes from "./pages/Classes";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import AppInstallPage from "./pages/AppInstallPage";
import CreateEventPage from "./pages/organizer/CreateEventPage";
import EventTicketingPage from "./pages/organizer/EventTicketingPage";
import EventSeatingPage from "./pages/organizer/EventSeatingPage";
import EventCustomQuestionsPage from "./pages/organizer/EventCustomQuestionsPage";
import ManageEventPage from "./pages/organizer/ManageEventPage";
import EventCollectionsPage from "./pages/organizer/EventCollectionsPage";
import ClaimableEventsPage from "./pages/promoter/ClaimableEventsPage";
import EventClaimsPage from "./pages/admin/EventClaimsPage";
import AdminCreateEventPage from "./pages/admin/AdminCreateEventPage";
import InventoryDashboardPage from "./pages/admin/InventoryDashboardPage";
import CheckinManagementPage from "./pages/admin/CheckinManagementPage";
import TicketSelectionPage from "./pages/checkout/TicketSelectionPage";
import CheckoutDetailsPage from "./pages/checkout/CheckoutDetailsPage";
import CheckoutPaymentPage from "./pages/checkout/CheckoutPaymentPage";
import CheckoutConfirmationPage from "./pages/checkout/CheckoutConfirmationPage";
import EventPromoCodesPage from "./pages/organizer/EventPromoCodesPage";
import EventRefundsPage from "./pages/organizer/EventRefundsPage";
import EventCashPaymentPage from "./pages/organizer/EventCashPaymentPage";
import EventEmailCampaignsPage from "./pages/organizer/EventEmailCampaignsPage";
import EventPerformancePage from "./pages/organizer/EventPerformancePage";
import CashPaymentPage from "./pages/buyer/CashPaymentPage";
import TicketHistoryPage from "./pages/buyer/TicketHistoryPage";
import EventDetailsPage from "./pages/EventDetailsPage";

// PWA-specific imports
import PWALoginPage from "./pages/pwa/PWALoginPage";
import PWADashboardPage from "./pages/pwa/PWADashboardPage";
import PWACheckinPage from "./pages/pwa/PWACheckinPage";
import PWAAttendancePage from "./pages/pwa/PWAAttendancePage";
import PWASettingsPage from "./pages/pwa/PWASettingsPage";
import PWAAttendeeListPage from "./pages/pwa/PWAAttendeeListPage";
import PWAStatisticsPage from "./pages/pwa/PWAStatisticsPage";
import PWAPaymentPage from "./components/pwa/PWAPaymentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/download" element={<AppInstallPage />} />
          
          {/* PWA-specific routes (standalone, no layout) */}
          <Route path="/pwa/login" element={<PWALoginPage />} />
          
          {/* PWA routes with PWA layout */}
          <Route path="/pwa" element={<PWALayout />}>
            <Route path="dashboard" element={<PWADashboardPage />} />
            <Route path="checkin" element={<PWACheckinPage />} />
            <Route path="attendance" element={<PWAAttendancePage />} />
            <Route path="attendees/:eventId" element={<PWAAttendeeListPage />} />
            <Route path="statistics/:eventId" element={<PWAStatisticsPage />} />
            <Route path="payments/:eventId" element={<PWAPaymentPage />} />
            <Route path="settings" element={<PWASettingsPage />} />
            {/* Redirect PWA root to dashboard */}
            <Route index element={<PWADashboardPage />} />
          </Route>
          
          {/* Protected routes with layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/docs" element={
              <ProtectedRoute>
                <Docs />
              </ProtectedRoute>
            } />
            <Route path="/organizer/events/create" element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/event/:eventId/ticketing" element={
              <ProtectedRoute>
                <EventTicketingPage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/event/:eventId/seating" element={
              <ProtectedRoute>
                <EventSeatingPage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/event/:eventId/custom-questions" element={
              <ProtectedRoute>
                <EventCustomQuestionsPage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/event/:eventId/manage" element={
              <ProtectedRoute>
                <ManageEventPage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/event/:eventId/promo-codes" element={
              <ProtectedRoute>
                <EventPromoCodesPage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/event/:eventId/refunds" element={
              <ProtectedRoute>
                <EventRefundsPage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/event/:eventId/cash-payments" element={
              <ProtectedRoute>
                <EventCashPaymentPage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/event/:eventId/email-campaigns" element={
              <ProtectedRoute>
                <EventEmailCampaignsPage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/event/:eventId/performance" element={
              <ProtectedRoute>
                <EventPerformancePage />
              </ProtectedRoute>
            } />
            <Route path="/organizer/collections" element={
              <ProtectedRoute>
                <EventCollectionsPage />
              </ProtectedRoute>
            } />
            <Route path="/promoter/events/claim" element={
              <ProtectedRoute>
                <ClaimableEventsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/event-claims" element={
              <ProtectedRoute>
                <EventClaimsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/events/create-assign" element={
              <ProtectedRoute>
                <AdminCreateEventPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/inventory" element={
              <ProtectedRoute>
                <InventoryDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/event/:eventId/checkin" element={
              <ProtectedRoute>
                <CheckinManagementPage />
              </ProtectedRoute>
            } />
            
            {/* ===== SEO-FRIENDLY SLUG-BASED EVENT ROUTES ===== */}
            {/* New slug-based event details route */}
            <Route path="/event/:eventSlug" element={<EventDetailsPage />} />
            {/* New slug-based ticket selection route */}
            <Route path="/event/:eventSlug/tickets" element={<TicketSelectionPage />} />
            {/* New slug-based checkout routes */}
            <Route path="/event/:eventSlug/checkout/details" element={<CheckoutDetailsPage />} />
            <Route path="/event/:eventSlug/checkout/payment" element={<CheckoutPaymentPage />} />
            <Route path="/event/:eventSlug/checkout/confirmation" element={<CheckoutConfirmationPage />} />
            <Route path="/event/:eventSlug/cash-payment" element={<CashPaymentPage />} />
            
            {/* ===== LEGACY ID-BASED ROUTES (BACKWARD COMPATIBILITY) ===== */}
            {/* Legacy event details - will redirect to slug-based URL */}
            <Route path="/event/:eventId(\d+)" element={<EventDetailsPage />} />
            {/* Legacy ticket selection */}
            <Route path="/event/:eventId(\d+)/tickets" element={<TicketSelectionPage />} />
            {/* Legacy checkout routes */}
            <Route path="/checkout/:eventId(\d+)/details" element={<CheckoutDetailsPage />} />
            <Route path="/checkout/:eventId(\d+)/payment" element={<CheckoutPaymentPage />} />
            <Route path="/checkout/:eventId(\d+)/confirmation" element={<CheckoutConfirmationPage />} />
            <Route path="/event/:eventId(\d+)/cash-payment" element={<CashPaymentPage />} />
            
            {/* Protected route for ticket history */}
            <Route path="/tickets/history" element={
              <ProtectedRoute>
                <TicketHistoryPage />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
