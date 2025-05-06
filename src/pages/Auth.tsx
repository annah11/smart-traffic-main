
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Check if there's a tab specified in the location state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // This function will be passed to child components to handle successful auth
  const handleAuthSuccess = (action: "login" | "register") => {
    toast({
      title: action === "login" ? "Login successful" : "Registration successful",
      description: action === "login" 
        ? "Welcome back!" 
        : "Your account has been created. Welcome to Traffic Dashboard!",
      duration: 5000,
    });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Traffic Dashboard</CardTitle>
          <CardDescription>
            {activeTab === "login" 
              ? "Sign in to your account" 
              : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onSuccess={() => handleAuthSuccess("login")} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onSuccess={() => handleAuthSuccess("register")} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Traffic Dashboard. All rights reserved.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
