
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { InterviewProvider } from "./contexts/InterviewContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GenerateQuestions from "./pages/GenerateQuestions";
import ScheduleInterview from "./pages/ScheduleInterview";
import InterviewSession from "./pages/InterviewSession";
import Feedback from "./pages/Feedback";
import InterviewReports from "./pages/InterviewReports";
import InterviewHistory from "./pages/InterviewHistory";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InterviewProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/generate-questions" element={<ProtectedRoute><GenerateQuestions /></ProtectedRoute>} />
              <Route path="/schedule-interview" element={<ProtectedRoute><ScheduleInterview /></ProtectedRoute>} />
              <Route path="/interview-session" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
              <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
              <Route path="/interview-reports" element={<ProtectedRoute><InterviewReports /></ProtectedRoute>} />
              <Route path="/interview-history" element={<ProtectedRoute><InterviewHistory /></ProtectedRoute>} />
              
              {/* Catch-all Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </InterviewProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
