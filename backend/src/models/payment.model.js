import mongoose from "mongoose"
import User from "./user.model.js"

const paymentSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Booking ID is Required"],
        ref: 'Booking' // Reference to Booking model
    },
    customerEmail: {
        type: String,
        required: [true, "Customer Email is Required"],
        trim: true,
        lowercase: true
    },
    serviceName: {
        type: String,
        required: [true, "Service Name is required"],
        trim: true
    },
    totalAmount: {
        type: String,
        required: [true, "Total Amount is required"]
    },
    // ✅ NEW: Actual amount paid (from Stripe)
    amountPaid: {
        type: Number,
        required: true
    },
    // ✅ NEW: Currency
    currency: {
        type: String,
        default: 'usd',
        uppercase: true
    },
    butler: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    // ✅ NEW: Butler assignment info
    butlerAssignedAt: Date,
    butlerAssignmentStatus: {
        type: String,
        enum: ['pending', 'assigned', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentType: {
        type: String,
        enum: ['card', 'handcash', 'bank_transfer', 'other'],
        required: true
    },
    // ✅ NEW: Payment method details
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'digital_wallet', 'cash', 'bank_transfer'],
        default: 'credit_card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'cancelled'],
        default: 'pending'
    },
    // ✅ NEW: Stripe related fields
    stripeSessionId: {
        type: String,
        sparse: true // Allows null values but ensures uniqueness for non-null
    },
    stripePaymentIntentId: {
        type: String,
        sparse: true
    },
    stripeChargeId: {
        type: String,
        sparse: true
    },
    // ✅ NEW: Receipt information
    receiptUrl: String,
    receiptNumber: String,
    // ✅ NEW: Refund information
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: String,
    refundedAt: Date,
    // ✅ NEW: Payment timeline
    paidAt: {
        type: Date,
        default: Date.now
    },
    paymentConfirmedAt: Date,
    // ✅ NEW: Customer information
    customerName: {
        type: String,
        trim: true
    },
    customerPhone: String,
    // ✅ NEW: Service details

    serviceTime: String,
    serviceDuration: String, // e.g., "3 hours"
    serviceLocation: String,
    numberOfStaff: {
        type: Number,
        default: 1
    },
    // ✅ NEW: Additional charges/discounts
    taxAmount: {
        type: Number,
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    serviceFee: {
        type: Number,
        default: 0
    },
    // ✅ NEW: Payment notes
    notes: String,
    internalNotes: String, // For admin use only
    // ✅ NEW: Status tracking
    isActive: {
        type: Boolean,
        default: true
    },
    adminVerified: {
        type: Boolean,
        default: false
    },
    verificationNotes: String
}, { 
    timestamps: true 
});

// ✅ INDEXES for better performance
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ customerEmail: 1 });
paymentSchema.index({ stripeSessionId: 1 }, { sparse: true });
paymentSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ butlerId: 1 });

// ✅ VIRTUAL for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
    return `$${this.amountPaid} ${this.currency.toUpperCase()}`;
});

// ✅ METHOD to check if refundable
paymentSchema.methods.isRefundable = function() {
    const daysSincePayment = (Date.now() - this.paidAt) / (1000 * 60 * 60 * 24);
    return this.paymentStatus === 'paid' && daysSincePayment <= 30; // 30-day refund policy
};

// ✅ METHOD to get payment summary
paymentSchema.methods.getPaymentSummary = function() {
    return {
        bookingId: this.bookingId,
        customerEmail: this.customerEmail,
        service: this.serviceName,
        amount: this.formattedAmount,
        status: this.paymentStatus,
        paidAt: this.paidAt,
        receipt: this.receiptUrl
    };
};

// ✅ STATIC method to find by stripe session
paymentSchema.statics.findByStripeSession = function(sessionId) {
    return this.findOne({ stripeSessionId: sessionId });
};

// ✅ STATIC method to get payments by status
paymentSchema.statics.findByStatus = function(status) {
    return this.find({ paymentStatus: status });
};

// ✅ Ensure virtual fields are included in JSON output
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

const PaymentHistory = mongoose.model('PaymentHistory', paymentSchema);

export default PaymentHistory;