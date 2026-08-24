"use client";
import React, { useEffect, useState } from "react";
import SecondaryTitle from "../shared/typography/SecondaryTitle";
import ReviewLinks from "./ReviewLinks";
import SubTitle from "../shared/typography/SubTitle";
import { Marquee } from "../magicui/marquee";
import { Star } from "lucide-react";
import bg1 from "@/public/images/services/bg.png";
import bg2 from "@/public/images/services/bg2.png";
import Image from "next/image";

// Default fallback image
const defaultAvatar = "/images/default-avatar.png";

/**
 * initialData is supplied by server components via lib/googleReviews.js, so
 * the reviews are present in the first HTML rather than appearing after
 * hydration. Pages that cannot fetch server-side (the client-rendered location
 * routes) pass nothing and the original client fetch runs as before.
 */
export default function ReviewSection({ city, initialData = null }) {
  const [reviews, setReviews] = useState(initialData?.reviews || []);
  const [loading, setLoading] = useState(!initialData);
  const [averageRating, setAverageRating] = useState(initialData?.averageRating || 0);
  const [totalReviews, setTotalReviews] = useState(initialData?.totalReviews || 0);
  const [placeInfo, setPlaceInfo] = useState(
    initialData?.placeInfo || {
      name: "",
      address: "",
      totalRatings: 0,
    }
  );

  useEffect(() => {
    // Server already supplied the data, so no client round-trip is needed.
    if (initialData) return;
    fetchGoogleReviews();
  }, [initialData]);

  const fetchGoogleReviews = async () => {
    try {
      setLoading(true);

      // Fetch from our server-side API route
      const response = await fetch("/api/google-reviews");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();


      if (data.status === "OK" && data.result) {
        const placeData = data.result;

        // Set place information
        setPlaceInfo({
          name: placeData.name || "Hunky Butler Service",
          address: placeData.formatted_address || "Liverpool, UK",
          totalRatings: placeData.user_ratings_total || 0,
        });

        // Set average rating
        if (placeData.rating) {
          setAverageRating(parseFloat(placeData.rating.toFixed(1)));
        }

        // Set total reviews count
        if (placeData.user_ratings_total) {
          setTotalReviews(placeData.user_ratings_total);
        }

        // Transform and set reviews
        if (placeData.reviews && placeData.reviews.length > 0) {

          const transformedReviews = placeData.reviews.map((review, index) => ({
            id: review.time || `review-${Date.now()}-${index}`,
            name: review.author_name || `Customer ${index + 1}`,
            username: `@${(review.author_name || `customer${index + 1}`)
              .toLowerCase()
              .replace(/\s+/g, "")
              .replace(/[^a-z0-9_]/g, "")
              .substring(0, 15)}`,
            body: review.text || "Great service!",
            img: review.profile_photo_url || defaultAvatar,
            rating: review.rating || 5,
            time: review.relative_time_description || "Recently",
            source: "google",
            originalTime: review.time,
          }));

          // Sort reviews by time (newest first)
          transformedReviews.sort((a, b) => {
            if (a.originalTime && b.originalTime) {
              return b.originalTime - a.originalTime;
            }
            return 0;
          });

          setReviews(transformedReviews);
        } else {
          // If no reviews found, show empty state
          setReviews([]);
        }
      } else {
        console.error("Google API Error:", data.status, data.error_message);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching Google reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Format review text to handle newlines and long text
  const formatReviewText = (text) => {
    if (!text) return "Great service!";

    // Remove excessive newlines and limit length
    const cleanedText = text.replace(/\n+/g, " ").trim();

    // If text is too long, truncate it
    if (cleanedText.length > 200) {
      return cleanedText.substring(0, 200) + "...";
    }

    return cleanedText;
  };

  // Safe image URL function
  const getSafeImageUrl = (url) => {
    if (!url || url === defaultAvatar) return defaultAvatar;

    // Check if URL is from allowed domains
    const allowedDomains = [
      "lh3.googleusercontent.com",
      "lh4.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh6.googleusercontent.com",
      "googleusercontent.com",
    ];

    try {
      const urlObj = new URL(url);
      const isAllowed = allowedDomains.some((domain) =>
        urlObj.hostname.includes(domain)
      );

      return isAllowed ? url : defaultAvatar;
    } catch {
      return defaultAvatar;
    }
  };

  // Review Card Component
  const ReviewCard = ({ review }) => {
    if (!review) return null;

    const safeImageUrl = getSafeImageUrl(review.img);

    return (
      <div className="relative w-64 md:w-80 h-64 bg-white rounded-2xl p-6 shadow-lg mx-4 flex-shrink-0 hover:shadow-xl transition-shadow duration-300">
        {/* Profile Header */}
        <div className="flex items-center mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200">
            <Image
              src={safeImageUrl}
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
            <h3 className="font-semibold text-gray-900 text-sm">
              {review.name}
            </h3>
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
          {formatReviewText(review.body)}
        </p>

        {/* Footer */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
          <span className="text-xs text-gray-500">{review.time}</span>
          <div className="flex items-center space-x-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-xs font-medium text-gray-700">Google</span>
          </div>
        </div>
      </div>
    );
  };

  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

  // With no reviews to show, render nothing rather than a heading promising
  // testimonials above an empty carousel. This happens whenever the Places
  // call fails, which it currently does site-wide: the single Google API key
  // is referrer-restricted, and a referrer-restricted key cannot be used for
  // the server-side Places Details request. Splitting the key into a browser
  // key and a server key is the actual fix.
  // With no inline reviews to show, fall back to the review profile links
  // rather than rendering nothing. The proof is real (4.9 on Trustpilot, 5.0
  // on Google) even when the Places API will not return the review text.
  if (!loading && reviews.length === 0) {
    return <ReviewLinks standalone />;
  }

  if (loading) {
    return (
      <div className="bg-[#ECDFE4] relative px-6 overflow-hidden lg:px-0">
        <div className="py-16 max-w-7xl mx-auto container md:px-8 lg:px-0">
          <div className="text-center">
            <SecondaryTitle
              text1={`Trusted by Thousands of Party Planners in UK`}
            />
          </div>
          <div className="text-center max-w-2xl mx-auto mt-4">
            <SubTitle
              text={
                "Don't just take our word for it! See what our customers are saying about their experiences on Google:"
              }
            />
          </div>

          {/* Loading skeleton for reviews */}
          <div className="mt-12">
            <div className="relative z-30 flex w-full flex-col items-center justify-center overflow-hidden">
              <div className="flex animate-pulse [--duration:25s]">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-64 md:w-80 h-56 bg-white/50 rounded-2xl p-6 mx-4 flex-shrink-0"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                        <div className="h-2 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>
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
          {/* <SecondaryTitle
            text1={`Trusted by ${
              totalReviews > 0 ? totalReviews + "+" : ""
            } Happy Customers in ${city || "Liverpool"}`}
          /> */}
          <SecondaryTitle
            text1={`Trusted by Thousands of Party Planners in UK`}
          />
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <SubTitle
            text={
              "Don't just take our word for it! See what our customers are saying about their experiences on Google:"
            }
          />

          {/* Place Information */}
          {/* <div className="mt-4 inline-flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg px-4 py-2">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Hunky Butler Service
            </span>
            <span className="text-xs text-gray-500 ml-2">• Liverpool</span>
          </div> */}
        </div>

        {/* Reviews Marquee */}
        {reviews.length > 0 ? (
          <div className="relative z-30 flex w-full flex-col items-center justify-center overflow-hidden">
            {firstRow.length > 0 && (
              <Marquee pauseOnHover className="[--duration:25s]">
                {firstRow.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </Marquee>
            )}

            {secondRow.length > 0 && (
              <Marquee reverse pauseOnHover className="[--duration:25s] mt-6">
                {secondRow.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </Marquee>
            )}

            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#ECDFE4]"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#ECDFE4]"></div>

            {/* Read the full set on either profile, or leave one. */}
            <div className="relative z-40 w-full">
              <ReviewLinks />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center justify-center bg-white rounded-2xl px-8 py-12 shadow-lg max-w-md mx-auto">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Reviews Available
              </h3>
              <p className="text-gray-600 mb-4">
                We're working on fetching your Google reviews.
              </p>
              <button
                onClick={fetchGoogleReviews}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Google Rating Summary */}
        {reviews.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center bg-white rounded-2xl px-8 py-6 shadow-lg space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className={`${
                        i < Math.floor(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-100"
                      } mr-1`}
                    />
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-3xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Average Google Rating</p>
                </div>
              </div>

              <div className="h-12 w-px bg-gray-200 hidden sm:block"></div>

              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-gray-900">
                  {totalReviews}
                </p>
                <p className="text-sm text-gray-600">Verified Reviews</p>
              </div>

              <a
                href={`https://search.google.com/local/reviews?placeid=ChIJ07Q9XEUhe0gRkdnnQwGVZWQ`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#FF006A] text-white rounded-lg font-medium  transition-colors shadow-md hover:shadow-lg"
              >
                Read All Reviews on Google
              </a>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchGoogleReviews}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium hover:bg-white/50 rounded-lg transition-colors flex items-center mx-auto"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Reviews
          </button>
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
