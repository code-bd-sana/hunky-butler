// Step 3: Booking Confirmation with Payment Options - আপডেট করা ভার্সন
{nextStep === "thirdstep" && (
  <section className="mt-8 w-full max-w-2xl px-6">
    <div className="rounded-2xl bg-[#46434362] bg-gradient-to-b from-[#00000066] to-[#380D1F] backdrop-blur-md backdrop-saturate-15 border border-white/20 shadow-lg">
      <section className="text-white p-6 md:p-12">
        
        {bookingSuccess ? (
          // Success State (একই থাকবে)
          <>
            {/* Success UI একই থাকবে */}
          </>
        ) : (
          // Before booking confirmation - আপডেট করা ভার্সন
          <>
            <h6 className="text-lg font-semibold">Your total price</h6>
            <h6 className="text-4xl md:text-5xl font-bold py-4 md:py-6">
              £{totalPrice}
            </h6>

            {/* Payment Method Selection - আপডেট করা */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-4">Choose Payment Option</label>
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pay_now')}
                  className={`px-6 py-4 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === 'pay_now'
                      ? 'border-[#FF3388] bg-[#FF3388] text-white'
                      : 'border-gray-400 text-gray-400 hover:border-[#FF3388]'
                  }`}
                >
                  <div className="font-semibold">Pay Full Amount Now</div>
                  <div className="text-sm">£{totalPrice} - Secure payment via Stripe</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('deposit')}
                  className={`px-6 py-4 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === 'deposit'
                      ? 'border-[#FF3388] bg-[#FF3388] text-white'
                      : 'border-gray-400 text-gray-400 hover:border-[#FF3388]'
                  }`}
                >
                  <div className="font-semibold">Pay Deposit Only</div>
                  <div className="text-sm">£20 deposit now - Pay remaining £{totalPrice - 20} later</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pay_later')}
                  className={`px-6 py-4 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === 'pay_later'
                      ? 'border-[#FF3388] bg-[#FF3388] text-white'
                      : 'border-gray-400 text-gray-400 hover:border-[#FF3388]'
                  }`}
                >
                  <div className="font-semibold">Pay Later</div>
                  <div className="text-sm">Pay full amount £{totalPrice} at the time of service</div>
                </button>
              </div>
            </div>

            <div className="border-t border-white/20 my-4"></div>

            {/* Booking Summary (একই থাকবে) */}
            <div className="py-4 space-y-4">
              {/* ... একই কোড ... */}
            </div>

            <button
              onClick={handlePayment}
              style={{ color: "rgba(255,0,106,1)" }}
              className="px-[16px] py-[8px] w-[164px] mt-8 md:mt-12 h-[44px] bg-white rounded-full font-semibold transition-transform duration-200 hover:scale-105 whitespace-nowrap disabled:opacity-50"
              disabled={isProcessingPayment || isLoading}
            >
              {isProcessingPayment 
                ? "Processing..." 
                : paymentMethod === 'pay_later' 
                  ? "Book Now" 
                  : paymentMethod === 'deposit'
                    ? "Pay Deposit"
                    : "Pay Now"
              }
            </button>
          </>
        )}
      </section>
    </div>
  </section>
)}