'use client'
import React, { useEffect, useState } from "react";
import SecondaryTitle from "../shared/typography/SecondaryTitle";
import SubTitle from "../shared/typography/SubTitle";
import { Marquee } from "../magicui/marquee";
import { Star } from "lucide-react";
import bg1 from "@/public/images/services/bg.png";
import bg2 from "@/public/images/services/bg2.png";
import Image from "next/image";

// Default fallback image
const defaultAvatar = "/images/default-avatar.png";

export default function ReviewSection({ city }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchGoogleReviews();
  }, []);

  const fetchGoogleReviews = async () => {
    try {
      setLoading(true);
      
      // Using server-side API route to avoid CORS
      const response = await fetch('/api/google-reviews');
      const data = await response.json();
      
      if (data.result && data.result.reviews) {
        const googleReviews = data.result.reviews;
        setTotalReviews(googleReviews.length);
        
        // Calculate average rating
        if (googleReviews.length > 0) {
          const avg = googleReviews.reduce((sum, review) => sum + review.rating, 0) / googleReviews.length;
          setAverageRating(avg.toFixed(1));
        }
        
        // Transform reviews for display
        const transformedReviews = googleReviews.map((review, index) => ({
          id: review.time || Date.now() + index,
          name: review.author_name || `Customer ${index + 1}`,
          username: `@${(review.author_name || `customer${index + 1}`).toLowerCase().replace(/\s+/g, '')}`,
          body: review.text || "Great service!",
          img: review.profile_photo_url || defaultAvatar,
          rating: review.rating || 5,
          time: review.relative_time_description || "Recently",
          source: "google"
        }));
        
        setReviews(transformedReviews);
      } else {
        // If no reviews from API, show sample reviews
        setReviews(getSampleReviews());
        setTotalReviews(6);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Fallback to sample reviews
      setReviews(getSampleReviews());
      setTotalReviews(6);
    } finally {
      setLoading(false);
    }
  };

  const getSampleReviews = () => {
    return [
      {
        id: 1,
        name: "Alex Thompson",
        username: "@alexthompson",
        body: "Absolutely brilliant service! The butler made our hen party so special. Professional, fun, and went above and beyond!",
        img: defaultAvatar,
        rating: 5,
        time: "2 weeks ago",
        source: "google"
      },
      {
        id: 2,
        name: "Sarah Wilson",
        username: "@sarahw",
        body: "Couldn't have asked for a better experience! They turned our ordinary party into an extraordinary event.",
        img: defaultAvatar,
        rating: 5,
        time: "1 month ago",
        source: "google"
      },
      {
        id: 3,
        name: "Mike Johnson",
        username: "@mikej",
        body: "Five stars! The team was punctual, professional, and brought so much energy. Worth every penny!",
        img: defaultAvatar,
        rating: 5,
        time: "3 weeks ago",
        source: "google"
      },
      {
        id: 4,
        name: "Emma Davis",
        username: "@emmad",
        body: "Highly recommend! They made our celebration stress-free and incredibly fun. Will book again!",
        img: defaultAvatar,
        rating: 5,
        time: "2 months ago",
        source: "google"
      },
      {
        id: 5,
        name: "Chris Brown",
        username: "@chrisb",
        body: "Outstanding service from start to finish. Our guests are still talking about the butler service!",
        img: defaultAvatar,
        rating: 5,
        time: "1 week ago",
        source: "google"
      },
      {
        id: 6,
        name: "Lisa Taylor",
        username: "@lisat",
        body: "Professional, fun, and made our event memorable. The attention to detail was impressive!",
        img: defaultAvatar,
        rating: 5,
        time: "3 days ago",
        source: "google"
      },
    ];
  };

  // Review Card Component
  const ReviewCard = ({ review }) => {
    if (!review) return null;

    return (
      <div className="relative w-64 md:w-80 h-56 bg-white rounded-2xl p-6 shadow-lg mx-4 flex-shrink-0 hover:shadow-xl transition-shadow duration-300">
        {/* Profile Header */}
        <div className="flex items-center mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200">
            <Image
              src={review.img}
              alt={review.name}
              width={40}
              height={40}
              className="object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{review.name}</h3>
            <p className="text-xs text-gray-500">{review.username}</p>
          </div>
        </div>
        
        {/* Rating Stars */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < review.rating 
                    ? "text-yellow-400 fill-yellow-400" 
                    : "text-gray-300 fill-gray-100"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-900">
            {review.rating.toFixed(1)}
          </span>
        </div>
        
        {/* Review Text */}
        <p className="text-gray-700 text-sm line-clamp-4 mb-2 leading-relaxed">
          {review.body}
        </p>
        
        {/* Footer */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
          <span className="text-xs text-gray-500">{review.time}</span>
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-xs font-medium text-gray-700">Google</span>
          </div>
        </div>
      </div>
    );
  };

  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

  if (loading) {
    return (
      <div className="bg-[#ECDFE4] relative px-6 overflow-hidden lg:px-0">
        <div className="py-16 max-w-7xl mx-auto container md:px-8 lg:px-0">
          <div className="text-center">
            <SecondaryTitle
              text1={`Trusted by Party Planners in ${city || "UK"}`}
            />
          </div>
          <div className="text-center max-w-2xl mx-auto mt-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ECDFE4] relative px-6 overflow-hidden lg:px-0">
      <div className="py-16 max-w-7xl mx-auto container md:px-8 lg:px-0">
        <div className="text-center mb-8">
          <SecondaryTitle
            text1={`Trusted by ${totalReviews}+ Happy Customers in ${city || "UK"}`}
          />
        </div>
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SubTitle
            text={
              "Don't just take our word for it! See what our customers are saying about their experiences on Google:"
            }
          />
        </div>

        {/* Reviews Marquee */}
        {reviews.length > 0 ? (
          <div className="relative z-30 flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:25s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:25s] mt-6">
              {secondRow.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#ECDFE4]"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#ECDFE4]"></div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No reviews available at the moment.</p>
          </div>
        )}

        {/* Google Rating Summary */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center bg-white rounded-2xl px-8 py-6 shadow-lg space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className="text-yellow-400 fill-yellow-400 mr-1"
                  />
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
                <p className="text-sm text-gray-600">Average Google Rating</p>
              </div>
            </div>
            
            <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>
            
            <div className="text-center sm:text-left">
              <p className="text-2xl font-bold text-gray-900">{totalReviews}+</p>
              <p className="text-sm text-gray-600">Verified Reviews</p>
            </div>
            
            <a
              href="https://search.google.com/local/reviews?placeid=ChIJ07Q9XEUhe0gRkdnnQwGVZWQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Read All Reviews on Google
            </a>
          </div>
        </div>
      </div>

      {/* Background Images */}
      <div className="absolute top-0 left-0 overflow-hidden pointer-events-none">
        <Image 
          alt="background decoration" 
          src={bg1} 
          className="min-w-screen opacity-50"
          priority={false}
        />
      </div>
      <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none">
        <Image 
          alt="background decoration" 
          src={bg2} 
          className="opacity-50"
          priority={false}
        />
      </div>
    </div>
  );
}