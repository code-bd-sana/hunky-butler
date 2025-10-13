import stripePackage from 'stripe';


import nodemailer from 'nodemailer';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import { storeNotification } from '../utils/utils.js';
import PaymentHistory from '../models/payment.model.js';
import mongoose from 'mongoose';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "bannah76769@gmail.com",
    pass: "noqq kzxv olzf clzz",
  },
});

// Create Stripe Checkout Session
// controllers/paymentController.js - এটা update করুন

export const createCheckoutSessionExistngBooking = async (req, res) => {
  try {
    const { id, successUrl, cancelUrl } = req.body;






    const savedBooking = await Booking.findOne({_id:id});
    console.log(savedBooking, "ami tomar saved booking")


    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${savedBooking.serviceName} Service Booking`,
              description: `Butler service for ${savedBooking.durationHours} hours with ${savedBooking.numberOfStaff} staff members`,
            },
            unit_amount: Math.round(savedBooking.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId: savedBooking._id.toString(),
        customerEmail: savedBooking.email,
        firstName: savedBooking?.firstName,
        lastName: save?.lastName,
        serviceName: savedBooking.serviceName,
        totalAmount: savedBooking.price.toString()
      },
      customer_email: savedBooking.email,
    });



    // Send response with both sessionId and url
    res.status(200).json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url, // This is important for manual redirect
      bookingId: savedBooking._id,
      message: 'Checkout session created successfully'
    });

    // ... rest of your email sending code

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
};










export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingData, successUrl, cancelUrl,  } = req.body;

    console.log('Creating checkout session for:', bookingData);

    // Validate required fields
    if (!bookingData || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingData, successUrl, cancelUrl'
      });
    }

    // Create booking first with pending status
    const newBooking = new Booking({
      ...bookingData,
      paid: 'pending',
      paymentMethod: 'pay_now',
      paymentStatus: 'pending',
      createdAt: new Date()
    });

    const savedBooking = await newBooking.save();
    console.log('Booking created with ID:', savedBooking._id);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${bookingData.serviceName} Service Booking`,
              description: `Butler service for ${bookingData.durationHours} hours with ${bookingData.numberOfStaff} staff members`,
            },
            unit_amount: Math.round(bookingData.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId: savedBooking._id.toString(),
        customerEmail: bookingData.email,
        firstName: bookingData.firstName,
        lastName: bookingData?.lastName,
        serviceName: bookingData.serviceName,
        totalAmount: bookingData.price.toString()
      },
      customer_email: bookingData.email,
    });

    console.log('Stripe session created:', session.id);

    // Send response with both sessionId and url
    res.status(200).json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url, // This is important for manual redirect
      bookingId: savedBooking._id,
      message: 'Checkout session created successfully'
    });

    // ... rest of your email sending code

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
};

// Handle Stripe Webhook
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  await storeNotification('alll', "webhook triger", "khnplra")
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret_here'
    );

   
    
    console.log('Webhook received:', event.type);

  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleSuccessfulPayment(event.data.object);
        break;
        
      case 'checkout.session.expired':
        await handleExpiredSession(event.data.object);
        break;
        
      case 'checkout.session.async_payment_failed':
        await handleFailedPayment(event.data.object);
        break;
        
      case 'checkout.session.async_payment_succeeded':
        await handleSuccessfulPayment(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true, handled: true, data:event.data.object });
    
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ 
      received: true, 
      handled: false, 
      error: error.message 
    });
  }
};

// Handle successful payment
const handleSuccessfulPayment = async (session) => {
  try {
    const bookingId = session.metadata.bookingId;
    const customerEmail = session.metadata.customerEmail;
    const serviceName = session.metadata.serviceName;
    const totalAmount = session.metadata.totalAmount;
    const firstName = session.metadata.firstName;
    const lastName = session.metadata.lastName;
    const phone = session.metadata.phone;
    const dateOfEvent = session.metadata.dateOfEvent;
    const startTime = session.metadata.startTime;
    const durationHours = session.metadata.durationHours;
    const durationMinutes = session.metadata.durationMinutes;
    const location = session.metadata.location;
    const numberOfStaff = session.metadata.numberOfStaff;

    // ✅ Get receipt information from payment intent
    let receiptUrl = null;
    let receiptNumber = null;
    let stripeChargeId = null;

    if (session.payment_intent) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
          expand: ['charges.data']
        });

        // Get receipt information from the first charge
        if (paymentIntent.charges?.data?.length > 0) {
          const charge = paymentIntent.charges.data[0];
          receiptUrl = charge.receipt_url;
          receiptNumber = charge.receipt_number;
          stripeChargeId = charge.id;
          
          console.log('📄 Receipt Information:', {
            receiptUrl: receiptUrl,
            receiptNumber: receiptNumber,
            chargeId: stripeChargeId
          });
        }
      } catch (error) {
        console.log('Could not retrieve receipt details:', error.message);
      }
    }

    await storeNotification(bookingId, customerEmail, serviceName, totalAmount);

    // ✅ Create payment history with all new fields
    const paymentHistory = new PaymentHistory({
      bookingId: bookingId,
      customerEmail: customerEmail,
      serviceName: serviceName,
      totalAmount: totalAmount,
      amountPaid: session.amount_total ? (session.amount_total / 100) : parseFloat(totalAmount),
      currency: session.currency || 'usd',
      paymentType: "card",
      paymentMethod: "credit_card",
      paymentStatus: session.payment_status || "paid",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      stripeChargeId: stripeChargeId,
      receiptUrl: receiptUrl,
      receiptNumber: receiptNumber,
      paidAt: new Date(),
      paymentConfirmedAt: new Date(),
      customerName: `${firstName} ${lastName}`,
      customerPhone: phone,
      serviceTime: startTime,
      serviceDuration: `${durationHours}h ${durationMinutes}m`,
      serviceLocation: location,
      numberOfStaff: parseInt(numberOfStaff) || 1,
      taxAmount: 0, // You can calculate this if needed
      discountAmount: 0, // You can add discount logic
      serviceFee: 0, // You can add service fee logic
      notes: "Payment processed successfully via Stripe",
      isActive: true,
      adminVerified: false
    });

    await paymentHistory.save();

    console.log(`💰 Processing successful payment for booking: ${bookingId}`);
    console.log(`💳 Amount: $${session.amount_total ? (session.amount_total / 100) : totalAmount}`);
    console.log(`📄 Receipt: ${receiptUrl}`);
    console.log(`🔗 Payment History ID: ${paymentHistory._id}`);

    // ✅ Update booking status with comprehensive information
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: bookingId },
      {
        $set: {
          paid: 'paid',
          paymentStatus: 'paid',
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
          receiptUrl: receiptUrl,
          receiptNumber: receiptNumber,
          paidAt: new Date(),
          amountPaid: session.amount_total ? (session.amount_total / 100) : parseFloat(totalAmount),
          currency: session.currency || 'usd',
          paymentMethod: 'card',
          // Additional booking updates if needed
          status: 'confirmed',
          updatedAt: new Date()
        }
      },
      { new: true } // Return updated document
    );

    if (!updatedBooking) {
      throw new Error(`Booking not found with ID: ${bookingId}`);
    }

    console.log(`✅ Booking updated: ${updatedBooking._id}`);

    // ✅ Update user's serviceTaken count
    const userUpdate = await User.updateOne(
      { email: customerEmail },
      { 
        $inc: { serviceTaken: 1 },
        $set: { lastServiceDate: new Date() }
      }
    );

    console.log(`👤 User service count updated for: ${customerEmail}`);

    // ✅ Send confirmation email to customer WITH RECEIPT LINK
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #4CAF50; border-radius: 12px;">
        <h1 style="color: #4CAF50;">Payment Successful - Booking Confirmed! 🎉</h1>
        <p style="font-size:16px; margin:20px 0;">
          Thank you for your payment! Your booking for <strong>${serviceName}</strong> has been confirmed.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
          <h3 style="color: #333; margin-bottom: 15px;">Payment & Receipt Details</h3>
          <p><strong>Amount Paid:</strong> $${session.amount_total ? (session.amount_total / 100) : totalAmount} ${session.currency ? session.currency.toUpperCase() : 'USD'}</p>
          <p><strong>Transaction ID:</strong> ${session.payment_intent}</p>
          <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> Credit Card</p>
          ${receiptUrl ? `
            <p><strong>Receipt:</strong> <a href="${receiptUrl}" target="_blank" style="color: #4CAF50; text-decoration: none; font-weight: bold;">View Your Receipt</a></p>
          ` : ''}
          ${receiptNumber ? `
            <p><strong>Receipt Number:</strong> ${receiptNumber}</p>
          ` : ''}
        </div>

        <div style="background: #e6f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
          <h3 style="color: #333; margin-bottom: 15px;">Booking Details</h3>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Date:</strong> ${new Date(dateOfEvent).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${startTime}</p>
          <p><strong>Duration:</strong> ${durationHours}h ${durationMinutes}m</p>
          <p><strong>Staff:</strong> ${numberOfStaff} butlers</p>
          <p><strong>Location:</strong> ${location}</p>
        </div>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #2e7d32; font-weight: bold;">
            ✅ Payment successfully processed - Your booking is confirmed!
          </p>
        </div>
        
        <div style="margin-top: 25px; padding: 15px; background: #fff3cd; border-radius: 8px;">
          <p style="margin: 0; color: #856404;">
            <strong>Note:</strong> Your receipt is also available in your Stripe customer portal. 
            We'll contact you shortly with more details about your booking.
          </p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            Need help? Contact us at bannah76769@gmail.com or call +1-XXX-XXX-XXXX
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: customerEmail,
      subject: `Payment Successful - ${serviceName} Booking Confirmed!`,
      html: customerEmailHtml,
    });

    console.log(`📧 Confirmation email sent to: ${customerEmail}`);

    // ✅ Send notification to admin WITH COMPLETE INFO
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #4CAF50; border-radius: 12px;">
        <h2 style="color: #4CAF50; margin-bottom: 20px;">💰 Payment Received - Booking Confirmed</h2>
        
        <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
          <h3 style="color: #333; margin-bottom: 10px;">Payment Information</h3>
          <p><strong>Amount:</strong> $${session.amount_total ? (session.amount_total / 100) : totalAmount} ${session.currency ? session.currency.toUpperCase() : 'USD'}</p>
          <p><strong>Payment Intent:</strong> ${session.payment_intent}</p>
          <p><strong>Session ID:</strong> ${session.id}</p>
          <p><strong>Charge ID:</strong> ${stripeChargeId || 'N/A'}</p>
          ${receiptUrl ? `<p><strong>Receipt URL:</strong> <a href="${receiptUrl}" target="_blank">View Receipt</a></p>` : ''}
          ${receiptNumber ? `<p><strong>Receipt Number:</strong> ${receiptNumber}</p>` : ''}
        </div>

        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
          <h3 style="color: #333; margin-bottom: 10px;">Customer & Booking Details</h3>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Customer:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Event Date:</strong> ${new Date(dateOfEvent).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${startTime}</p>
          <p><strong>Duration:</strong> ${durationHours}h ${durationMinutes}m</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Staff Required:</strong> ${numberOfStaff}</p>
        </div>

        <div style="background: #e8f5e8; padding: 10px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 0; color: #2e7d32; font-weight: bold;">
            ✅ Payment successfully processed - Ready for butler assignment
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: "rakib.fbinternational@gmail.com",
      subject: `💰 Payment Received - $${session.amount_total ? (session.amount_total / 100) : totalAmount} for ${serviceName}`,
      html: adminEmailHtml,
    });

    console.log(`📧 Admin notification sent`);

    // ✅ Log successful processing
    console.log(`🎉 Successfully processed payment for booking ${bookingId}`);
    console.log(`📄 Receipt URL: ${receiptUrl}`);
    console.log(`💳 Payment History ID: ${paymentHistory._id}`);

    return {
      success: true,
      bookingId: bookingId,
      paymentHistoryId: paymentHistory._id,
      receiptUrl: receiptUrl,
      amount: session.amount_total ? (session.amount_total / 100) : totalAmount
    };

  } catch (error) {
    console.error('❌ Error handling successful payment:', error);
    
    // Send error notification
    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: "rakib.fbinternational@gmail.com",
      subject: "❌ Payment Processing Error",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff; border: 2px solid #f44336; border-radius: 8px;">
          <h2 style="color: #f44336;">Payment Processing Error</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Session ID:</strong> ${session?.id}</p>
          <p><strong>Booking ID:</strong> ${session?.metadata?.bookingId}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    throw error;
  }
};

// Handle expired session
const handleExpiredSession = async (session) => {
  try {
    const bookingId = session.metadata.bookingId;

    console.log(`Processing expired session for booking: ${bookingId}`);

    // Update booking status to cancelled
    await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          paid: 'cancelled',
          paymentStatus: 'expired',
          cancellationReason: 'Payment session expired',
          updatedAt: new Date()
        }
      }
    );

    // Send expiration email to customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff9800; border-radius: 12px;">
        <h1 style="color: #ff9800;">Payment Session Expired</h1>
        <p style="font-size:16px; margin:20px 0;">
          Your payment session for <strong>${session.metadata.serviceName}</strong> has expired.
        </p>
        <p style="font-size:16px;">
          The payment link was only valid for 30 minutes. If you still wish to book this service, please visit our website and create a new booking.
        </p>
        <div style="margin: 25px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #ff9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            Create New Booking
          </a>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: session.metadata.customerEmail,
      subject: "Payment Session Expired",
      html: customerEmailHtml,
    });

    console.log(`Successfully handled expired session for booking ${bookingId}`);

  } catch (error) {
    console.error('Error handling expired session:', error);
    throw error;
  }
};

// Handle failed payment
const handleFailedPayment = async (session) => {
  try {
    const bookingId = session.metadata.bookingId;

    console.log(`Processing failed payment for booking: ${bookingId}`);

    // Update booking status
    await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          paymentStatus: 'failed',
          updatedAt: new Date()
        }
      }
    );

    // Send failure email to customer
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #f44336; border-radius: 12px;">
        <h1 style="color: #f44336;">Payment Failed</h1>
        <p style="font-size:16px; margin:20px 0;">
          We encountered an issue processing your payment for <strong>${session.metadata.serviceName}</strong>.
        </p>
        <p style="font-size:16px;">
          Please try again or contact your bank if the problem persists. Your booking will be held for 24 hours.
        </p>
        <div style="margin: 25px 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background: #f44336; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            Try Again
          </a>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: session.metadata.customerEmail,
      subject: "Payment Failed",
      html: customerEmailHtml,
    });

    console.log(`Successfully handled failed payment for booking ${bookingId}`);

  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
};

// Verify payment status
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId, bookingId } = req.body;

    if (!sessionId && !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Either sessionId or bookingId is required'
      });
    }

    let session;
    if (sessionId) {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } else {
      // Find session by booking ID
      const sessions = await stripe.checkout.sessions.list({
        limit: 1,
        metadata: { bookingId: bookingId }
      });
      session = sessions.data[0];
    }

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Get booking details
    const booking = await Booking.findById(session.metadata.bookingId);

    res.status(200).json({
      success: true,
      session: {
        id: session.id,
        paid: session.status,
        payment_status: session.payment_status,
        amount_total: session.amount_total / 100,
        currency: session.currency,
        customer_email: session.customer_email,
        created: new Date(session.created * 1000)
      },
      booking: booking ? {
        id: booking._id,
        paid: booking.status,
        paymentStatus: booking.paymentStatus,
        serviceName: booking.serviceName,
        price: booking.price
      } : null
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};





export const allPaymentHistory = async(req, res)=>{

   try {

     const skip = req.query.skip;
    const limit = req.query.limit;
    const payments = await PaymentHistory.find().skip(skip).limit(limit).populate('butler');
    const paymentsCount = await PaymentHistory.countDocuments();
    res.status(200).json({
        message:"Success",
        data:payments,
        count:paymentsCount
    })
    
   } catch (error) {
    console.log(error)
    res.status(500).json({
        
        message:'Something went wrong!',
        error
    })
   }
}

export const paymentHistoryForCustomer = async(req, res)=>{
  try {
    const email = req.params.email;
         const skip = req.query.skip;
    const limit = req.query.limit;
    const history = await PaymentHistory.find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const historyCount = await PaymentHistory.countDocuments({customerEmail:email});
     const paidPayments = await PaymentHistory.find({ 
      customerEmail: email, 
      paymentStatus: 'paid' 
    }).select('amountPaid');

    const totalOutGoing = paidPayments.reduce((sum, payment) => {
      return sum + (payment.amountPaid || 0);
    }, 0);

    res.status(200).json({
      message:"Success",
      data: history,
      count:historyCount,
      totalOutGoing
    })
    
  } catch (error) {
    res.status(500).json({
      message:"Something went wrong!"
    })
  }
}

export const paymentHistoryForButler = async(req, res) => {
  try {
    const id = req.params.id;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;

    // Get paginated history
    const history = await PaymentHistory.find({ butler: id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const historyCount = await PaymentHistory.countDocuments({ butler: id });

    // ✅ Calculate total earnings (20% of amountPaid)
    const totalEarningsResult = await PaymentHistory.aggregate([
      { 
        $match: { 
          butler: new mongoose.Types.ObjectId(id),
          paymentStatus: 'paid' // Only consider paid payments
        } 
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amountPaid" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const totalAmount = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalAmount : 0;
    const totalEarnings = totalAmount * 0.20; // 20% commission

    // ✅ Calculate weekly earnings (current week)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyEarningsResult = await PaymentHistory.aggregate([
      { 
        $match: { 
          butler: new mongoose.Types.ObjectId(id),
          paymentStatus: 'paid',
          paidAt: { $gte: startOfWeek }
        } 
      },
      {
        $group: {
          _id: null,
          weeklyAmount: { $sum: "$amountPaid" },
          weeklyTransactions: { $sum: 1 }
        }
      }
    ]);

    const weeklyAmount = weeklyEarningsResult.length > 0 ? weeklyEarningsResult[0].weeklyAmount : 0;
    const weeklyEarnings = weeklyAmount * 0.20; // 20% commission

    // ✅ Calculate monthly earnings (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyEarningsResult = await PaymentHistory.aggregate([
      { 
        $match: { 
          butler: new mongoose.Types.ObjectId(id),
          paymentStatus: 'paid',
          paidAt: { $gte: startOfMonth }
        } 
      },
      {
        $group: {
          _id: null,
          monthlyAmount: { $sum: "$amountPaid" },
          monthlyTransactions: { $sum: 1 }
        }
      }
    ]);

    const monthlyAmount = monthlyEarningsResult.length > 0 ? monthlyEarningsResult[0].monthlyAmount : 0;
    const monthlyEarnings = monthlyAmount * 0.20; // 20% commission

    res.status(200).json({
      message: "Success",
      data: history,
      count: historyCount,
      earnings: {
        total: {
          amount: totalEarnings,
          transactions: totalEarningsResult.length > 0 ? totalEarningsResult[0].totalTransactions : 0
        },
        weekly: {
          amount: weeklyEarnings,
          transactions: weeklyEarningsResult.length > 0 ? weeklyEarningsResult[0].weeklyTransactions : 0
        },
        monthly: {
          amount: monthlyEarnings,
          transactions: monthlyEarningsResult.length > 0 ? monthlyEarningsResult[0].monthlyTransactions : 0
        }
      },
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(historyCount / limit)
    });
    
  } catch (error) {
    console.log("Error in paymentHistoryForButler:", error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message
    });
  }
}