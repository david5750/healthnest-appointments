
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, PaperclipIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock conversations for both patients and doctors
const mockPatientConversations = [
  {
    id: "1",
    with: {
      id: "d1",
      name: "Dr. Sarah Smith",
      avatar: "https://i.pravatar.cc/150?img=28",
      role: "doctor",
      specialty: "Cardiologist"
    },
    lastMessage: {
      text: "Your test results look good. Let's discuss them in our next appointment.",
      time: "10:30 AM",
      date: "Today",
      isRead: true,
      sender: "d1"
    }
  },
  {
    id: "2",
    with: {
      id: "d2",
      name: "Dr. Michael Johnson",
      avatar: "https://i.pravatar.cc/150?img=53",
      role: "doctor",
      specialty: "Neurologist"
    },
    lastMessage: {
      text: "Remember to take your medication as prescribed. See you next week.",
      time: "Yesterday",
      date: "Yesterday",
      isRead: true,
      sender: "d2"
    }
  },
  {
    id: "3",
    with: {
      id: "d3",
      name: "Dr. Emily Davis",
      avatar: "https://i.pravatar.cc/150?img=32",
      role: "doctor",
      specialty: "Dermatologist"
    },
    lastMessage: {
      text: "How is the new treatment working for you? Any side effects?",
      time: "Monday",
      date: "Monday",
      isRead: false,
      sender: "d3"
    }
  }
];

const mockDoctorConversations = [
  {
    id: "1",
    with: {
      id: "p1",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "patient"
    },
    lastMessage: {
      text: "Thank you for the advice, doctor. I'll follow your recommendations.",
      time: "11:45 AM",
      date: "Today",
      isRead: true,
      sender: "p1"
    }
  },
  {
    id: "2",
    with: {
      id: "p2",
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=5",
      role: "patient"
    },
    lastMessage: {
      text: "I've been experiencing some dizziness since starting the new medication.",
      time: "Yesterday",
      date: "Yesterday",
      isRead: true,
      sender: "p2"
    }
  },
  {
    id: "3",
    with: {
      id: "p3",
      name: "Robert Brown",
      avatar: "https://i.pravatar.cc/150?img=70",
      role: "patient"
    },
    lastMessage: {
      text: "Dr. Johnson, I need to reschedule my appointment for next week.",
      time: "Monday",
      date: "Monday",
      isRead: false,
      sender: "p3"
    }
  }
];

// Mock messages for the selected conversation
const mockMessages = [
  {
    id: "m1",
    sender: {
      id: "d1",
      name: "Dr. Sarah Smith",
      avatar: "https://i.pravatar.cc/150?img=28",
      role: "doctor"
    },
    text: "Hello! How have you been feeling since our last appointment?",
    time: "10:15 AM",
    date: "Today"
  },
  {
    id: "m2",
    sender: {
      id: "p1",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "patient"
    },
    text: "Much better, doctor. The new medication seems to be working well.",
    time: "10:18 AM",
    date: "Today"
  },
  {
    id: "m3",
    sender: {
      id: "d1",
      name: "Dr. Sarah Smith",
      avatar: "https://i.pravatar.cc/150?img=28",
      role: "doctor"
    },
    text: "That's excellent news! Any side effects at all?",
    time: "10:20 AM",
    date: "Today"
  },
  {
    id: "m4",
    sender: {
      id: "p1",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "patient"
    },
    text: "Just a bit of drowsiness in the mornings, but it's manageable.",
    time: "10:22 AM",
    date: "Today"
  },
  {
    id: "m5",
    sender: {
      id: "d1",
      name: "Dr. Sarah Smith",
      avatar: "https://i.pravatar.cc/150?img=28",
      role: "doctor"
    },
    text: "That's a common side effect and should diminish over time. I've reviewed your recent test results and everything looks good.",
    time: "10:25 AM",
    date: "Today"
  },
  {
    id: "m6",
    sender: {
      id: "d1",
      name: "Dr. Sarah Smith",
      avatar: "https://i.pravatar.cc/150?img=28",
      role: "doctor"
    },
    text: "Your test results look good. Let's discuss them in our next appointment.",
    time: "10:30 AM",
    date: "Today"
  }
];

const MessagesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  // Select the appropriate conversations based on user role
  const conversations = user?.role === "patient" ? mockPatientConversations : mockDoctorConversations;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    // Set the first conversation as active by default
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0].id);
    }
  }, [isAuthenticated, navigate, activeConversation, conversations]);

  if (!isAuthenticated) {
    return null;
  }

  const activeConversationData = conversations.find(c => c.id === activeConversation);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row">
          {/* Conversation list */}
          <div className="w-full md:w-80 border-r">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                      activeConversation === conversation.id ? "bg-primary/10" : "hover:bg-muted"
                    )}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={conversation.with.avatar} alt={conversation.with.name} />
                      <AvatarFallback>{conversation.with.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.with.name}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conversation.lastMessage.date}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.text}
                        </p>
                        {!conversation.lastMessage.isRead && conversation.lastMessage.sender !== user?.id && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0"></span>
                        )}
                      </div>
                      
                      {user?.role === "doctor" && (
                        <p className="text-xs text-muted-foreground mt-1">Patient</p>
                      )}
                      {user?.role === "patient" && conversation.with.specialty && (
                        <p className="text-xs text-muted-foreground mt-1">{conversation.with.specialty}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Active conversation */}
          {activeConversationData ? (
            <div className="flex-1 flex flex-col h-[calc(100vh-5rem)]">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeConversationData.with.avatar} alt={activeConversationData.with.name} />
                    <AvatarFallback>{activeConversationData.with.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{activeConversationData.with.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {user?.role === "doctor" ? "Patient" : activeConversationData.with.specialty}
                    </p>
                  </div>
                </div>
                <div>
                  <Button variant="outline" size="sm">View Profile</Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map((message) => (
                    <div 
                      key={message.id} 
                      className={cn(
                        "flex gap-3 max-w-[80%]",
                        message.sender.id === user?.id ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                        <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className={cn(
                          "p-3 rounded-lg",
                          message.sender.id === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}>
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Button type="button" variant="ghost" size="icon">
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;
