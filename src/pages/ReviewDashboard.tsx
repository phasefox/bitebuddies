import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from "@/components/StarRating";
import { useToast } from "@/hooks/use-toast";
import { mockSupabase, Review } from "@/lib/mockSupabase";
import { Navigation } from "@/components/Navigation";
import { FileDown, Search, Calendar, Star, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";


export const ReviewDashboard = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, ratingFilter, timeFilter]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await mockSupabase
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRatingStats = () => {
    const totalReviews = filteredReviews.length;
    const averageRating = totalReviews > 0 
      ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    const fiveStarCount = filteredReviews.filter(r => r.rating === 5).length;
    
    return { totalReviews, averageRating, fiveStarCount };
  };

  const stats = getRatingStats();

  const generatePDFReport = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality will be implemented with a backend service.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <Navigation />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Review Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and analyze customer feedback for your content creation services
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <StarRating rating={Math.round(stats.averageRating)} readonly size="sm" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">5-Star Reviews</CardTitle>
              <Star className="h-4 w-4 text-star-filled fill-current" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.fiveStarCount}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalReviews > 0 ? `${((stats.fiveStarCount / stats.totalReviews) * 100).toFixed(1)}%` : '0%'} of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Export */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <CardTitle>All Reviews</CardTitle>
                <CardDescription>Filter and manage customer reviews</CardDescription>
              </div>
              <Button onClick={generatePDFReport} variant="outline" className="shrink-0">
                <FileDown className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search restaurants or reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No reviews found matching your filters.</p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <Card key={review.id} className="shadow-review hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{review.restaurant_name}</h3>
                            <StarRating rating={review.rating} readonly />
                            <Badge variant="secondary" className="ml-auto sm:ml-0">
                              {review.rating} star{review.rating !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground leading-relaxed mb-3">
                            {review.review_text}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDate(review.created_at)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};