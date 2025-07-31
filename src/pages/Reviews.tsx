import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from "@/components/StarRating";
import { useToast } from "@/hooks/use-toast";
import { supabase, Review } from "@/lib/supabase";
import { Search, Calendar, MessageSquare, ChevronRight, Filter, Plus, Trash2, ChevronLeft, ChevronRight as ChevronRightIcon, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(8);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
        duration: 2000,
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
        duration: 2000,
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error deleting review",
        description: "Failed to delete the review. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
      setDeleteConfirmation("");
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
    <div className="space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-gray-600 mt-1">
            Manage and analyze customer feedback across all restaurants
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
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
        <div className="flex flex-row sm:flex-row gap-2 md:gap-4">
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
        <div className="grid grid-rows-[1fr_auto_auto] min-h-[600px] gap-4 md:gap-6">
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 content-start">
            {currentReviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white border border-gray-200 rounded-lg p-3 lg:p-5 hover:shadow-md transition-shadow duration-200 group cursor-pointer lg:flex lg:flex-col lg:h-full"
                onClick={() => {
                  if (window.innerWidth >= 1024) { // Only on desktop (lg breakpoint)
                    setSelectedReview(review);
                    setDialogOpen(true);
                  }
                }}
              >
                <div className="space-y-4 lg:flex-1 lg:flex lg:flex-col">
                  {/* Header with Restaurant Name and Rating */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-base sm:text-sm lg:text-base text-gray-800 line-clamp-1">
                      {review.restaurant_name}
                    </h3>
                    <div className="flex items-center gap-4 lg:ml-1">
                      <div className="lg:scale-110">
                        <StarRating rating={review.rating} readonly size="sm" />
                      </div>
                      <Badge variant="secondary" className="text-xs lg:text-xs bg-orange-100 text-orange-800">
                        {review.rating}★
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-sm lg:text-sm text-gray-600 lg:line-clamp-3 leading-relaxed lg:flex-1">
                    {review.review_text}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200/50 lg:mt-auto">
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
            <div className="flex items-center justify-center gap-2 lg:gap-4 py-3 lg:py-6">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-xs lg:text-sm"
              >
                <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  if (totalPages <= 3) {
                    // If 3 or fewer pages, show all
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show 3 pages
                    if (currentPage === 1) {
                      pages.push(1, 2, 3);
                    } else if (currentPage === totalPages) {
                      pages.push(totalPages - 2, totalPages - 1, totalPages);
                    } else {
                      pages.push(currentPage - 1, currentPage, currentPage + 1);
                    }
                  }
                  
                  return pages.map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className={
                        currentPage === page
                          ? "bg-orange-500 hover:bg-orange-600 text-white min-w-[32px] lg:min-w-[40px] text-xs lg:text-sm"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50 min-w-[32px] lg:min-w-[40px] text-xs lg:text-sm"
                      }
                    >
                      {page}
                    </Button>
                  ));
                })()}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 text-xs lg:text-sm"
              >
                Next
                <ChevronRightIcon className="w-3 h-3 lg:w-4 lg:h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs lg:text-sm text-gray-500 pt-2 lg:pt-4 border-t border-gray-100">
            <span>
              {filteredReviews.length > 0 
                ? `${startIndex + 1}-${Math.min(endIndex, filteredReviews.length)} of ${filteredReviews.length} reviews`
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
              To confirm deletion, please type the restaurant name: <strong>"{reviewToDelete?.restaurant_name}"</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Type the restaurant name to confirm"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full border-gray-200 focus:border-orange-500 focus:ring-orange-200"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="border-gray-200 text-gray-600 hover:bg-gray-50"
              onClick={() => setDeleteConfirmation("")}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={deleteConfirmation !== reviewToDelete?.restaurant_name}
              className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white border-gray-200 max-w-md mx-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              {selectedReview?.restaurant_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <StarRating rating={selectedReview?.rating || 0} readonly size="md" />
              <Badge variant="secondary" className="text-xs  bg-orange-100 text-orange-800">
                {selectedReview?.rating}★
              </Badge>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {selectedReview?.review_text}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{selectedReview ? formatDate(selectedReview.created_at) : ''}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  if (selectedReview) {
                    handleDeleteReview(selectedReview);
                    setDialogOpen(false);
                  }
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};