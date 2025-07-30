import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, BarChart3, MessageSquare, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddReview = () => {
    navigate('/');
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate('/');
    setIsOpen(false);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden hover:bg-orange-50 hover:text-orange-600 transition-colors">
          <Menu className="h-8 w-8" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Bite Buddies</h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <NavLink
                to="/dashboard/analytics"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isActive
                      ? "bg-orange-100 text-orange-700 font-semibold"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
                onClick={handleNavClick}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </NavLink>
              
              <NavLink
                to="/dashboard/reviews"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isActive
                      ? "bg-orange-100 text-orange-700 font-semibold"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
                onClick={handleNavClick}
              >
                <MessageSquare className="w-4 h-4" />
                Reviews
              </NavLink>
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button 
              onClick={handleAddReview}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Review
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 