
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, Brain, Calendar, FileText, MessageSquare, PlusCircle, Stethoscope } from "lucide-react";

// Mock data
const mockAppointments = [
  {
    id: "1",
    doctorName: "Dr. Sarah Smith",
    doctorAvatar: "https://i.pravatar.cc/150?img=28",
    date: "Tomorrow",
    time: "10:00 AM",
    duration: "30 min",
    type: "video" as const,
    status: "upcoming" as const
  },
  {
    id: "2",
    doctorName: "Dr. Michael Johnson",
    doctorAvatar: "https://i.pravatar.cc/150?img=53",
    date: "Monday, Jun 24",
    time: "2:30 PM",
    duration: "45 min",
    type: "in-person" as const,
    status: "upcoming" as const,
    location: "Main St. Medical Center"
  }
];

const mockDoctors = [
  {
    id: "1",
    name: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    avatar: "https://i.pravatar.cc/150?img=28",
    rating: 4.9
  },
  {
    id: "2",
    name: "Dr. Michael Johnson",
    specialty: "Neurologist",
    avatar: "https://i.pravatar.cc/150?img=53",
    rating: 4.7
  },
  {
    id: "3",
    name: "Dr. Emily Davis",
    specialty: "Dermatologist",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 4.8
  }
];

const PatientDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "patient") {
      navigate("/doctor-dashboard");
    }
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated || user?.role !== "patient") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground mb-8">Here's what's happening with your health</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Calendar className="h-6 w-6 text-primary" />}
            title="Upcoming Appointments"
            value="2"
            iconColor="text-primary"
          />
          <StatsCard
            icon={<Stethoscope className="h-6 w-6 text-emerald-500" />}
            title="Current Doctors"
            value="3"
            iconColor="text-emerald-500"
          />
          <StatsCard
            icon={<FileText className="h-6 w-6 text-amber-500" />}
            title="Medical Records"
            value="7"
            iconColor="text-amber-500"
          />
          <StatsCard
            icon={<Activity className="h-6 w-6 text-rose-500" />}
            title="Next Check-up"
            value="18 days"
            iconColor="text-rose-500"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UpcomingAppointments 
            appointments={mockAppointments} 
            userRole="patient"
            className="lg:col-span-2"
          />
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-semibold">My Doctors</CardTitle>
                <CardDescription>Healthcare professionals you work with</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">View all</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDoctors.map(doctor => (
                  <div key={doctor.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10 ring-2 ring-background">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{doctor.name}</h4>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center text-amber-500">
                      <span className="font-medium">{doctor.rating}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 ml-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add a new doctor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Symptom Checker</CardTitle>
              <CardDescription>
                Get preliminary insights about your symptoms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 rounded-lg p-6 text-center">
                <Brain className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">AI-powered assistant</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Describe your symptoms to get preliminary insights and recommendations.
                </p>
                <Button asChild>
                  <a href="/symptom-checker">Start Symptom Check</a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Messages</CardTitle>
              <CardDescription>
                Latest communications with your doctors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://i.pravatar.cc/150?img=28" alt="Dr. Sarah Smith" />
                    <AvatarFallback>SS</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">Dr. Sarah Smith</h4>
                      <span className="text-xs text-muted-foreground">Yesterday</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your test results look good. Let's discuss them in our next appointment.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://i.pravatar.cc/150?img=53" alt="Dr. Michael Johnson" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">Dr. Michael Johnson</h4>
                      <span className="text-xs text-muted-foreground">3 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Remember to take your medication as prescribed. See you next week.
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View all messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
