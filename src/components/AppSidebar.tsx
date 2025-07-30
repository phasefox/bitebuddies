import { NavLink } from "react-router-dom";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { BarChart3, MessageSquare } from "lucide-react";

export const AppSidebar = () => {
  return (
    <Sidebar className="!border-r-0" style={{ borderRight: 'none !important', borderColor: 'transparent !important' }}>
      <SidebarContent className="py-6">
        {/* Bite Buddies Title */}
        <div className="px-6 mt-[-8px] mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Bite Buddies</h2>
        </div>
        
        {/* Navigation Items */}
        <nav className="space-y-2 px-3">
          <NavLink
            to="/dashboard/analytics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-100 text-orange-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`
            }
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </NavLink>
          
          <NavLink
            to="/dashboard/reviews"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-orange-100 text-orange-700 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
              }`
            }
          >
            <MessageSquare className="w-5 h-5" />
            Reviews
          </NavLink>
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};