
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import PatientDashboard from "@/pages/PatientDashboard";
import DoctorDashboard from "@/pages/DoctorDashboard";
import PatientAppointments from "@/pages/PatientAppointments";
import DoctorAppointmentsPage from "@/pages/DoctorAppointmentsPage";
import MyDoctorsPage from "@/pages/MyDoctorsPage";
import MyPatientsPage from "@/pages/MyPatientsPage";
import SchedulePage from "@/pages/SchedulePage";
import MessagesPage from "@/pages/MessagesPage";
import PatientRecordsPage from "@/pages/PatientRecordsPage";
import SymptomCheckerPage from "@/pages/SymptomCheckerPage";
import MedicalRecords from "@/pages/MedicalRecords";
import Notifications from "@/pages/Notifications";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Patient routes */}
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/patient-appointments" element={<PatientAppointments />} />
            <Route path="/my-doctors" element={<MyDoctorsPage />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
            
            {/* Doctor routes */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/my-patients" element={<MyPatientsPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/patient-records" element={<PatientRecordsPage />} />
            
            {/* Common routes */}
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
