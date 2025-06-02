
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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
            Join the Community
          </h2>
          <p className="mt-2 text-text-secondary">
            Create your stepping journey account
          </p>
        </div>

        <Card className="bg-surface-card border-border-default">
          <CardHeader>
            <CardTitle className="text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    First Name
                  </label>
                  <Input placeholder="First name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Last Name
                  </label>
                  <Input placeholder="Last name" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Select>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chicago">Chicago, IL</SelectItem>
                      <SelectItem value="atlanta">Atlanta, GA</SelectItem>
                      <SelectItem value="detroit">Detroit, MI</SelectItem>
                      <SelectItem value="houston">Houston, TX</SelectItem>
                      <SelectItem value="dallas">Dallas, TX</SelectItem>
                      <SelectItem value="memphis">Memphis, TN</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="Create a password"
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

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="h-4 w-4 text-brand-primary border-border-input rounded mt-1" />
              <span className="ml-2 text-sm text-text-secondary">
                I agree to the{' '}
                <Link to="/terms" className="text-brand-primary hover:text-brand-primary-hover">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-brand-primary hover:text-brand-primary-hover">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <Button className="w-full bg-brand-primary hover:bg-brand-primary-hover">
              Create Account
            </Button>

            <div className="text-center">
              <span className="text-text-secondary">Already have an account? </span>
              <Link to="/auth/login" className="text-brand-primary hover:text-brand-primary-hover font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
