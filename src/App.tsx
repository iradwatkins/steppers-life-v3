import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Events from "./pages/Events";
import Classes from "./pages/Classes";
import Community from "./pages/Community";
import Instructors from "./pages/Instructors";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import CreateEventPage from "./pages/organizer/CreateEventPage";
import EventTicketingPage from "./pages/organizer/EventTicketingPage";
import EventSeatingPage from "./pages/organizer/EventSeatingPage";
import EventCustomQuestionsPage from "./pages/organizer/EventCustomQuestionsPage";
import ManageEventPage from "./pages/organizer/ManageEventPage";
import ClaimableEventsPage from "./pages/promoter/ClaimableEventsPage";
import EventClaimsPage from "./pages/admin/EventClaimsPage";
import AdminCreateEventPage from "./pages/admin/AdminCreateEventPage";
import TicketSelectionPage from "./pages/checkout/TicketSelectionPage";
import CheckoutDetailsPage from "./pages/checkout/CheckoutDetailsPage";
import CheckoutPaymentPage from "./pages/checkout/CheckoutPaymentPage";
import CheckoutConfirmationPage from "./pages/checkout/CheckoutConfirmationPage";
import EventPromoCodesPage from "./pages/organizer/EventPromoCodesPage";
import EventRefundsPage from "./pages/organizer/EventRefundsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/events" element={<Events />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/community" element={<Community />} />
          <Route path="/instructors" element={<Instructors />} />
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
          {/* Public route for ticket selection */}
          <Route path="/event/:eventId/tickets" element={<TicketSelectionPage />} />
          {/* Public route for checkout details */}
          <Route path="/checkout/:eventId/details" element={<CheckoutDetailsPage />} />
          {/* Public route for mock payment */}
          <Route path="/checkout/:eventId/payment" element={<CheckoutPaymentPage />} />
          {/* Public route for mock order confirmation */}
          <Route path="/checkout/:eventId/confirmation" element={<CheckoutConfirmationPage />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
