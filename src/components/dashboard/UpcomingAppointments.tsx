
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, MoreHorizontal, Video } from "lucide-react";
import { cn } from "@/lib/utils";

// Types for our appointments
interface Appointment {
  id: string;
  doctorName?: string;
  doctorAvatar?: string;
  patientName?: string;
  patientAvatar?: string;
  date: string;
  time: string;
  duration: string;
  type: "in-person" | "video";
  status: "upcoming" | "completed" | "cancelled";
  location?: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  userRole: "patient" | "doctor";
  className?: string;
}

const UpcomingAppointments = ({ appointments, userRole, className }: UpcomingAppointmentsProps) => {
  const filteredAppointments = appointments.filter(appointment => appointment.status === "upcoming");
  
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">Upcoming Appointments</CardTitle>
          <CardDescription>
            Your scheduled appointments for the next days
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={userRole === "patient" ? "/patient-appointments" : "/doctor-appointments"}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div 
                key={appointment.id}
                className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white">
                      <AvatarImage 
                        src={userRole === "patient" ? appointment.doctorAvatar : appointment.patientAvatar} 
                        alt={userRole === "patient" ? appointment.doctorName : appointment.patientName} 
                      />
                      <AvatarFallback>
                        {userRole === "patient" 
                          ? appointment.doctorName?.charAt(0) 
                          : appointment.patientName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-medium">
                        {userRole === "patient" ? appointment.doctorName : appointment.patientName}
                      </h4>
                      
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3.5 w-3.5" />
                          <span>{appointment.date}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3.5 w-3.5" />
                          <span>{appointment.time} ({appointment.duration})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        {appointment.type === "video" ? (
                          <div className="flex items-center text-sm">
                            <Video className="mr-1 h-3.5 w-3.5 text-primary" />
                            <span className="text-primary">Video consultation</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
                            <span className="text-primary">{appointment.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  {appointment.type === "video" && (
                    <Button size="sm">Join Call</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No upcoming appointments</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {userRole === "patient" 
                ? "Book a consultation with a doctor to get started" 
                : "You don't have any upcoming appointments"}
            </p>
            {userRole === "patient" && (
              <Button asChild>
                <Link to="/find-doctors">Book an appointment</Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
