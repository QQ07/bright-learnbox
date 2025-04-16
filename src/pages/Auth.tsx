
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Mail, Lock, Globe, GithubIcon, Phone, Calendar, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { api, SignupData } from '@/services/api';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Auth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'learner' | 'mentor'>('learner');
  const [loginValues, setLoginValues] = useState({
    email: '',
    password: '',
  });
  const [signupValues, setSignupValues] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: format(new Date(), 'yyyy-MM-dd'),
    gender: 'Other',
    phone: '',
    role: 'LEARNER',
  });
  const [date, setDate] = useState<Date>(new Date());
  
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/self-space" replace />;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.auth.login(role, {
        email: loginValues.email,
        password: loginValues.password,
      });

      toast({
        title: "Signed in successfully",
        description: "Welcome to Learnspace",
      });
      
      setIsAuthenticated(true);
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (signupValues.password !== signupValues.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please ensure your passwords match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Remove the confirmPassword field before sending the request
      const { confirmPassword, ...signupData } = signupValues;
      
      await api.auth.signup(role, signupData);

      toast({
        title: "Account created successfully",
        description: "Welcome to Learnspace",
      });
      
      setIsAuthenticated(true);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your details and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginValues({
      ...loginValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupValues({
      ...signupValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setSignupValues({
        ...signupValues,
        dob: format(selectedDate, 'yyyy-MM-dd'),
      });
    }
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      toast({
        title: `Signed in with ${provider}`,
        description: "Welcome to Learnspace",
      });
      
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleRoleChange = (selectedRole: 'learner' | 'mentor') => {
    setRole(selectedRole);
    setSignupValues({
      ...signupValues,
      role: selectedRole === 'learner' ? 'LEARNER' : 'MENTOR'
    });
  };

  const handleGenderChange = (selectedGender: string) => {
    setSignupValues({
      ...signupValues,
      gender: selectedGender
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-bold text-3xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Learnspace</h1>
          <p className="text-muted-foreground">A better way to learn and teach</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <Card className="animate-scale-in">
            <TabsContent value="signin">
              <form onSubmit={handleLoginSubmit}>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Sign in to your Learnspace account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={loginValues.email}
                        onChange={handleLoginChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={loginValues.password}
                        onChange={handleLoginChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Select value={role} onValueChange={(value) => setRole(value as 'learner' | 'mentor')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="learner">Learner</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                  
                  <div className="relative my-4">
                    <Separator className="absolute inset-0 m-auto" />
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSocialAuth('Google')}
                      disabled={isLoading}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSocialAuth('GitHub')}
                      disabled={isLoading}
                    >
                      <GithubIcon className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </CardContent>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignupSubmit}>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>Sign up for a new Learnspace account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={signupValues.name}
                        onChange={handleSignupChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={signupValues.email}
                        onChange={handleSignupChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={signupValues.phone}
                        onChange={handleSignupChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full pl-3 text-left font-normal flex justify-between"
                        >
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </div>
                          <Calendar className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          initialFocus
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Select value={signupValues.gender} onValueChange={handleGenderChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={signupValues.password}
                        onChange={handleSignupChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={signupValues.confirmPassword}
                        onChange={handleSignupChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Select value={role} onValueChange={(value) => handleRoleChange(value as 'learner' | 'mentor')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="learner">Learner</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                  
                  <div className="relative my-4">
                    <Separator className="absolute inset-0 m-auto" />
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSocialAuth('Google')}
                      disabled={isLoading}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => handleSocialAuth('GitHub')}
                      disabled={isLoading}
                    >
                      <GithubIcon className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </CardContent>
              </form>
            </TabsContent>
          </Card>
        </Tabs>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          By continuing, you agree to Learnspace's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
