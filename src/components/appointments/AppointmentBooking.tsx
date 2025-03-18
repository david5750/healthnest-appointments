
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check, Clock, MapPin, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock available time slots
const morningSlots = ["09:00 AM", "10:00 AM", "11:00 AM"];
const afternoonSlots = ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
const eveningSlots = ["05:00 PM", "06:00 PM"];

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

interface AppointmentBookingProps {
  doctor: Doctor;
}

const AppointmentBooking = ({ doctor }: AppointmentBookingProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [appointmentType, setAppointmentType] = useState<"video" | "in-person">("video");
  const [reason, setReason] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  
  const isDateSelected = !!date;
  const isTimeSelected = !!timeSlot;
  
  const handleContinue = () => {
    if (currentStep === 1 && isDateSelected && isTimeSelected) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Simulate booking appointment
      toast({
        title: "Appointment scheduled",
        description: `Your appointment with ${doctor.name} on ${date && format(date, "MMMM d, yyyy")} at ${timeSlot} has been confirmed.`,
      });
      
      // Navigate to appointments page
      navigate("/patient-appointments");
    }
  };
  
  return (
    <Card className="shadow-soft border-none">
      <CardHeader>
        <CardTitle>Book an appointment</CardTitle>
        <CardDescription>
          Select your preferred date and time to schedule a consultation with {doctor.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {currentStep === 1 ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Select date</h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => {
                  // Disable past dates and weekends
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const day = date.getDay();
                  return date < today || day === 0 || day === 6;
                }}
                className="rounded-md border shadow-sm"
              />
            </div>
            
            {isDateSelected && (
              <div className="animate-fade-in">
                <h3 className="text-lg font-medium mb-4">Select time</h3>
                <Tabs defaultValue="morning">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="morning">Morning</TabsTrigger>
                    <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
                    <TabsTrigger value="evening">Evening</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="morning" className="mt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {morningSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={timeSlot === slot ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setTimeSlot(slot)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot}
                          {timeSlot === slot && <Check className="ml-auto h-4 w-4" />}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="afternoon" className="mt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {afternoonSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={timeSlot === slot ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setTimeSlot(slot)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot}
                          {timeSlot === slot && <Check className="ml-auto h-4 w-4" />}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="evening" className="mt-4">
                    <div className="grid grid-cols-3 gap-2">
                      {eveningSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={timeSlot === slot ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setTimeSlot(slot)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot}
                          {timeSlot === slot && <Check className="ml-auto h-4 w-4" />}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-medium mb-4">Appointment details</h3>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{date && format(date, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor</span>
                  <span className="font-medium">{doctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialty</span>
                  <span className="font-medium">{doctor.specialty}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Appointment type</h3>
              <RadioGroup 
                className="space-y-3"
                value={appointmentType}
                onValueChange={(value) => setAppointmentType(value as "video" | "in-person")}
              >
                <div className={cn(
                  "flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-all",
                  appointmentType === "video" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                )}>
                  <RadioGroupItem value="video" id="video" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="video" className="text-base font-medium flex items-center cursor-pointer">
                      <Video className="h-5 w-5 mr-2 text-primary" />
                      Video consultation
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with your doctor via a secure video call from the comfort of your home.
                    </p>
                  </div>
                </div>
                
                <div className={cn(
                  "flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-all",
                  appointmentType === "in-person" ? "border-primary bg-primary/5" : "hover:border-primary/50"
                )}>
                  <RadioGroupItem value="in-person" id="in-person" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="in-person" className="text-base font-medium flex items-center cursor-pointer">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      In-person visit
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Visit the doctor's office for a face-to-face consultation.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Reason for visit</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Provide a brief description of your symptoms or reason for the appointment
              </p>
              <Textarea 
                placeholder="E.g., Annual check-up, Persistent headache, Follow-up appointment, etc."
                className="min-h-[100px]"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {currentStep === 2 && (
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(1)}
          >
            Back
          </Button>
        )}
        
        <Button 
          onClick={handleContinue}
          disabled={(currentStep === 1 && (!isDateSelected || !isTimeSelected))}
          className={currentStep === 1 ? "ml-auto" : ""}
        >
          {currentStep === 1 ? (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Confirm Appointment"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AppointmentBooking;
