
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BadgeCheck, CalendarClock, ShieldCheck, Stethoscope } from "lucide-react";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-sky-50 to-white py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-[0.03]"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
                  Healthcare
                </span>{" "}
                reimagined for the modern world
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experience seamless doctor appointments, AI symptom checks, and secure medical records all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 text-base font-medium rounded-full">
                  <Link to={isAuthenticated ? (user?.role === "patient" ? "/patient-dashboard" : "/doctor-dashboard") : "/register"}>
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-medium rounded-full">
                  <Link to="/features">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Simplifying Healthcare Access</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive platform connects patients with healthcare providers through innovative digital solutions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl border border-border bg-white hover:shadow-soft transition-all duration-300 animate-scale-in">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Specialists</h3>
                <p className="text-muted-foreground">
                  Connect with qualified healthcare professionals specialized in your needs.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl border border-border bg-white hover:shadow-soft transition-all duration-300 animate-scale-in delay-100">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CalendarClock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
                <p className="text-muted-foreground">
                  Book appointments with just a few clicks and manage your healthcare calendar.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl border border-border bg-white hover:shadow-soft transition-all duration-300 animate-scale-in delay-200">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BadgeCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Symptom Check</h3>
                <p className="text-muted-foreground">
                  Get preliminary insights about your symptoms using our intelligent AI system.
                </p>
              </div>
              
              <div className="p-6 rounded-2xl border border-border bg-white hover:shadow-soft transition-all duration-300 animate-scale-in delay-300">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Records</h3>
                <p className="text-muted-foreground">
                  Access and manage your medical history in a secure, encrypted environment.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">Ready to experience better healthcare?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of patients and healthcare providers already using HealthNest.
              </p>
              
              <Button asChild size="lg" className="h-12 px-8 text-base font-medium rounded-full">
                <Link to="/register">
                  Create Your Free Account
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
