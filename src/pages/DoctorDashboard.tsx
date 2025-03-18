
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import StatsCard from "@/components/dashboard/StatsCard";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Calendar, 
  Clock, 
  MessageSquare, 
  MoreHorizontal, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for the doctor dashboard
const mockAppointments = [
  {
    id: "1",
    patientName: "John Doe",
    patientAvatar: "https://i.pravatar.cc/150?img=12",
    date: "Today",
    time: "11:30 AM",
    duration: "30 min",
    type: "video" as const,
    status: "upcoming" as const
  },
  {
    id: "2",
    patientName: "Emma Wilson",
    patientAvatar: "https://i.pravatar.cc/150?img=5",
    date: "Today",
    time: "2:00 PM",
    duration: "45 min",
    type: "in-person" as const,
    status: "upcoming" as const,
    location: "Main St. Medical Center"
  },
  {
    id: "3",
    patientName: "Robert Brown",
    patientAvatar: "https://i.pravatar.cc/150?img=70",
    date: "Tomorrow",
    time: "9:15 AM",
    duration: "30 min",
    type: "video" as const,
    status: "upcoming" as const
  }
];

const todaySchedule = [
  { time: "09:00 AM", status: "free" },
  { time: "09:30 AM", status: "free" },
  { time: "10:00 AM", status: "free" },
  { time: "10:30 AM", status: "free" },
  { time: "11:00 AM", status: "free" },
  { time: "11:30 AM", status: "booked", patient: "John Doe", type: "video" },
  { time: "12:00 PM", status: "lunch" },
  { time: "12:30 PM", status: "lunch" },
  { time: "01:00 PM", status: "free" },
  { time: "01:30 PM", status: "free" },
  { time: "02:00 PM", status: "booked", patient: "Emma Wilson", type: "in-person" },
  { time: "02:30 PM", status: "booked", patient: "Emma Wilson", type: "in-person" },
  { time: "03:00 PM", status: "free" },
  { time: "03:30 PM", status: "free" },
  { time: "04:00 PM", status: "break" },
  { time: "04:30 PM", status: "free" },
  { time: "05:00 PM", status: "free" },
];

const DoctorDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "doctor") {
      navigate("/patient-dashboard");
    }
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated || user?.role !== "doctor") {
    return null;
  }

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground mb-8">Your practice summary for {formattedDate}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Calendar className="h-6 w-6 text-primary" />}
            title="Today's Appointments"
            value="2"
            trend={{ value: 10, isPositive: true }}
            iconColor="text-primary"
          />
          <StatsCard
            icon={<Users className="h-6 w-6 text-emerald-500" />}
            title="Total Patients"
            value="128"
            trend={{ value: 5, isPositive: true }}
            iconColor="text-emerald-500"
          />
          <StatsCard
            icon={<Activity className="h-6 w-6 text-rose-500" />}
            title="Patient Recovery Rate"
            value="94%"
            trend={{ value: 2, isPositive: true }}
            iconColor="text-rose-500"
          />
          <StatsCard
            icon={<MessageSquare className="h-6 w-6 text-amber-500" />}
            title="Unread Messages"
            value="7"
            trend={{ value: 3, isPositive: false }}
            iconColor="text-amber-500"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UpcomingAppointments 
            appointments={mockAppointments} 
            userRole="doctor"
            className="lg:col-span-2" 
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Today's Schedule</CardTitle>
              <CardDescription>
                Your appointments and availability for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {todaySchedule.map((slot, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-center p-2 rounded-md",
                      slot.status === "booked" && "bg-primary/10",
                      slot.status === "lunch" && "bg-amber-100",
                      slot.status === "break" && "bg-blue-100"
                    )}
                  >
                    <div className="w-16 text-sm font-medium">{slot.time}</div>
                    
                    {slot.status === "free" && (
                      <div className="flex-1 text-sm text-muted-foreground">Available</div>
                    )}
                    
                    {slot.status === "booked" && (
                      <div className="flex-1 flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-primary"></div>
                        <span className="text-sm font-medium">{slot.patient}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({slot.type === "video" ? "Video" : "In-person"})
                        </span>
                      </div>
                    )}
                    
                    {slot.status === "lunch" && (
                      <div className="flex-1 text-sm font-medium text-amber-800">Lunch Break</div>
                    )}
                    
                    {slot.status === "break" && (
                      <div className="flex-1 text-sm font-medium text-blue-800">Short Break</div>
                    )}
                    
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Manage schedule
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Recent Patients</CardTitle>
              <CardDescription>
                Patients you've attended to recently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="John Doe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">John Doe</h4>
                      <p className="text-sm text-muted-foreground">Hypertension, Diabetes</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Records</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="Emma Wilson" />
                      <AvatarFallback>EW</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Emma Wilson</h4>
                      <p className="text-sm text-muted-foreground">Asthma, Allergies</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Records</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://i.pravatar.cc/150?img=70" alt="Robert Brown" />
                      <AvatarFallback>RB</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Robert Brown</h4>
                      <p className="text-sm text-muted-foreground">Annual Checkup</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Records</Button>
                </div>
                
                <Button variant="outline" className="w-full" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  View all patients
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Performance Metrics</CardTitle>
              <CardDescription>
                Your practice statistics for this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Patient Satisfaction</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96%" }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Appointment Completion</span>
                    <span className="font-medium">88%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "88%" }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Follow-up Rate</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Documentation Compliance</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" size="sm">
                  View detailed analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
