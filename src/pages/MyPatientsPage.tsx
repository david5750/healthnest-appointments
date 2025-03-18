
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  FileText, 
  MessageSquare, 
  Search,
  User
} from "lucide-react";

// Mock patients data
const mockPatients = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=12",
    age: 45,
    gender: "Male",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    lastVisit: "May 15, 2023",
    nextAppointment: "Jun 22, 2023",
    conditions: ["Hypertension", "Diabetes"],
    bloodType: "A+",
    notes: "Patient is responding well to current treatment plan."
  },
  {
    id: "2",
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=5",
    age: 32,
    gender: "Female",
    phone: "+1 (555) 987-6543",
    email: "emma.wilson@example.com",
    lastVisit: "Apr 28, 2023",
    nextAppointment: "Jul 10, 2023",
    conditions: ["Asthma", "Allergies"],
    bloodType: "O-",
    notes: "Patient needs regular check on inhaler usage."
  },
  {
    id: "3",
    name: "Robert Brown",
    avatar: "https://i.pravatar.cc/150?img=70",
    age: 58,
    gender: "Male",
    phone: "+1 (555) 456-7890",
    email: "robert.brown@example.com",
    lastVisit: "Jun 05, 2023",
    nextAppointment: "Jun 19, 2023",
    conditions: ["Arthritis"],
    bloodType: "B+",
    notes: "Showing improvement in mobility after physical therapy."
  },
  {
    id: "4",
    name: "Linda Martinez",
    avatar: "https://i.pravatar.cc/150?img=24",
    age: 29,
    gender: "Female",
    phone: "+1 (555) 789-0123",
    email: "linda.martinez@example.com",
    lastVisit: "May 30, 2023",
    nextAppointment: "Jul 15, 2023",
    conditions: ["Migraine"],
    bloodType: "AB+",
    notes: "New medication has reduced frequency of migraines."
  },
  {
    id: "5",
    name: "David Wilson",
    avatar: "https://i.pravatar.cc/150?img=59",
    age: 62,
    gender: "Male",
    phone: "+1 (555) 234-5678",
    email: "david.wilson@example.com",
    lastVisit: "Jun 10, 2023",
    nextAppointment: "Jun 24, 2023",
    conditions: ["Coronary Artery Disease", "Hypertension"],
    bloodType: "A-",
    notes: "Needs to continue daily monitoring of blood pressure."
  }
];

const MyPatientsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

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

  const filteredPatients = mockPatients.filter(
    patient => patient.name.toLowerCase().includes(filter.toLowerCase())
  );

  const selectedPatientData = mockPatients.find(patient => patient.id === selectedPatient);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">My Patients</h1>
        <p className="text-muted-foreground mb-8">Manage and review your patient records</p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search patients..." 
                className="pl-10"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              {filteredPatients.map(patient => (
                <button
                  key={patient.id}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedPatient === patient.id ? "bg-primary/10 border-primary/20" : "bg-card hover:bg-muted"
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar} alt={patient.name} />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{patient.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {patient.conditions.map((condition, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 bg-muted text-xs rounded-full">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              
              {filteredPatients.length === 0 && (
                <div className="p-8 text-center border rounded-lg">
                  <p className="text-muted-foreground">No patients match your search</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            {selectedPatientData ? (
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="medical-records" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Medical Records
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Appointments
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={selectedPatientData.avatar} alt={selectedPatientData.name} />
                            <AvatarFallback>{selectedPatientData.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <h2 className="text-xl font-bold">{selectedPatientData.name}</h2>
                          <div className="text-sm text-muted-foreground">
                            {selectedPatientData.age} years • {selectedPatientData.gender}
                          </div>
                          <div className="mt-2 space-x-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" /> Message
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Email</Label>
                            <div className="font-medium">{selectedPatientData.email}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Phone</Label>
                            <div className="font-medium">{selectedPatientData.phone}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Blood Type</Label>
                            <div className="font-medium">{selectedPatientData.bloodType}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Last Visit</Label>
                            <div className="font-medium">{selectedPatientData.lastVisit}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Next Appointment</Label>
                            <div className="font-medium">{selectedPatientData.nextAppointment}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Medical Conditions</Label>
                            <div className="font-medium">{selectedPatientData.conditions.join(", ")}</div>
                          </div>
                          <div className="sm:col-span-2">
                            <Label className="text-muted-foreground">Notes</Label>
                            <div className="font-medium">{selectedPatientData.notes}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="medical-records">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Medical Records</h3>
                        <Button>Add New Record</Button>
                      </div>
                      
                      {/* Placeholder for medical records */}
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">Annual Physical Examination</h4>
                              <p className="text-sm text-muted-foreground">May 15, 2023</p>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">Blood Work Results</h4>
                              <p className="text-sm text-muted-foreground">Apr 28, 2023</p>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">Cardiology Consultation</h4>
                              <p className="text-sm text-muted-foreground">Mar 10, 2023</p>
                            </div>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="appointments">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Appointments</h3>
                        <Button>Schedule New</Button>
                      </div>
                      
                      {/* Placeholder for appointments */}
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h4 className="font-medium">Follow-up Consultation</h4>
                              <p className="text-sm text-muted-foreground">June 22, 2023 • 10:00 AM • 30 min</p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button variant="outline" size="sm">Cancel</Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex flex-col sm:flex-row justify-between">
                            <div>
                              <h4 className="font-medium">Medication Review</h4>
                              <p className="text-sm text-muted-foreground">July 15, 2023 • 2:30 PM • 15 min</p>
                            </div>
                            <div className="flex gap-2 mt-2 sm:mt-0">
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button variant="outline" size="sm">Cancel</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full flex items-center justify-center border rounded-lg p-12">
                <div className="text-center">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Select a Patient</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose a patient from the list to view their information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPatientsPage;
