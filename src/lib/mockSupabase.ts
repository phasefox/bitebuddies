// Mock Supabase client for development - replace with real Supabase integration
export interface Review {
  id: string;
  restaurant_name: string;
  review_text: string;
  rating: number;
  created_at: string;
}

// Empty reviews array - connect to Supabase for real data
let reviews: Review[] = [];

export const mockSupabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      order: (column: string, options: any) => Promise.resolve({ data: reviews, error: null }),
    }),
    insert: (data: any[]) => {
      const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        restaurant_name: data[0].restaurant_name,
        review_text: data[0].review_text,
        rating: data[0].rating,
        created_at: new Date().toISOString(),
      };
      reviews.unshift(newReview);
      return Promise.resolve({ data: [newReview], error: null });
    },
  }),
};