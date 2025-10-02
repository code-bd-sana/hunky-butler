'use client'
import { useSubmitReviewMutation } from "@/features/booking";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { useParams, useSearchParams } from "next/navigation";

export default function ReviewSubmit() {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ""
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [submitReview, {isLoading, error}] = useSubmitReviewMutation();

  // Use hooks to get params and searchParams
  const params = useParams();
  const searchParams = useSearchParams();

  // Get email from params and butlerId from searchParams
  const encodedEmail = params?.email;
  const butlerId = searchParams?.get('id');

  // Decode the email from URL format
  const reviewerEmail = encodedEmail ? decodeURIComponent(encodedEmail) : null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setReviewData(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handler = async (e) => {
    try {
      e.preventDefault();
      
      // Prepare the final data object
      const submitData = {
        butler: butlerId,
        reviewerEmail: reviewerEmail,
        rating: reviewData.rating,
        comment: reviewData.comment
      };
      
      await submitReview(submitData).unwrap();
      toast.success("Review submitted successfully, Thank You!");

      console.log("Review Data:", submitData);

    } catch (error) {
      console.log(error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  // Star rating component
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoverRating || reviewData.rating);

      return (
        <button
          key={starValue}
          type="button"
          className={`p-1 transition-colors duration-200 ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => handleRatingClick(starValue)}
          onMouseEnter={() => handleRatingHover(starValue)}
          onMouseLeave={handleRatingLeave}
        >
          <FaStar className="w-8 h-8" />
        </button>
      );
    });
  };

  return (
    <div className="mx-auto p-4 mt-28 max-w-2xl">
      <Toaster/>
      <form onSubmit={handler}>
        {/* Rating Section */}
        <section className="bg-white p-6 rounded-3xl shadow-sm">
          <div className="w-full">
            <label className="font-medium text-[#424242] block mb-4">
              Rate your experience *
            </label>
            <div className="flex items-center gap-2">
              {renderStars()}
              <span className="ml-4 text-[#424242]">
                {reviewData.rating > 0 ? `${reviewData.rating} out of 5` : "Click to rate"}
              </span>
            </div>
            {reviewData.rating === 0 && (
              <p className="text-red-500 text-sm mt-2">Rating is required</p>
            )}
          </div>
        </section>

        {/* Comment Section */}
        <section className="bg-white mt-6 p-6 rounded-3xl shadow-sm">
          <div className="w-full">
            <label
              htmlFor="comment"
              className="font-medium text-[#424242]"
            >
              Your Review *
            </label>
            <textarea
              name="comment"
              id="comment"
              value={reviewData.comment}
              onChange={handleInputChange}
              placeholder="Share your experience with this butler..."
              className="border-[#e5e5e5] border rounded-md outline-none px-4 w-full mt-1 py-3 min-h-[150px] transition-colors duration-300 resize-none"
              required
            />
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-white mt-6 p-6 rounded-3xl shadow-sm">
          <h4 className="font-medium text-[#424242] mb-4">Review Information</h4>
          <div className="space-y-2 text-sm text-[#666]">
            {/* <p><span className="font-medium">Butler ID:</span> {butlerId || "Not specified"}</p> */}
            <p><span className="font-medium">Your Email:</span> {reviewerEmail || "Not specified"}</p>
          </div>
        </section>

        {/* Submit Button */}
        <div className="mt-6 flex">
          <button
            type="submit"
            disabled={reviewData.rating === 0 || !reviewData.comment.trim() || isLoading}
            className={`${
              reviewData.rating === 0 || !reviewData.comment.trim() || isLoading
                ? 'bg-[#FF006A]  hover:bg-[#e5005e] cursor-not-allowed' 
                : 'bg-[#FF006A] cursor-pointer hover:bg-[#e5005e]'
            } text-white px-6 py-3 rounded-full font-medium transition-colors duration-300 flex items-center gap-2`}
          >
            <FaStar className="w-5 h-5" />
            <span>
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}