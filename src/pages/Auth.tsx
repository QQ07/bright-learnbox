
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Mail, Lock, GithubIcon, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Auth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authValues, setAuthValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/self-space" replace />;
  }

  const handleSubmit = async (e: React.FormEvent, type: 'signin' | 'signup') => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (type === 'signup' && authValues.password !== authValues.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please ensure your passwords match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Success flow
      toast({
        title: type === 'signin' ? "Signed in successfully" : "Account created successfully",
        description: "Welcome to LearnBox",
      });
      
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthValues({
      ...authValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      toast({
        title: `Signed in with ${provider}`,
        description: "Welcome to LearnBox",
      });
      
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-bold text-3xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">LearnBox</h1>
          <p className="text-muted-foreground">A better way to learn and teach</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <Card className="animate-scale-in">
            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit(e, 'signin')}>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Sign in to your LearnBox account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={authValues.email}
                        onChange={handleChange}
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
                        value={authValues.password}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
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
              <form onSubmit={(e) => handleSubmit(e, 'signup')}>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>Sign up for a new LearnBox account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={authValues.email}
                        onChange={handleChange}
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
                        value={authValues.password}
                        onChange={handleChange}
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
                        value={authValues.confirmPassword}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
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
          By continuing, you agree to LearnBox's Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;
