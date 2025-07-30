import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Download, Upload, Plus, Search, ArrowLeft, MessageSquare, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileNav } from "./MobileNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();

  const handleAddReview = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div
        className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-white"
        style={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        }}
      >
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
                </div>
              </div>
            </div>

            {/* Action Buttons - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <Button 
                onClick={handleAddReview}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Review
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button - Right side */}
            <div className="lg:hidden">
              <MobileNav />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-4 bg-gradient-to-br from-gray-50/50 to-white/50">
            <div className="mx-auto px-3 pt-3">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}