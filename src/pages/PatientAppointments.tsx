
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Search, Video, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  date: string;
  time: string;
  duration: string;
  type: "in-person" | "video";
  status: "upcoming" | "completed" | "cancelled";
  location?: string;
}

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Smith",
    doctorSpecialty: "Cardiologist",
    doctorAvatar: "https://i.pravatar.cc/150?img=28",
    date: "Tomorrow",
    time: "10:00 AM",
    duration: "30 min",
    type: "video",
    status: "upcoming"
  },
  {
    id: "2",
    doctorName: "Dr. Michael Johnson",
    doctorSpecialty: "Neurologist",
    doctorAvatar: "https://i.pravatar.cc/150?img=53",
    date: "Monday, Jun 24",
    time: "2:30 PM",
    duration: "45 min",
    type: "in-person",
    status: "upcoming",
    location: "Main St. Medical Center"
  },
  {
    id: "3",
    doctorName: "Dr. Emily Davis",
    doctorSpecialty: "Dermatologist",
    doctorAvatar: "https://i.pravatar.cc/150?img=32",
    date: "June 15, 2023",
    time: "11:15 AM",
    duration: "30 min",
    type: "video",
    status: "completed"
  },
  {
    id: "4",
    doctorName: "Dr. James Wilson",
    doctorSpecialty: "General Practitioner",
    doctorAvatar: "https://i.pravatar.cc/150?img=60",
    date: "May 28, 2023",
    time: "3:00 PM",
    duration: "30 min",
    type: "in-person",
    status: "completed",
    location: "City Health Clinic"
  },
  {
    id: "5",
    doctorName: "Dr. Robert Brown",
    doctorSpecialty: "Ophthalmologist",
    doctorAvatar: "https://i.pravatar.cc/150?img=65",
    date: "June 2, 2023",
    time: "9:30 AM",
    duration: "45 min",
    type: "in-person",
    status: "cancelled",
    location: "Vision Care Center"
  }
];

const PatientAppointments = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState(mockAppointments);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "patient") {
      navigate("/doctor-dashboard");
    }
  }, [isAuthenticated, navigate, user]);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = mockAppointments.filter(
        appointment =>
          appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(mockAppointments);
    }
  }, [searchQuery]);
  
  if (!isAuthenticated || user?.role !== "patient") {
    return null;
  }
  
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
            <p className="text-muted-foreground">Manage your scheduled appointments with healthcare providers</p>
          </div>
          
          <Button asChild>
            <a href="/find-doctors">
              Book New Appointment
            </a>
          </Button>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search appointments..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              
              {['upcoming', 'completed', 'cancelled', 'all'].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="space-y-4 animate-fade-in">
                  {filteredAppointments
                    .filter(appointment => tabValue === 'all' || appointment.status === tabValue)
                    .length === 0 ? (
                      <div className="text-center py-10">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-1">No {tabValue} appointments</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {tabValue === 'upcoming' 
                            ? "You don't have any upcoming appointments scheduled" 
                            : `You don't have any ${tabValue} appointments`}
                        </p>
                        {tabValue === 'upcoming' && (
                          <Button asChild>
                            <a href="/find-doctors">Book an appointment</a>
                          </Button>
                        )}
                      </div>
                    ) : (
                      filteredAppointments
                        .filter(appointment => tabValue === 'all' || appointment.status === tabValue)
                        .map((appointment) => (
                          <div 
                            key={appointment.id}
                            className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow flex flex-col md:flex-row md:items-center gap-4"
                          >
                            <Avatar className="h-12 w-12 border-2 border-white">
                              <AvatarImage src={appointment.doctorAvatar} alt={appointment.doctorName} />
                              <AvatarFallback>{appointment.doctorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                  <h4 className="font-medium">{appointment.doctorName}</h4>
                                  <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
                                </div>
                                
                                <Badge className={cn("self-start md:self-center", getStatusStyles(appointment.status))}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 mt-3">
                                <div className="flex items-center">
                                  <Calendar className="mr-1.5 h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{appointment.date}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <Clock className="mr-1.5 h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{appointment.time} ({appointment.duration})</span>
                                </div>
                                
                                <div className="flex items-center">
                                  {appointment.type === "video" ? (
                                    <>
                                      <Video className="mr-1.5 h-4 w-4 text-primary" />
                                      <span className="text-sm text-primary">Video consultation</span>
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="mr-1.5 h-4 w-4 text-primary" />
                                      <span className="text-sm text-primary">{appointment.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 md:flex-col lg:flex-row">
                              {appointment.status === "upcoming" && (
                                <>
                                  {appointment.type === "video" && (
                                    <Button className="flex-1 md:w-full" size="sm">Join Call</Button>
                                  )}
                                  <Button variant="outline" className="flex-1 md:w-full" size="sm">Reschedule</Button>
                                </>
                              )}
                              
                              {appointment.status === "completed" && (
                                <Button variant="outline" className="flex-1 md:w-full" size="sm">View Details</Button>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientAppointments;
