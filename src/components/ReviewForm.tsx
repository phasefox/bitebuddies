import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { sendReviewEmail } from "@/lib/emailService";
import { Navigation } from "@/components/Navigation";
import { Loader2, Send, AlertCircle, CheckCircle } from "lucide-react";

export const ReviewForm = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  // Character limits
  const RESTAURANT_NAME_LIMIT = 100;
  const REVIEW_TEXT_LIMIT = 500;

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Restaurant name validation
    if (!restaurantName.trim()) {
      newErrors.restaurantName = "Restaurant name is required";
    } else if (restaurantName.trim().length < 2) {
      newErrors.restaurantName = "Restaurant name must be at least 2 characters";
    } else if (restaurantName.trim().length > RESTAURANT_NAME_LIMIT) {
      newErrors.restaurantName = `Restaurant name must be ${RESTAURANT_NAME_LIMIT} characters or less`;
    }

    // Review text validation
    if (!reviewText.trim()) {
      newErrors.reviewText = "Review text is required";
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = "Review must be at least 10 characters";
    } else if (reviewText.trim().length > REVIEW_TEXT_LIMIT) {
      newErrors.reviewText = `Review must be ${REVIEW_TEXT_LIMIT} characters or less`;
    }

    // Rating validation
    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Please check the form and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            restaurant_name: restaurantName.trim(),
            review_text: reviewText.trim(),
            rating: rating,
          }
        ]);

      if (error) throw error;

      // Send email notification
      const emailData = {
        restaurant_name: restaurantName.trim(),
        review_text: reviewText.trim(),
        rating: rating,
        created_at: new Date().toISOString()
      };

      const emailResult = await sendReviewEmail(emailData);
      
      if (!emailResult.success) {
        console.warn('Email notification failed:', emailResult.error);
      }

      toast({
        title: "Review submitted successfully!",
        description: "Thank you for your feedback. We've received your review and sent a notification.",
      });

      // Reset form
      setRestaurantName("");
      setReviewText("");
      setRating(0);
      setErrors({});

    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestaurantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRestaurantName(value);
    
    // Clear error when user starts typing
    if (errors.restaurantName) {
      setErrors(prev => ({ ...prev, restaurantName: "" }));
    }
  };

  const handleReviewTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setReviewText(value);
    
    // Clear error when user starts typing
    if (errors.reviewText) {
      setErrors(prev => ({ ...prev, reviewText: "" }));
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    
    // Clear error when user selects rating
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 800\'%3E%3Cdefs%3E%3CradialGradient id=\'a\' cx=\'50%25\' cy=\'50%25\' r=\'50%25\'%3E%3Cstop offset=\'0%25\' stop-color=\'%23FF6B35\'/%3E%3Cstop offset=\'50%25\' stop-color=\'%23FFD93D\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23FF8E53\'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23a)\'/%3E%3C/svg%3E")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
    >
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      <Navigation />
      
      {/* White Card Container */}
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <CardContent className="px-6 py-12">
          <div className="text-center space-y-12">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800">
              Rate Our Content
            </h1>

            {/* Logo - Much Bigger */}
            <div className="w-48 h-48 mx-auto flex items-center justify-center shadow-2xl rounded-full overflow-hidden">
              <img 
                src="/logo.jpg" 
                alt="Bite Buddies Logo" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Star Rating - Slightly Smaller */}
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <StarRating 
                  rating={rating} 
                  onRatingChange={handleRatingChange}
                  size="xl"
                />
              </div>
              {errors.rating && (
                <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.rating}
                </div>
              )}
            </div>

            {/* Input Fields Container */}
            <div className="space-y-6 max-w-md mx-auto">
              {/* Restaurant Name Input */}
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter Restaurant Name"
                  value={restaurantName}
                  onChange={handleRestaurantNameChange}
                  className={`h-16 border-2 rounded-lg px-4 focus:outline-none focus:ring-0 placeholder:text-gray-500 text-base md:text-lg ${
                    errors.restaurantName 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-gray-300'
                  }`}
                  style={{ 
                    outline: 'none', 
                    boxShadow: 'none',
                    
                    lineHeight: '1.5'
                  }}
                />
                {errors.restaurantName && (
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.restaurantName}</span>
                  </div>
                )}
              </div>

              {/* Review Text Input */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Enter your review (minimum 10 characters)"
                  value={reviewText}
                  onChange={handleReviewTextChange}
                  rows={4}
                  className={`h-24 border-2 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-0 placeholder:text-gray-500 text-base md:text-lg ${
                    errors.reviewText 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-gray-300'
                  }`}
                  style={{ 
                    outline: 'none', 
                    boxShadow: 'none',
                    
                    lineHeight: '1.5'
                  }}
                />
                {errors.reviewText && (
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.reviewText}</span>
                  </div>
                )}
              </div>

              {/* Submit Button - Outside Input Fields */}
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  className="bg-orange-500 text-lg hover:bg-orange-600 text-white font-semibold px-6 py-6 rounded-lg text-base md:text-lg"
                  style={{ fontSize: '18px' }}
                  disabled={isSubmitting || rating === 0 || !restaurantName.trim() || !reviewText.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};