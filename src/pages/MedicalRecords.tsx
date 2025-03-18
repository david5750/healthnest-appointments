
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Download, 
  Eye, 
  FileSpreadsheet, 
  FileText, 
  FilmIcon, 
  Lock, 
  Search, 
  Shield, 
  TestTube, 
  Upload, 
  X 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MedicalRecord {
  id: string;
  title: string;
  type: "test" | "prescription" | "imaging" | "report";
  date: string;
  doctor: string;
  doctorAvatar: string;
  hospital: string;
  fileSize: string;
  fileType: string;
}

// Mock medical records data
const mockRecords: MedicalRecord[] = [
  {
    id: "1",
    title: "Blood Test Results",
    type: "test",
    date: "June 10, 2023",
    doctor: "Dr. Sarah Smith",
    doctorAvatar: "https://i.pravatar.cc/150?img=28",
    hospital: "General Hospital",
    fileSize: "1.2 MB",
    fileType: "PDF"
  },
  {
    id: "2",
    title: "Chest X-Ray",
    type: "imaging",
    date: "May 28, 2023",
    doctor: "Dr. Michael Johnson",
    doctorAvatar: "https://i.pravatar.cc/150?img=53",
    hospital: "City Medical Center",
    fileSize: "5.8 MB",
    fileType: "DICOM"
  },
  {
    id: "3",
    title: "Medication Prescription",
    type: "prescription",
    date: "June 5, 2023",
    doctor: "Dr. Emily Davis",
    doctorAvatar: "https://i.pravatar.cc/150?img=32",
    hospital: "Health First Clinic",
    fileSize: "0.5 MB",
    fileType: "PDF"
  },
  {
    id: "4",
    title: "Annual Physical Exam",
    type: "report",
    date: "April 15, 2023",
    doctor: "Dr. James Wilson",
    doctorAvatar: "https://i.pravatar.cc/150?img=60",
    hospital: "Wellness Center",
    fileSize: "2.1 MB",
    fileType: "PDF"
  },
  {
    id: "5",
    title: "MRI Scan Results",
    type: "imaging",
    date: "March 20, 2023",
    doctor: "Dr. Michael Johnson",
    doctorAvatar: "https://i.pravatar.cc/150?img=53",
    hospital: "Neurological Institute",
    fileSize: "12.4 MB",
    fileType: "DICOM"
  },
  {
    id: "6",
    title: "Cholesterol Test",
    type: "test",
    date: "February 8, 2023",
    doctor: "Dr. Sarah Smith",
    doctorAvatar: "https://i.pravatar.cc/150?img=28",
    hospital: "Cardiology Center",
    fileSize: "0.8 MB",
    fileType: "PDF"
  },
  {
    id: "7",
    title: "Allergy Medication Prescription",
    type: "prescription",
    date: "May 12, 2023",
    doctor: "Dr. Emily Davis",
    doctorAvatar: "https://i.pravatar.cc/150?img=32",
    hospital: "Allergy Clinic",
    fileSize: "0.4 MB",
    fileType: "PDF"
  }
];

const MedicalRecords = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecords, setFilteredRecords] = useState(mockRecords);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "patient") {
      navigate("/doctor-dashboard");
    }
  }, [isAuthenticated, navigate, user]);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = mockRecords.filter(
        record =>
          record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.hospital.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(mockRecords);
    }
  }, [searchQuery]);
  
  if (!isAuthenticated || user?.role !== "patient") {
    return null;
  }
  
  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'test':
        return <TestTube className="h-5 w-5 text-amber-500" />;
      case 'prescription':
        return <FileText className="h-5 w-5 text-emerald-500" />;
      case 'imaging':
        return <FilmIcon className="h-5 w-5 text-blue-500" />;
      case 'report':
        return <FileSpreadsheet className="h-5 w-5 text-violet-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Medical Records</h1>
            <p className="text-muted-foreground">Manage and view your secure medical documents</p>
          </div>
          
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload New Record
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TestTube className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Test Results</p>
                  <p className="text-2xl font-semibold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Prescriptions</p>
                  <p className="text-2xl font-semibold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                  <FilmIcon className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Imaging & Scans</p>
                  <p className="text-2xl font-semibold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search records by title, doctor, or hospital..."
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
            <div className="flex justify-between items-center">
              <CardTitle>Your Records</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Records</TabsTrigger>
                <TabsTrigger value="test">Test Results</TabsTrigger>
                <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
                <TabsTrigger value="imaging">Imaging</TabsTrigger>
                <TabsTrigger value="report">Reports</TabsTrigger>
              </TabsList>
              
              {['all', 'test', 'prescription', 'imaging', 'report'].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="space-y-4 animate-fade-in">
                  {filteredRecords
                    .filter(record => tabValue === 'all' || record.type === tabValue)
                    .length === 0 ? (
                      <div className="text-center py-10">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-1">No records found</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {searchQuery 
                            ? `No records match your search for "${searchQuery}"` 
                            : `You don't have any ${tabValue !== 'all' ? tabValue : ''} records yet`}
                        </p>
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload New Record
                        </Button>
                      </div>
                    ) : (
                      filteredRecords
                        .filter(record => tabValue === 'all' || record.type === tabValue)
                        .map((record) => (
                          <div 
                            key={record.id}
                            className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow flex flex-col md:flex-row md:items-center gap-4"
                          >
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              {getRecordIcon(record.type)}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-medium">{record.title}</h4>
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                                <div className="flex items-center">
                                  <Calendar className="mr-1.5 h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{record.date}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <Avatar className="h-4 w-4 mr-1.5">
                                    <AvatarImage src={record.doctorAvatar} alt={record.doctor} />
                                    <AvatarFallback>{record.doctor.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-muted-foreground">{record.doctor}</span>
                                </div>
                                
                                <div className="flex items-center">
                                  <span className="text-sm text-muted-foreground">{record.hospital}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="mr-1.5 h-4 w-4" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px]">
                                  <DialogHeader>
                                    <DialogTitle>{record.title}</DialogTitle>
                                    <DialogDescription>
                                      {record.doctor} • {record.date} • {record.hospital}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
                                    <Lock className="h-12 w-12 text-muted-foreground mb-3" />
                                    <h3 className="text-lg font-medium">Secure Document Preview</h3>
                                    <p className="text-sm text-muted-foreground text-center mt-2 mb-4">
                                      This is a demo preview. In a real application, the actual document would be displayed here.
                                    </p>
                                    <div className="flex gap-2">
                                      <Button>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button variant="ghost" size="sm">
                                <Download className="mr-1.5 h-4 w-4" />
                                Download
                              </Button>
                            </div>
                            
                            <div className="flex flex-col text-xs text-right text-muted-foreground">
                              <span>{record.fileType}</span>
                              <span>{record.fileSize}</span>
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

export default MedicalRecords;
