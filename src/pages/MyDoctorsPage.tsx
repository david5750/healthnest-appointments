
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Star } from "lucide-react";

// Mock doctors data
const mockDoctors = [
  {
    id: "1",
    name: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    avatar: "https://i.pravatar.cc/150?img=28",
    rating: 4.9,
    education: "Harvard Medical School",
    experience: "15 years",
    about: "Specialist in cardiovascular diseases with a focus on preventive cardiology."
  },
  {
    id: "2",
    name: "Dr. Michael Johnson",
    specialty: "Neurologist",
    avatar: "https://i.pravatar.cc/150?img=53",
    rating: 4.7,
    education: "Johns Hopkins University",
    experience: "12 years",
    about: "Expert in neurological disorders and brain health, with a special interest in stroke recovery."
  },
  {
    id: "3",
    name: "Dr. Emily Davis",
    specialty: "Dermatologist",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 4.8,
    education: "Stanford Medical School",
    experience: "8 years",
    about: "Specialized in skin conditions and cosmetic dermatology with a holistic approach to skin health."
  },
  {
    id: "4",
    name: "Dr. Robert Wilson",
    specialty: "Orthopedic Surgeon",
    avatar: "https://i.pravatar.cc/150?img=65",
    rating: 4.6,
    education: "Mayo Clinic School of Medicine",
    experience: "20 years",
    about: "Focused on joint replacement and sports injuries with minimally invasive surgical techniques."
  }
];

const MyDoctorsPage = () => {
  const { isAuthenticated, user } = useAuth();
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
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Doctors</h1>
          <p className="text-muted-foreground mb-8">
            Your healthcare providers and specialists
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search doctors..." 
                className="pl-10"
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Doctor
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockDoctors.map(doctor => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <Avatar className="h-16 w-16 border-2 border-background">
                        <AvatarImage src={doctor.avatar} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl mb-1">{doctor.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          {doctor.specialty}
                          <span className="mx-2">•</span>
                          <span className="flex items-center text-amber-500">
                            {doctor.rating} 
                            <Star className="h-3 w-3 ml-1 fill-current" />
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Education</h4>
                      <p className="text-sm text-muted-foreground">{doctor.education}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Experience</h4>
                      <p className="text-sm text-muted-foreground">{doctor.experience}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">About</h4>
                      <p className="text-sm text-muted-foreground">{doctor.about}</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button className="flex-1" variant="default">Schedule Appointment</Button>
                      <Button className="flex-1" variant="outline">Send Message</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyDoctorsPage;
