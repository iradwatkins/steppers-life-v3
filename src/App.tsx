
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Events from "./pages/Events";
import Classes from "./pages/Classes";
import Community from "./pages/Community";
import Instructors from "./pages/Instructors";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/events" element={<Events />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/community" element={<Community />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/docs" element={<Docs />} />
        </Route>
        {/* Auth routes without layout */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
