
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Camera, Clock, Edit, MoreHorizontal, UserCheck, Video } from "lucide-react";

// Mock schedule data for the doctor
const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
];

const mockAppointments = {
  "2023-06-15": [
    {
      id: "1",
      patientName: "John Doe",
      patientAvatar: "https://i.pravatar.cc/150?img=12",
      time: "9:00 AM",
      duration: 30,
      type: "video",
      status: "confirmed",
      reason: "Follow-up Consultation"
    },
    {
      id: "2",
      patientName: "Emma Wilson",
      patientAvatar: "https://i.pravatar.cc/150?img=5",
      time: "11:00 AM",
      duration: 45,
      type: "in-person",
      status: "confirmed",
      reason: "Annual Checkup"
    },
    {
      id: "3",
      patientName: "Robert Brown",
      patientAvatar: "https://i.pravatar.cc/150?img=70",
      time: "2:30 PM",
      duration: 30,
      type: "video",
      status: "confirmed",
      reason: "Medication Review"
    }
  ],
  "2023-06-16": [
    {
      id: "4",
      patientName: "Linda Martinez",
      patientAvatar: "https://i.pravatar.cc/150?img=24",
      time: "10:30 AM",
      duration: 30,
      type: "in-person",
      status: "confirmed",
      reason: "Migraine Consultation"
    }
  ],
  "2023-06-19": [
    {
      id: "5",
      patientName: "David Wilson",
      patientAvatar: "https://i.pravatar.cc/150?img=59",
      time: "1:00 PM",
      duration: 45,
      type: "video",
      status: "confirmed",
      reason: "Heart Checkup"
    },
    {
      id: "6",
      patientName: "Sarah Johnson",
      patientAvatar: "https://i.pravatar.cc/150?img=32",
      time: "3:00 PM",
      duration: 30,
      type: "in-person",
      status: "confirmed",
      reason: "First Consultation"
    }
  ]
};

const SchedulePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week">("day");
  
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

  // Format the selected date as 'YYYY-MM-DD' to match the mock data keys
  const formattedDate = date ? date.toISOString().split("T")[0] : "";
  
  // Get appointments for the selected date
  const selectedDateAppointments = mockAppointments[formattedDate as keyof typeof mockAppointments] || [];
  
  // For each time slot, find the corresponding appointment (if any)
  const daySchedule = timeSlots.map(timeSlot => {
    const appointment = selectedDateAppointments.find(app => app.time === timeSlot);
    return {
      time: timeSlot,
      appointment: appointment || null,
      status: appointment ? "booked" : "free"
    };
  });

  // Mark lunch break
  daySchedule.find(slot => slot.time === "12:00 PM")!.status = "lunch";
  daySchedule.find(slot => slot.time === "12:30 PM")!.status = "lunch";
  
  // Mark a short break
  daySchedule.find(slot => slot.time === "3:30 PM")!.status = "break";

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Schedule</h1>
          <p className="text-muted-foreground mb-8">Manage your appointments and availability</p>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-96 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view your schedule</CardDescription>
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
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your next scheduled appointments</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-72">
                    <div className="px-6 py-2 space-y-2">
                      {Object.entries(mockAppointments).flatMap(([day, apps]) => 
                        apps.map(app => ({...app, day}))
                      ).sort((a, b) => {
                        if (a.day !== b.day) return a.day.localeCompare(b.day);
                        return a.time.localeCompare(b.time);
                      }).map(app => (
                        <div key={app.id} className="py-2 border-b last:border-0 space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "h-2 w-2 rounded-full",
                                app.type === "video" ? "bg-blue-500" : "bg-emerald-500"
                              )} />
                              <span className="font-medium text-sm">
                                {new Date(app.day).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <Badge variant={app.type === "video" ? "secondary" : "outline"}>
                              {app.type === "video" ? "Video" : "In Person"}
                            </Badge>
                          </div>
                          <div className="ml-4 flex items-center gap-3">
                            <div>
                              <p className="text-sm">{app.time} ({app.duration} min)</p>
                              <p className="text-sm font-medium">{app.patientName}</p>
                              <p className="text-xs text-muted-foreground">{app.reason}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {Object.values(mockAppointments).flat().length === 0 && (
                        <div className="py-8 text-center">
                          <p className="text-muted-foreground">No upcoming appointments</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex-1">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>
                        {date ? date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Today'}
                      </CardTitle>
                      <CardDescription>Your daily schedule</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Select value={view} onValueChange={(v) => setView(v as "day" | "week")}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day View</SelectItem>
                          <SelectItem value="week">Week View</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Hours
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {daySchedule.map((slot, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "flex items-center p-3 rounded-md group",
                          slot.status === "booked" && "bg-primary/10",
                          slot.status === "lunch" && "bg-amber-100",
                          slot.status === "break" && "bg-blue-100"
                        )}
                      >
                        <div className="w-16 text-sm font-medium">{slot.time}</div>
                        
                        {slot.status === "free" && (
                          <div className="flex-1 text-sm text-muted-foreground">Available</div>
                        )}
                        
                        {slot.status === "booked" && slot.appointment && (
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={slot.appointment.patientAvatar} alt={slot.appointment.patientName} />
                                <AvatarFallback>{slot.appointment.patientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{slot.appointment.patientName}</p>
                                <p className="text-xs text-muted-foreground">{slot.appointment.reason}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={slot.appointment.type === "video" ? "secondary" : "outline"} className="mr-2">
                                {slot.appointment.type === "video" ? 
                                  <Video className="h-3 w-3 mr-1" /> : 
                                  <UserCheck className="h-3 w-3 mr-1" />
                                }
                                {slot.appointment.type === "video" ? "Video" : "In Person"}
                              </Badge>
                              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {slot.status === "lunch" && (
                          <div className="flex-1 text-sm font-medium text-amber-800">Lunch Break</div>
                        )}
                        
                        {slot.status === "break" && (
                          <div className="flex-1 text-sm font-medium text-blue-800">Short Break</div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-6">
                    <Clock className="h-4 w-4 mr-2" />
                    Set Working Hours
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchedulePage;
