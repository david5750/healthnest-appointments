
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Edit2, KeyRound, LogOut, Shield, User } from "lucide-react";

// Form validation schemas
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

// Type for the form values
type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const SettingsPage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  // Initialize form with default values
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    // Update form when user data is available
    if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        phone: "",
      });
    }
  }, [isAuthenticated, navigate, user, profileForm]);

  if (!isAuthenticated) {
    return null;
  }

  const onProfileSubmit = (data: ProfileFormValues) => {
    setIsPending(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Profile updated:", data);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsPending(false);
    }, 1000);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    setIsPending(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Password updated:", data);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
      setIsPending(false);
    }, 1000);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your account preferences and settings</p>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full mb-6 grid grid-cols-3 lg:w-auto">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your email" {...field} />
                                </FormControl>
                                <FormDescription>
                                  This email will be used for notifications and communications.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {user?.role === "doctor" && (
                            <div className="space-y-4">
                              <div>
                                <Label>Specialty</Label>
                                <Input placeholder="Your medical specialty" defaultValue="Cardiologist" />
                              </div>
                              <div>
                                <Label>License Number</Label>
                                <Input placeholder="Your medical license number" defaultValue="MD12345678" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <Button type="submit" disabled={isPending}>
                          {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                      Manage how others see you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <div className="relative mb-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Change avatar</span>
                      </Button>
                    </div>
                    <div className="text-center mb-6">
                      <h3 className="font-medium text-lg">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Change Photo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Password must be at least 8 characters long.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit" disabled={isPending}>
                          {isPending ? "Updating..." : "Update Password"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Text Message (SMS)</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive verification code via SMS
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Authenticator App</Label>
                        <p className="text-sm text-muted-foreground">
                          Use an authenticator app for two-factor authentication
                        </p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive verification code via email
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>
                      Manage what notifications you receive via email
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Appointment Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications before upcoming appointments
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>New Messages</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you receive new messages
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    {user?.role === "patient" && (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Prescription Refills</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive alerts when it's time to refill your prescriptions
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    )}

                    {user?.role === "doctor" && (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>New Patient Assignments</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when a new patient is assigned to you
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive news and updates about the platform
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                    <CardDescription>
                      Manage your account settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                    
                    <div>
                      <Button variant="outline" className="w-full">
                        Export Your Data
                      </Button>
                    </div>
                    
                    <div>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        This action is permanent and cannot be undone. All your data will be deleted.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
