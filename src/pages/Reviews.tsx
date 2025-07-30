import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from "@/components/StarRating";
import { useToast } from "@/hooks/use-toast";
import { supabase, Review } from "@/lib/supabase";
import { Search, Calendar, MessageSquare, ChevronRight, Filter, Plus, Trash2, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(8);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
    setCurrentPage(1); // Reset to first page when filters change
  }, [reviews, searchTerm, ratingFilter, timeFilter]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error loading reviews",
        description: "Failed to load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.review_text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      if (timeFilter !== "all") {
        filtered = filtered.filter(review => new Date(review.created_at) >= filterDate);
      }
    }

    setFilteredReviews(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDeleteReview = (review: Review) => {
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewToDelete.id);

      if (error) throw error;

      // Remove from local state
      setReviews(prev => prev.filter(r => r.id !== reviewToDelete.id));
      
      toast({
        title: "Review deleted successfully",
        description: "The review has been permanently removed.",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error deleting review",
        description: "Failed to delete the review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleAddReview = () => {
    navigate('/');
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-gray-600 mt-1">
            Manage and analyze customer feedback across all restaurants
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search restaurants or reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-200 rounded-lg"
          />
        </div>
        
        {/* Rating and Time Filters - Stacked on mobile, side by side on desktop */}
        <div className="flex flex-row sm:flex-row gap-2 lg:gap-4">
          {/* Rating Filter */}
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200 focus:border-gray-200 focus:ring-0 rounded-lg">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">All Ratings</SelectItem>
              <SelectItem value="5" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">5 Stars</SelectItem>
              <SelectItem value="4" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">4 Stars</SelectItem>
              <SelectItem value="3" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">3 Stars</SelectItem>
              <SelectItem value="2" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">2 Stars</SelectItem>
              <SelectItem value="1" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">1 Star</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Time Filter */}
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200 focus:border-gray-200 focus:ring-0 rounded-lg">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">All Time</SelectItem>
              <SelectItem value="week" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">This Week</SelectItem>
              <SelectItem value="month" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">This Month</SelectItem>
              <SelectItem value="3months" className="hover:bg-orange-50 hover:text-orange-600 focus:bg-orange-50 focus:text-orange-600">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16">
          <div className="flex flex-col items-center justify-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No reviews found matching your filters.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-rows-[1fr_auto_auto] min-h-[600px] gap-6">
          {/* Reviews Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
            {currentReviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200 group cursor-pointer">
                <div className="space-y-4">
                  {/* Header with Restaurant Name and Rating */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-gray-800 line-clamp-1">
                      {review.restaurant_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                        {review.rating}★
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {review.review_text}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReview(review);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-6">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={
                      currentPage === page
                        ? "bg-orange-500 hover:bg-orange-600 text-white min-w-[40px] "
                        : "border-gray-200 text-gray-600 hover:bg-gray-50 min-w-[40px]"
                    }
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
            <span>
              {filteredReviews.length > 0 
                ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredReviews.length)} of ${filteredReviews.length} reviews`
                : "No reviews found"
              }
            </span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800">Delete Review</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete this review for "{reviewToDelete?.restaurant_name}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 text-gray-600 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};