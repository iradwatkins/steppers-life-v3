
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen bg-background-main flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
              <span className="text-text-on-primary font-bold">SL</span>
            </div>
            <span className="font-serif font-semibold text-2xl text-text-primary">SteppersLife</span>
          </Link>
          <h2 className="font-serif text-3xl font-bold text-text-primary">
            Welcome Back
          </h2>
          <p className="mt-2 text-text-secondary">
            Sign in to your stepping community account
          </p>
        </div>

        <Card className="bg-surface-card border-border-default">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-brand-primary border-border-input rounded" />
                <span className="ml-2 text-sm text-text-secondary">Remember me</span>
              </label>
              <Link to="/auth/forgot-password" className="text-sm text-brand-primary hover:text-brand-primary-hover">
                Forgot password?
              </Link>
            </div>

            <Button className="w-full bg-brand-primary hover:bg-brand-primary-hover">
              Sign In
            </Button>

            <div className="text-center">
              <span className="text-text-secondary">Don't have an account? </span>
              <Link to="/auth/register" className="text-brand-primary hover:text-brand-primary-hover font-medium">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
