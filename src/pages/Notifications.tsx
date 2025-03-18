
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, CheckCheck, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "appointment" | "message" | "record" | "system";
  read: boolean;
  avatar?: string;
  action?: {
    text: string;
    url: string;
  };
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Upcoming Appointment Reminder",
    message: "You have an appointment with Dr. Sarah Smith tomorrow at 10:00 AM.",
    time: "1 hour ago",
    type: "appointment",
    read: false,
    avatar: "https://i.pravatar.cc/150?img=28",
    action: {
      text: "View Details",
      url: "/patient-appointments"
    }
  },
  {
    id: "2",
    title: "New Message",
    message: "Dr. Michael Johnson sent you a message regarding your recent test results.",
    time: "3 hours ago",
    type: "message",
    read: false,
    avatar: "https://i.pravatar.cc/150?img=53",
    action: {
      text: "Read Message",
      url: "/messages"
    }
  },
  {
    id: "3",
    title: "Medical Record Updated",
    message: "Your blood test results have been added to your medical records.",
    time: "Yesterday",
    type: "record",
    read: true,
    action: {
      text: "View Record",
      url: "/medical-records"
    }
  },
  {
    id: "4",
    title: "Appointment Confirmed",
    message: "Your appointment with Dr. Emily Davis has been confirmed for June 24 at 2:30 PM.",
    time: "2 days ago",
    type: "appointment",
    read: true,
    avatar: "https://i.pravatar.cc/150?img=32",
    action: {
      text: "View Details",
      url: "/patient-appointments"
    }
  },
  {
    id: "5",
    title: "System Maintenance",
    message: "The HealthNest platform will be undergoing maintenance on June 15 from 2:00 AM to 4:00 AM. Some services may be temporarily unavailable.",
    time: "3 days ago",
    type: "system",
    read: true
  }
];

const NotificationsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-5 w-5 text-primary" />;
      case 'message':
        return <Bell className="h-5 w-5 text-emerald-500" />;
      case 'record':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with important information</p>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Recent Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! There are no notifications to display.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all",
                      notification.read ? "bg-card" : "bg-primary/5 border-primary/20"
                    )}
                  >
                    <div className="flex gap-4">
                      {notification.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback>{notification.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className={cn(
                            "font-medium",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1 mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          {notification.action && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={notification.action.url}>
                                {notification.action.text}
                              </a>
                            </Button>
                          )}
                          
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NotificationsPage;
