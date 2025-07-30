import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, MessageSquare, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  
  // Don't show navigation on home page
  if (location.pathname === "/") {
    return null;
  }
  
  return (
    <Card className="fixed top-4 right-4 z-50 p-2 card-modern glass">
      <div className="flex gap-2">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2 btn-secondary">
            <MessageSquare className="w-4 h-4" />
            Review Form
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};