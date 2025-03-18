
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CalendarPlus, Check, Clock, Search, User, Video, X } from "lucide-react";

// Mock appointments for the doctor
const mockAppointments = [
  {
    id: "1",
    patientName: "John Doe",
    patientAvatar: "https://i.pravatar.cc/150?img=12",
    date: "2023-06-20",
    time: "09:00 AM",
    duration: 30,
    type: "video",
    status: "upcoming",
    reason: "Follow-up Consultation"
  },
  {
    id: "2",
    patientName: "Emma Wilson",
    patientAvatar: "https://i.pravatar.cc/150?img=5",
    date: "2023-06-20",
    time: "11:00 AM",
    duration: 45,
    type: "in-person",
    status: "upcoming",
    reason: "Annual Checkup"
  },
  {
    id: "3",
    patientName: "Robert Brown",
    patientAvatar: "https://i.pravatar.cc/150?img=70",
    date: "2023-06-22",
    time: "02:30 PM",
    duration: 30,
    type: "video",
    status: "upcoming",
    reason: "Medication Review"
  },
  {
    id: "4",
    patientName: "Linda Martinez",
    patientAvatar: "https://i.pravatar.cc/150?img=24",
    date: "2023-06-15",
    time: "10:30 AM",
    duration: 30,
    type: "in-person",
    status: "completed",
    reason: "Migraine Consultation"
  },
  {
    id: "5",
    patientName: "David Wilson",
    patientAvatar: "https://i.pravatar.cc/150?img=59",
    date: "2023-06-16",
    time: "01:00 PM",
    duration: 45,
    type: "video",
    status: "completed",
    reason: "Heart Checkup"
  },
  {
    id: "6",
    patientName: "Sarah Johnson",
    patientAvatar: "https://i.pravatar.cc/150?img=32",
    date: "2023-06-10",
    time: "03:00 PM",
    duration: 30,
    type: "in-person",
    status: "cancelled",
    reason: "First Consultation",
    cancellationReason: "Patient requested reschedule"
  }
];

// Helper function to filter appointments by status
const filterAppointmentsByStatus = (appointments: any[], status: string) => {
  return appointments.filter(appointment => appointment.status === status);
};

const DoctorAppointmentsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
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

  // Filtering logic
  let filteredAppointments = [...mockAppointments];
  
  // Filter by search term
  if (searchTerm) {
    filteredAppointments = filteredAppointments.filter(appointment =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filter by status
  if (statusFilter !== "all") {
    filteredAppointments = filteredAppointments.filter(appointment =>
      appointment.status === statusFilter
    );
  }
  
  // Filter by type
  if (typeFilter !== "all") {
    filteredAppointments = filteredAppointments.filter(appointment =>
      appointment.type === typeFilter
    );
  }
  
  // Filter by selected date (if any)
  if (date) {
    const formattedDate = date.toISOString().split("T")[0];
    filteredAppointments = filteredAppointments.filter(appointment =>
      appointment.date === formattedDate
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Appointments</h1>
          <p className="text-muted-foreground mb-8">Manage your patient appointments</p>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-96 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Appointment Analytics</CardTitle>
                  <CardDescription>Overview of your appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Appointments</span>
                      <span className="font-medium">{mockAppointments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Upcoming</span>
                      <span className="font-medium">{filterAppointmentsByStatus(mockAppointments, "upcoming").length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-medium">{filterAppointmentsByStatus(mockAppointments, "completed").length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cancelled</span>
                      <span className="font-medium">{filterAppointmentsByStatus(mockAppointments, "cancelled").length}</span>
                    </div>
                    
                    <div className="pt-2">
                      <Button className="w-full" variant="outline">
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Create New Appointment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <CardTitle>Your Appointments</CardTitle>
                      <CardDescription>
                        {date ? date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'All dates'}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-full sm:w-[150px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select
                        value={typeFilter}
                        onValueChange={setTypeFilter}
                      >
                        <SelectTrigger className="w-full sm:w-[150px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="in-person">In-Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search appointments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="list" className="mt-2">
                    <TabsList className="mb-4">
                      <TabsTrigger value="list">List View</TabsTrigger>
                      <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="list">
                      <ScrollArea className="h-[600px]">
                        <div className="space-y-4">
                          {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((appointment) => (
                              <div
                                key={appointment.id}
                                className={cn(
                                  "p-4 border rounded-lg transition-colors",
                                  appointment.status === "upcoming" && "border-primary/20",
                                  appointment.status === "completed" && "border-green-200 bg-green-50",
                                  appointment.status === "cancelled" && "border-red-200 bg-red-50"
                                )}
                              >
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                  <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage src={appointment.patientAvatar} alt={appointment.patientName} />
                                      <AvatarFallback>{appointment.patientName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-medium">{appointment.patientName}</h3>
                                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                          variant={appointment.type === "video" ? "secondary" : "outline"}
                                          className="text-xs"
                                        >
                                          {appointment.type === "video" ? (
                                            <Video className="h-3 w-3 mr-1" />
                                          ) : (
                                            <User className="h-3 w-3 mr-1" />
                                          )}
                                          {appointment.type === "video" ? "Video" : "In-Person"}
                                        </Badge>
                                        <Badge
                                          variant={
                                            appointment.status === "upcoming"
                                              ? "default"
                                              : appointment.status === "completed"
                                              ? "success"
                                              : "destructive"
                                          }
                                          className="text-xs capitalize"
                                        >
                                          {appointment.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col items-end justify-center">
                                    <div className="text-sm font-medium">
                                      {new Date(appointment.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {appointment.time} ({appointment.duration} min)
                                    </div>
                                    
                                    {appointment.status === "upcoming" && (
                                      <div className="flex gap-1 mt-2">
                                        <Button size="sm" variant="default">
                                          Start
                                        </Button>
                                        <Button size="sm" variant="outline">
                                          Reschedule
                                        </Button>
                                      </div>
                                    )}
                                    
                                    {appointment.status === "completed" && (
                                      <div className="flex items-center text-green-600 mt-2">
                                        <Check className="h-4 w-4 mr-1" />
                                        <span className="text-sm">Completed</span>
                                      </div>
                                    )}
                                    
                                    {appointment.status === "cancelled" && (
                                      <div className="flex items-center text-red-600 mt-2">
                                        <X className="h-4 w-4 mr-1" />
                                        <span className="text-sm">Cancelled</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {appointment.status === "cancelled" && appointment.cancellationReason && (
                                  <p className="text-sm text-red-600 mt-2 ml-12">
                                    Reason: {appointment.cancellationReason}
                                  </p>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center border rounded-lg">
                              <p className="text-muted-foreground">No appointments found for the selected criteria</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="calendar">
                      <div className="p-8 text-center border rounded-lg">
                        <p className="text-muted-foreground">Calendar view will be available soon</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorAppointmentsPage;
