export interface IReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface IReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
