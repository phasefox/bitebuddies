import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

export const AdminAuth = ({ onAuthSuccess }: AdminAuthProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple password check - in production, this should be server-side
    if (password === import.meta.env.VITE_PASSWORD) {
      localStorage.setItem("adminAuthenticated", "true");
      onAuthSuccess();
    } else {
      setError("Incorrect password. Please try again.");
    }

    setIsLoading(false);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Admin Access</CardTitle>
          <p className="text-gray-600 mt-2">
            Enter the admin password to access the dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? "Authenticating..." : "Access Dashboard"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={handleBackToHome}
              >
                Back to Home
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 