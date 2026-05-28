import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigate } from 'react-router-dom';

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EditionView = lazy(() => import("./pages/EditionView"));
const TeacherPortal = lazy(() => import("./pages/TeacherPortal"));

// Admin pages
const Login = lazy(() => import("./pages/Admin/Login"));
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard"));
const PlaceholderAdmin = lazy(() => import("./pages/Admin/PlaceholderAdmin"));
const EditionAdminLayout = lazy(() => import("./pages/Admin/EditionAdminLayout"));
const GlobalAdmin = lazy(() => import("./pages/Admin/GlobalAdmin"));
const ParticipantsAdmin = lazy(() => import("./pages/Admin/Edition/ParticipantsAdmin"));
const PhasesAdmin = lazy(() => import("./pages/Admin/Edition/PhasesAdmin"));

// Loading fallback
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/editions/:id" element={<EditionView />} />
            <Route path="/teacher-portal" element={<TeacherPortal />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="landing-page" element={<GlobalAdmin />} />
              <Route path="settings" element={<PlaceholderAdmin title="Configurações" />} />
              
              <Route path="editions/:id" element={<EditionAdminLayout />}>
                <Route index element={<Navigate to="participants" replace />} />
                <Route path="participants" element={<ParticipantsAdmin />} />
                <Route path="phases" element={<PhasesAdmin />} />
                <Route path="awards" element={<PlaceholderAdmin title="Prêmios" />} />
                <Route path="workshops" element={<PlaceholderAdmin title="Workshops" />} />
                <Route path="gallery" element={<PlaceholderAdmin title="Galeria" />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
);

export default App;