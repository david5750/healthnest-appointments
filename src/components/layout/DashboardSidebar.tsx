
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Bell, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  ClipboardList, 
  FileText, 
  HeartPulse, 
  Home, 
  LogOut,
  MessageSquare, 
  Settings, 
  User, 
  Users,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface SidebarLink {
  icon: React.ElementType;
  label: string;
  href: string;
}

const patientLinks: SidebarLink[] = [
  { icon: Home, label: "Dashboard", href: "/patient-dashboard" },
  { icon: Calendar, label: "Appointments", href: "/patient-appointments" },
  { icon: User, label: "My Doctors", href: "/my-doctors" },
  { icon: Brain, label: "Symptom Checker", href: "/symptom-checker" },
  { icon: FileText, label: "Medical Records", href: "/medical-records" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const doctorLinks: SidebarLink[] = [
  { icon: Home, label: "Dashboard", href: "/doctor-dashboard" },
  { icon: Calendar, label: "Appointments", href: "/doctor-appointments" },
  { icon: Users, label: "My Patients", href: "/my-patients" },
  { icon: ClipboardList, label: "Schedule", href: "/schedule" },
  { icon: HeartPulse, label: "Patient Records", href: "/patient-records" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  
  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  // Determine which links to show based on user role
  const links = user?.role === "patient" ? patientLinks : doctorLinks;

  return (
    <aside
      className={cn(
        "min-h-screen h-full flex flex-col border-r bg-background transition-all duration-300 ease-in-out sticky top-0 left-0",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      <div 
        className="absolute -right-3 top-24 bg-primary text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-primary/90 transition-colors z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </div>
      
      <div className="flex items-center justify-center p-6">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">H</span>
            </div>
            <span className="font-semibold text-lg">HealthNest</span>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">H</span>
          </div>
        )}
      </div>
      
      {user && (
        <div className={cn(
          "flex items-center gap-3 mx-4 p-3 mb-6 rounded-lg transition-all",
          !collapsed ? "justify-start" : "justify-center"
        )}>
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
            </div>
          )}
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    !collapsed ? "justify-start" : "justify-center"
                  )
                }
              >
                <link.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto mb-4 px-4">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full flex items-center rounded-lg p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
            !collapsed ? "justify-start" : "justify-center"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </Button>
        
        <div className={cn(
          "bg-muted/50 rounded-xl p-4 flex gap-3 transition-all mt-4",
          collapsed && "flex-col items-center"
        )}>
          {!collapsed ? (
            <>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <HeartPulse className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium">Need help?</p>
                <p className="text-xs text-muted-foreground">Contact support</p>
              </div>
            </>
          ) : (
            <HeartPulse className="h-5 w-5 text-primary" />
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
