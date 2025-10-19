import mongoose from "mongoose"
import User from "./user.model.js"

const paymentSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Booking ID is Required"],
        ref: 'Booking'
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
        type: Number,
        required: [true, "Total Amount is required"]
    },
    // ✅ UPDATED: Payment type (full/deposit)
    paymentType: {
        type: String,
        enum: ['full', 'deposit'],
        default: 'full'
    },
    // ✅ UPDATED: Deposit specific fields
    depositAmount: {
        type: Number,
        default: 0
    },
    amountDue: {
        type: Number,
        default: 0
    },
    amountPaid: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd',
        uppercase: true
    },
  butler: [
  {
    id: { type: mongoose.Schema.Types.ObjectId, ref: User },
    accepted: { type: Boolean, default: false },
  },
],
    butlerAssignedAt: Date,
    butlerAssignmentStatus: {
        type: String,
        enum: ['pending', 'assigned', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentMethodType: {
        type: String,
        enum: ['card', 'handcash', 'bank_transfer', 'other'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'digital_wallet', 'cash', 'bank_transfer'],
        default: 'credit_card'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'cancelled', 'deposit_paid'],
        default: 'pending'
    },
    stripeSessionId: {
        type: String,
        sparse: true
    },
    stripePaymentIntentId: {
        type: String,
        sparse: true
    },
    paid:String,
    stripeChargeId: {
        type: String,
        sparse: true
    },
    receiptUrl: String,
    receiptNumber: String,
    refundAmount: {
        type: Number,
        default: 0
    },
    refundReason: String,
    refundedAt: Date,
    paidAt: {
        type: Date,
        default: Date.now
    },
    paymentConfirmedAt: Date,
    customerName: {
        type: String,
        trim: true
    },
    customerPhone: String,
    serviceTime: String,
    serviceDuration: String,
    serviceLocation: String,
    numberOfStaff: {
        type: Number,
        default: 1
    },
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
    notes: String,
    internalNotes: String,
    isActive: {
        type: Boolean,
        default: true
    },
    adminVerified: {
        type: Boolean,
        default: false
    },
    verificationNotes: String,
    // ✅ NEW: Deposit payment link for remaining balance
    balancePaymentLink: String,
    balancePaymentSessionId: String
}, { 
    timestamps: true 
});






const PaymentHistory = mongoose.model('PaymentHistory', paymentSchema);

export default PaymentHistory;
