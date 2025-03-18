
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PlusCircle, Search, Upload } from "lucide-react";

// Mock patients data
const mockPatients = [
  { id: "1", name: "John Doe", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "2", name: "Emma Wilson", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "3", name: "Robert Brown", avatar: "https://i.pravatar.cc/150?img=70" },
  { id: "4", name: "Linda Martinez", avatar: "https://i.pravatar.cc/150?img=24" },
  { id: "5", name: "David Wilson", avatar: "https://i.pravatar.cc/150?img=59" }
];

// Mock medical records for John Doe
const mockMedicalRecords = [
  {
    id: "1",
    title: "Annual Physical Examination",
    date: "May 15, 2023",
    type: "Examination",
    doctor: "Dr. Sarah Smith",
    summary: "Patient is in good health. Blood pressure is normal at 120/80. Recommended continued exercise and maintaining current diet.",
    attachments: ["physical_exam_results.pdf"]
  },
  {
    id: "2",
    title: "Blood Work Results",
    date: "April 28, 2023",
    type: "Laboratory",
    doctor: "Dr. Michael Johnson",
    summary: "Cholesterol levels are slightly elevated at 210 mg/dL. Recommended lifestyle modifications and follow-up in 3 months.",
    attachments: ["blood_work_results.pdf", "cholesterol_chart.jpg"]
  },
  {
    id: "3",
    title: "Cardiology Consultation",
    date: "March 10, 2023",
    type: "Consultation",
    doctor: "Dr. Emily Davis",
    summary: "EKG shows normal sinus rhythm. No evidence of cardiovascular disease. Recommended routine follow-up in 1 year.",
    attachments: ["ekg_results.pdf"]
  },
  {
    id: "4",
    title: "Vaccination Record",
    date: "February 05, 2023",
    type: "Immunization",
    doctor: "Dr. Sarah Smith",
    summary: "Patient received annual flu vaccine and COVID-19 booster. No adverse reactions observed.",
    attachments: ["vaccination_record.pdf"]
  },
  {
    id: "5",
    title: "Dermatology Visit",
    date: "January 20, 2023",
    type: "Consultation",
    doctor: "Dr. Robert Wilson",
    summary: "Examined skin lesion on left arm. Benign appearance. Recommended sun protection and monitoring for changes.",
    attachments: ["dermatology_notes.pdf", "skin_lesion_photo.jpg"]
  }
];

const PatientRecordsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "doctor") {
      navigate("/patient-dashboard");
    }
    // Set default selected patient
    if (mockPatients.length > 0 && !selectedPatient) {
      setSelectedPatient(mockPatients[0].id);
    }
  }, [isAuthenticated, navigate, user, selectedPatient]);

  if (!isAuthenticated || user?.role !== "doctor") {
    return null;
  }

  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatientData = mockPatients.find(p => p.id === selectedPatient);

  // Filter records based on tab selection and search
  const filteredRecords = mockMedicalRecords;

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Patient Records</h1>
        <p className="text-muted-foreground mb-8">Secure medical records management</p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-80">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Select Patient</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <div className="space-y-1 p-2">
                    {filteredPatients.map(patient => (
                      <button
                        key={patient.id}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                          selectedPatient === patient.id ? "bg-primary/10" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedPatient(patient.id)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={patient.avatar} alt={patient.name} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{patient.name}</span>
                      </button>
                    ))}
                    
                    {filteredPatients.length === 0 && (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">No patients match your search</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            {selectedPatientData ? (
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedPatientData.avatar} alt={selectedPatientData.name} />
                        <AvatarFallback>{selectedPatientData.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{selectedPatientData.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Medical Records</p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Record
                      </Button>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="mt-2">
                    <TabsList className="mb-4 bg-muted">
                      <TabsTrigger value="all">All Records</TabsTrigger>
                      <TabsTrigger value="examinations">Examinations</TabsTrigger>
                      <TabsTrigger value="lab">Laboratory</TabsTrigger>
                      <TabsTrigger value="consultations">Consultations</TabsTrigger>
                      <TabsTrigger value="immunizations">Immunizations</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-4">
                      {filteredRecords.map(record => (
                        <div key={record.id} className="p-4 border rounded-lg transition-colors hover:bg-muted/30">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">{record.title}</h3>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span>{record.date}</span>
                                <span>•</span>
                                <span>{record.type}</span>
                                <span>•</span>
                                <span>{record.doctor}</span>
                              </div>
                              <p className="mt-3 text-sm">{record.summary}</p>
                              
                              {record.attachments.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium">Attachments:</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {record.attachments.map((file, index) => (
                                      <Button key={index} variant="outline" size="sm" className="h-8 text-xs">
                                        <FileText className="h-3 w-3 mr-1" />
                                        {file}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="examinations" className="space-y-4">
                      {filteredRecords.filter(r => r.type === "Examination").map(record => (
                        <div key={record.id} className="p-4 border rounded-lg transition-colors hover:bg-muted/30">
                          {/* Same structure as above */}
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">{record.title}</h3>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <span>{record.date}</span>
                                <span>•</span>
                                <span>{record.type}</span>
                                <span>•</span>
                                <span>{record.doctor}</span>
                              </div>
                              <p className="mt-3 text-sm">{record.summary}</p>
                              
                              {record.attachments.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium">Attachments:</p>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {record.attachments.map((file, index) => (
                                      <Button key={index} variant="outline" size="sm" className="h-8 text-xs">
                                        <FileText className="h-3 w-3 mr-1" />
                                        {file}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                      
                      {filteredRecords.filter(r => r.type === "Examination").length === 0 && (
                        <div className="p-8 text-center border rounded-lg">
                          <p className="text-muted-foreground">No examination records found</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    {/* Similar structure for other tabs */}
                    <TabsContent value="lab" className="space-y-4">
                      {filteredRecords.filter(r => r.type === "Laboratory").length > 0 ? (
                        filteredRecords.filter(r => r.type === "Laboratory").map(record => (
                          <div key={record.id} className="p-4 border rounded-lg transition-colors hover:bg-muted/30">
                            {/* Same content structure */}
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <h3 className="font-medium">{record.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>{record.date}</span>
                                  <span>•</span>
                                  <span>{record.type}</span>
                                  <span>•</span>
                                  <span>{record.doctor}</span>
                                </div>
                                <p className="mt-3 text-sm">{record.summary}</p>
                                
                                {record.attachments.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-sm font-medium">Attachments:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {record.attachments.map((file, index) => (
                                        <Button key={index} variant="outline" size="sm" className="h-8 text-xs">
                                          <FileText className="h-3 w-3 mr-1" />
                                          {file}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center border rounded-lg">
                          <p className="text-muted-foreground">No laboratory records found</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="consultations" className="space-y-4">
                      {filteredRecords.filter(r => r.type === "Consultation").length > 0 ? (
                        filteredRecords.filter(r => r.type === "Consultation").map(record => (
                          <div key={record.id} className="p-4 border rounded-lg transition-colors hover:bg-muted/30">
                            {/* Same content structure */}
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <h3 className="font-medium">{record.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>{record.date}</span>
                                  <span>•</span>
                                  <span>{record.type}</span>
                                  <span>•</span>
                                  <span>{record.doctor}</span>
                                </div>
                                <p className="mt-3 text-sm">{record.summary}</p>
                                
                                {record.attachments.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-sm font-medium">Attachments:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {record.attachments.map((file, index) => (
                                        <Button key={index} variant="outline" size="sm" className="h-8 text-xs">
                                          <FileText className="h-3 w-3 mr-1" />
                                          {file}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center border rounded-lg">
                          <p className="text-muted-foreground">No consultation records found</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="immunizations" className="space-y-4">
                      {filteredRecords.filter(r => r.type === "Immunization").length > 0 ? (
                        filteredRecords.filter(r => r.type === "Immunization").map(record => (
                          <div key={record.id} className="p-4 border rounded-lg transition-colors hover:bg-muted/30">
                            {/* Same content structure */}
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <h3 className="font-medium">{record.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <span>{record.date}</span>
                                  <span>•</span>
                                  <span>{record.type}</span>
                                  <span>•</span>
                                  <span>{record.doctor}</span>
                                </div>
                                <p className="mt-3 text-sm">{record.summary}</p>
                                
                                {record.attachments.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-sm font-medium">Attachments:</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {record.attachments.map((file, index) => (
                                        <Button key={index} variant="outline" size="sm" className="h-8 text-xs">
                                          <FileText className="h-3 w-3 mr-1" />
                                          {file}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center border rounded-lg">
                          <p className="text-muted-foreground">No immunization records found</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center border rounded-lg p-12">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Select a Patient</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose a patient from the list to view their medical records
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

export default PatientRecordsPage;
