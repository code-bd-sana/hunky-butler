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
    butler: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
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

// ✅ INDEXES
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ customerEmail: 1 });
paymentSchema.index({ stripeSessionId: 1 }, { sparse: true });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ paymentType: 1 });
paymentSchema.index({ createdAt: -1 });

// ✅ VIRTUAL for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
    return `$${this.amountPaid} ${this.currency.toUpperCase()}`;
});

// ✅ VIRTUAL for deposit status
paymentSchema.virtual('isDepositPayment').get(function() {
    return this.paymentType === 'deposit';
});

// ✅ VIRTUAL for payment completion status
paymentSchema.virtual('isFullyPaid').get(function() {
    return this.paymentStatus === 'paid' || this.amountDue === 0;
});

// ✅ METHOD to check if refundable
paymentSchema.methods.isRefundable = function() {
    const daysSincePayment = (Date.now() - this.paidAt) / (1000 * 60 * 60 * 24);
    return (this.paymentStatus === 'paid' || this.paymentStatus === 'deposit_paid') && daysSincePayment <= 30;
};

// ✅ METHOD to get payment summary
paymentSchema.methods.getPaymentSummary = function() {
    return {
        bookingId: this.bookingId,
        customerEmail: this.customerEmail,
        service: this.serviceName,
        totalAmount: this.totalAmount,
        amountPaid: this.amountPaid,
        amountDue: this.amountDue,
        paymentType: this.paymentType,
        status: this.paymentStatus,
        paidAt: this.paidAt,
        receipt: this.receiptUrl,
        isDeposit: this.isDepositPayment,
        isFullyPaid: this.isFullyPaid
    };
};

// ✅ METHOD to create balance payment session
paymentSchema.methods.createBalancePaymentSession = async function(successUrl, cancelUrl) {
    if (this.isFullyPaid) {
        throw new Error('Payment is already fully paid');
    }
    
    if (this.paymentType !== 'deposit') {
        throw new Error('Balance payment only available for deposit payments');
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${this.serviceName} Service - Balance Payment`,
                        description: `Remaining balance for ${this.serviceName} service`,
                    },
                    unit_amount: Math.round(this.amountDue * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
            bookingId: this.bookingId.toString(),
            customerEmail: this.customerEmail,
            serviceName: this.serviceName,
            paymentType: 'balance',
            originalPaymentId: this._id.toString()
        },
        customer_email: this.customerEmail,
    });

    this.balancePaymentSessionId = session.id;
    this.balancePaymentLink = session.url;
    await this.save();

    return session;
};

// ✅ STATIC method to find by stripe session
paymentSchema.statics.findByStripeSession = function(sessionId) {
    return this.findOne({ 
        $or: [
            { stripeSessionId: sessionId },
            { balancePaymentSessionId: sessionId }
        ]
    });
};

// ✅ STATIC method to get payments by status
paymentSchema.statics.findByStatus = function(status) {
    return this.find({ paymentStatus: status });
};

// ✅ STATIC method to get deposit payments with balance due
paymentSchema.statics.findDepositsWithBalance = function() {
    return this.find({ 
        paymentType: 'deposit', 
        amountDue: { $gt: 0 },
        paymentStatus: 'deposit_paid'
    });
};

paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

const PaymentHistory = mongoose.model('PaymentHistory', paymentSchema);

export default PaymentHistory;