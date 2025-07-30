import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = "md" 
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
    xl: "w-12 h-12 md:w-16 md:h-16",
    "2xl": "w-16 h-16 md:w-20 md:h-20"
  };

  const handleMouseEnter = (star: number) => {
    if (!readonly) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex justify-center ${size === "sm" ? "gap-1" : "gap-3"}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            "transition-all duration-200",
            star <= (hoverRating || rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200",
            !readonly && "cursor-pointer hover:scale-110"
          )}
          onClick={() => !readonly && onRatingChange?.(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};