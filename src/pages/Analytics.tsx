import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { supabase, Review } from "@/lib/supabase";
import { Star, MessageSquare, TrendingUp, Calendar, BarChart3, Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Analytics = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

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
    } finally {
      setIsLoading(false);
    }
  };

  const getAnalytics = () => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    const fiveStarCount = reviews.filter(r => r.rating === 5).length;
    const fourStarCount = reviews.filter(r => r.rating === 4).length;
    const threeStarCount = reviews.filter(r => r.rating === 3).length;
    const twoStarCount = reviews.filter(r => r.rating === 2).length;
    const oneStarCount = reviews.filter(r => r.rating === 1).length;
    
    // Get recent reviews (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentReviews = reviews.filter(r => new Date(r.created_at) >= sevenDaysAgo);
    
    // Get unique restaurants
    const uniqueRestaurants = new Set(reviews.map(r => r.restaurant_name)).size;
    
    return { 
      totalReviews, 
      averageRating, 
      fiveStarCount, 
      fourStarCount, 
      threeStarCount, 
      twoStarCount, 
      oneStarCount,
      recentReviews: recentReviews.length,
      uniqueRestaurants
    };
  };

  const stats = getAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Analytics Overview</h1>
        <p className="text-gray-600 mt-1">
          Insights and performance metrics for your review system
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6">
            <CardTitle className="text-sm lg:text-base font-medium text-gray-600">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pr-3 pl-3 pb-3 lg:p-6 lg:pt-0">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{stats.totalReviews.toLocaleString()}</div>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">All time reviews</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6">
            <CardTitle className="text-sm lg:text-base font-medium text-gray-600">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pr-3 pl-3 pb-3 lg:p-6 lg:pt-0">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Out of 5 stars</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6">
            <CardTitle className="text-sm lg:text-base font-medium text-gray-600">Recent Reviews</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pr-3 pl-3 pb-3 lg:p-6 lg:pt-0">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{stats.recentReviews}</div>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 lg:p-6">
            <CardTitle className="text-sm lg:text-base font-medium text-gray-600">Restaurants</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pr-3 pl-3 pb-3 lg:p-6 lg:pt-0">
            <div className="text-2xl lg:text-3xl font-bold text-gray-800">{stats.uniqueRestaurants}</div>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Unique locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Rating Distribution */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="p-3 lg:p-6">
            <CardTitle className="text-lg lg:text-xl text-gray-800">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3 lg:p-6 lg:pt-0">
            {[
              { stars: 5, count: stats.fiveStarCount },
              { stars: 4, count: stats.fourStarCount },
              { stars: 3, count: stats.threeStarCount },
              { stars: 2, count: stats.twoStarCount },
              { stars: 1, count: stats.oneStarCount }
            ].map((rating) => {
              const percentage = stats.totalReviews > 0 ? (rating.count / stats.totalReviews) * 100 : 0;
              return (
                <div key={rating.stars} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarRating rating={rating.stars} readonly size="sm" />
                      <span className="text-xs text-gray-600">{rating.count} reviews</span>
                    </div>
                    <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-yellow-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border-gray-200 mb-10 lg:mb-0">
          <CardHeader className="p-3 lg:p-6">
            <CardTitle className="text-lg lg:text-xl text-gray-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-3 lg:p-6 lg:pt-0">
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-800 truncate">{review.restaurant_name}</span>
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">{review.review_text}</p>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};