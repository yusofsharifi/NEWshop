import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, User, Flag, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  images?: string[];
  pros?: string[];
  cons?: string[];
  userVoted?: 'helpful' | 'not_helpful' | null;
}

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const { language, dir } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    pros: '',
    cons: ''
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  // Mock data
  useEffect(() => {
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'احمد محمدی',
        rating: 5,
        title: 'عالی و کیفیت بالا',
        comment: 'این پمپ واقعاً فوق‌العاده است. ک��فیت ساخت بسیار بالا و کارکرد عالی. تا الان هیچ مشکلی نداشته و استخر ما کاملاً تمیز نگه داشته.',
        date: '2024-01-10',
        verified: true,
        helpful: 15,
        notHelpful: 2,
        pros: ['کیفیت عالی', 'کارکرد بی‌نقص', 'مصرف انرژی کم'],
        cons: ['قیمت نسبتاً بالا']
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'سارا کریمی',
        rating: 4,
        title: 'خوب اما قابل بهبود',
        comment: 'محصول خوبی است ولی نصب آن کمی سخت بود. پس از نصب به خوبی کار می‌کند. کیفیت آب بهتر شده.',
        date: '2024-01-05',
        verified: true,
        helpful: 8,
        notHelpful: 1,
        pros: ['عملکرد خوب', 'بهبود کیفیت آب'],
        cons: ['نصب سخت', 'دفترچه راهنما کامل نیست']
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'علی رضایی',
        rating: 3,
        title: 'متوسط',
        comment: 'کیفیت قابل قبول اما انتظار بیشتری داشتم. صدای کارکرد کمی زیاد است.',
        date: '2023-12-28',
        verified: false,
        helpful: 3,
        notHelpful: 4,
        pros: ['قیمت مناسب'],
        cons: ['صدای زیاد', 'کیفیت متوسط']
      }
    ];

    const mockSummary: ReviewSummary = {
      totalReviews: mockReviews.length,
      averageRating: mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length,
      ratingDistribution: {
        5: mockReviews.filter(r => r.rating === 5).length,
        4: mockReviews.filter(r => r.rating === 4).length,
        3: mockReviews.filter(r => r.rating === 3).length,
        2: mockReviews.filter(r => r.rating === 2).length,
        1: mockReviews.filter(r => r.rating === 1).length,
      }
    };

    setReviews(mockReviews);
    setReviewSummary(mockSummary);
  }, [productId]);

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !newReview.rating || !newReview.comment.trim()) {
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: user!.id.toString(),
      userName: user!.username,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpful: 0,
      notHelpful: 0,
      pros: newReview.pros ? newReview.pros.split(',').map(s => s.trim()).filter(Boolean) : [],
      cons: newReview.cons ? newReview.cons.split(',').map(s => s.trim()).filter(Boolean) : []
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 0, title: '', comment: '', pros: '', cons: '' });
    setIsWritingReview(false);

    // Update summary
    if (reviewSummary) {
      const newTotal = reviewSummary.totalReviews + 1;
      const newAverage = ((reviewSummary.averageRating * reviewSummary.totalReviews) + newReview.rating) / newTotal;
      
      setReviewSummary({
        totalReviews: newTotal,
        averageRating: newAverage,
        ratingDistribution: {
          ...reviewSummary.ratingDistribution,
          [newReview.rating]: reviewSummary.ratingDistribution[newReview.rating] + 1
        }
      });
    }
  };

  const handleVoteReview = (reviewId: string, voteType: 'helpful' | 'not_helpful') => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const isCurrentVote = review.userVoted === voteType;
        const wasOppositeVote = review.userVoted && review.userVoted !== voteType;
        
        return {
          ...review,
          helpful: voteType === 'helpful' 
            ? (isCurrentVote ? review.helpful - 1 : review.helpful + 1 + (wasOppositeVote ? -1 : 0))
            : (wasOppositeVote ? review.helpful - 1 : review.helpful),
          notHelpful: voteType === 'not_helpful' 
            ? (isCurrentVote ? review.notHelpful - 1 : review.notHelpful + 1 + (wasOppositeVote ? -1 : 0))
            : (wasOppositeVote ? review.notHelpful - 1 : review.notHelpful),
          userVoted: isCurrentVote ? null : voteType
        };
      }
      return review;
    }));
  };

  const sortedAndFilteredReviews = reviews
    .filter(review => filterBy === 'all' || review.rating.toString() === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest': return b.rating - a.rating;
        case 'lowest': return a.rating - b.rating;
        case 'helpful': return b.helpful - a.helpful;
        default: return 0;
      }
    });

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false, onRate?: (rating: number) => void) => {
    const starSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`${starSize} ${
                star <= rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'fa' ? 'fa-IR' : 'en-US').format(date);
  };

  if (!reviewSummary) return null;

  return (
    <div className="space-y-6" dir={dir}>
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>{language === 'fa' ? 'نظرات کاربران' : 'Customer Reviews'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {reviewSummary.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(reviewSummary.averageRating), 'lg')}
              <p className="text-sm text-gray-600 mt-2">
                {language === 'fa' 
                  ? `بر اساس ${reviewSummary.totalReviews} نظر`
                  : `Based on ${reviewSummary.totalReviews} reviews`
                }
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Progress 
                    value={(reviewSummary.ratingDistribution[rating] / reviewSummary.totalReviews) * 100} 
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-gray-600 w-8">
                    {reviewSummary.ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Button */}
          <div className="mt-6 text-center">
            {isAuthenticated ? (
              <Dialog open={isWritingReview} onOpenChange={setIsWritingReview}>
                <DialogTrigger asChild>
                  <Button>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {language === 'fa' ? 'نوشتن نظر' : 'Write a Review'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {language === 'fa' ? 'نظر خود را بنویسید' : 'Write Your Review'}
                    </DialogTitle>
                    <DialogDescription>
                      {language === 'fa' 
                        ? 'تجربه خود از استفاده از این محصول را با دیگران به اشتراک بگذارید'
                        : 'Share your experience with this product to help other customers'
                      }
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Rating */}
                    <div>
                      <Label>{language === 'fa' ? 'امتیاز شما' : 'Your Rating'} *</Label>
                      <div className="mt-2">
                        {renderStars(newReview.rating, 'lg', true, (rating) => 
                          setNewReview(prev => ({ ...prev, rating }))
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <Label htmlFor="review-title">
                        {language === 'fa' ? 'عنوان نظر' : 'Review Title'}
                      </Label>
                      <input
                        id="review-title"
                        type="text"
                        value={newReview.title}
                        onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                        placeholder={language === 'fa' ? 'خلاصه‌ای از نظر شما' : 'Summarize your review'}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Comment */}
                    <div>
                      <Label htmlFor="review-comment">
                        {language === 'fa' ? 'نظر شما' : 'Your Review'} *
                      </Label>
                      <Textarea
                        id="review-comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder={language === 'fa' 
                          ? 'تجربه خود را در مورد این محصول بنویسید...'
                          : 'Share your experience with this product...'
                        }
                        className="mt-1 min-h-[120px]"
                      />
                    </div>

                    {/* Pros */}
                    <div>
                      <Label htmlFor="review-pros">
                        {language === 'fa' ? 'نکات مثبت' : 'Pros'} ({language === 'fa' ? 'اختیاری' : 'Optional'})
                      </Label>
                      <input
                        id="review-pros"
                        type="text"
                        value={newReview.pros}
                        onChange={(e) => setNewReview(prev => ({ ...prev, pros: e.target.value }))}
                        placeholder={language === 'fa' ? 'کیفیت عالی، آسان نصب (با کامه جدا کنید)' : 'Great quality, easy installation (separate with commas)'}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Cons */}
                    <div>
                      <Label htmlFor="review-cons">
                        {language === 'fa' ? 'نکات منفی' : 'Cons'} ({language === 'fa' ? 'اختیاری' : 'Optional'})
                      </Label>
                      <input
                        id="review-cons"
                        type="text"
                        value={newReview.cons}
                        onChange={(e) => setNewReview(prev => ({ ...prev, cons: e.target.value }))}
                        placeholder={language === 'fa' ? 'قیمت بالا، صدای زیاد (با کامه جدا کنید)' : 'Expensive, noisy (separate with commas)'}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        onClick={handleSubmitReview}
                        disabled={!newReview.rating || !newReview.comment.trim()}
                        className="flex-1"
                      >
                        {language === 'fa' ? 'ثبت نظر' : 'Submit Review'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsWritingReview(false)}
                      >
                        {language === 'fa' ? 'انصراف' : 'Cancel'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <p className="text-gray-600">
                {language === 'fa' 
                  ? 'برای نوشتن نظر ابتدا وارد شوید'
                  : 'Please sign in to write a review'
                }
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={filterBy} onValueChange={(value) => setFilterBy(value as any)}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">
                  {language === 'fa' ? 'همه' : 'All'} ({reviewSummary.totalReviews})
                </TabsTrigger>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <TabsTrigger key={rating} value={rating.toString()}>
                    {rating} ⭐ ({reviewSummary.ratingDistribution[rating]})
                  </TabsTrigger>
                ))}
              </TabsList>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">{language === 'fa' ? 'جدیدترین' : 'Newest'}</option>
                <option value="oldest">{language === 'fa' ? 'قدیمی‌ترین' : 'Oldest'}</option>
                <option value="highest">{language === 'fa' ? 'بالاترین امتیاز' : 'Highest Rating'}</option>
                <option value="lowest">{language === 'fa' ? 'پایین‌ترین امتیاز' : 'Lowest Rating'}</option>
                <option value="helpful">{language === 'fa' ? 'مفیدترین' : 'Most Helpful'}</option>
              </select>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <AnimatePresence>
          {sortedAndFilteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Review Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>
                            {review.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.userName}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                {language === 'fa' ? 'خرید تایید شده' : 'Verified Purchase'}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {renderStars(review.rating, 'sm')}
                            <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Review Content */}
                    <div>
                      {review.title && (
                        <h4 className="font-medium text-lg mb-2">{review.title}</h4>
                      )}
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>

                    {/* Pros and Cons */}
                    {(review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {review.pros && review.pros.length > 0 && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h5 className="font-medium text-green-800 mb-2">
                              {language === 'fa' ? 'نکات مثبت:' : 'Pros:'}
                            </h5>
                            <ul className="text-sm text-green-700 space-y-1">
                              {review.pros.map((pro, index) => (
                                <li key={index}>• {pro}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.cons && review.cons.length > 0 && (
                          <div className="bg-red-50 p-3 rounded-lg">
                            <h5 className="font-medium text-red-800 mb-2">
                              {language === 'fa' ? 'نکات منفی:' : 'Cons:'}
                            </h5>
                            <ul className="text-sm text-red-700 space-y-1">
                              {review.cons.map((con, index) => (
                                <li key={index}>• {con}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex space-x-2">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                          />
                        ))}
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleVoteReview(review.id, 'helpful')}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            review.userVoted === 'helpful'
                              ? 'text-green-600'
                              : 'text-gray-600 hover:text-green-600'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{language === 'fa' ? 'مفید' : 'Helpful'} ({review.helpful})</span>
                        </button>
                        <button
                          onClick={() => handleVoteReview(review.id, 'not_helpful')}
                          className={`flex items-center space-x-1 text-sm transition-colors ${
                            review.userVoted === 'not_helpful'
                              ? 'text-red-600'
                              : 'text-gray-600 hover:text-red-600'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>{language === 'fa' ? 'غیرمفید' : 'Not Helpful'} ({review.notHelpful})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedAndFilteredReviews.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {language === 'fa' ? 'هیچ نظری یافت نشد' : 'No reviews found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
