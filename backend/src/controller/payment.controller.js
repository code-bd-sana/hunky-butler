import stripePackage from 'stripe';


import nodemailer from 'nodemailer';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import { storeNotification } from '../utils/utils.js';
import PaymentHistory from '../models/payment.model.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

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

  console.log("first")
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
    const { bookingData, successUrl, cancelUrl, paymentType = 'full' } = req.body;

    console.log('Creating checkout session for:', bookingData, 'Payment type:', paymentType);

    // Validate required fields
    if (!bookingData || !successUrl || !cancelUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingData, successUrl, cancelUrl'
      });
    }

    // Calculate amounts based on payment type
    const totalAmount = bookingData.price;
    const depositAmount = 20; // $20 deposit
    const isDeposit = paymentType === 'deposit';
    const amountToCharge = isDeposit ? depositAmount : totalAmount;
    const amountDue = isDeposit ? totalAmount - depositAmount : 0;

    // Create booking first with pending status - IMPORTANT: Include paymentType
    const newBooking = new Booking({
      ...bookingData,
      paymentType: paymentType, // ✅ Eta add koro
      depositAmount: isDeposit ? depositAmount : 0, // ✅ Eta add koro
      amountDue: amountDue, // ✅ Eta add koro
      amountPaid: isDeposit ? depositAmount : 0, // ✅ Eta add koro
      paid: isDeposit ? 'deposit_paid' : 'pending',
      paymentMethod: 'pay_now',
      paymentStatus: isDeposit ? 'deposit_paid' : 'pending',
      totalAmount: totalAmount,
      createdAt: new Date()
    });

    const savedBooking = await newBooking.save();
    console.log('Booking created with ID:', savedBooking._id, savedBooking.paymentStatus, 'Payment type:', paymentType, 'Amount Due:', amountDue, );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isDeposit 
                ? `${bookingData.serviceName} Service - Deposit` 
                : `${bookingData.serviceName} Service Booking`,
              description: isDeposit
                ? `Deposit for ${bookingData.durationHours} hours with ${bookingData.numberOfStaff} staff members (Balance: $${amountDue})`
                : `Butler service for ${bookingData.durationHours} hours with ${bookingData.numberOfStaff} staff members`,
            },
            unit_amount: Math.round(amountToCharge * 100), // Convert to cents
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
        totalAmount: totalAmount.toString(),
        paymentType: paymentType, // ✅ Eta must include
        depositAmount: depositAmount.toString(), // ✅ Eta add koro
        amountDue: amountDue.toString(), // ✅ Eta add koro
        phone: bookingData.phone,
        dateOfEvent: bookingData.dateOfEvent,
        startTime: bookingData.startTime,
        durationHours: bookingData.durationHours.toString(),
        location: bookingData.location,
        numberOfStaff: bookingData.numberOfStaff.toString()
      },
      customer_email: bookingData.email,
    });

    console.log('Stripe session created:', session.id, 'for payment type:', paymentType);

    // Send response with both sessionId and url
    res.status(200).json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      bookingId: savedBooking._id,
      paymentType: paymentType,
      amountCharged: amountToCharge,
      amountDue: amountDue,
      message: 'Checkout session created successfully'
    });

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

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret_here'
    );
    
    console.log('🔔 Webhook received:', event.type);

  } catch (err) {
    console.log(`❌ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // ✅ DEBUGGING: Check what's coming in metadata
        console.log('📋 Webhook Session Metadata:', session.metadata);
        console.log('💰 Payment Type from Metadata:', session.metadata?.paymentType);
        console.log('🔍 Session ID:', session.id);
        console.log('📝 Amount Total:', session.amount_total);
        
        await handleSuccessfulPayment(session);
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

    res.json({ received: true, handled: true, eventType: event.type });
    
  } catch (error) {
    console.error('❌ Error handling webhook event:', error);
    
    // Send error email
    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: "rakib.fbinternational@gmail.com",
      subject: "❌ Webhook Processing Error",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff; border: 2px solid #f44336; border-radius: 8px;">
          <h2 style="color: #f44336;">Webhook Processing Error</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Event Type:</strong> ${event?.type}</p>
          <p><strong>Session ID:</strong> ${event?.data?.object?.id}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    res.status(500).json({ 
      received: true, 
      handled: false, 
      error: error.message 
    });
  }
};

// Handle successful payment (both full and deposit)
// Handle successful payment (both full and deposit)
// Handle successful payment (both full and deposit)
const handleSuccessfulPayment = async (session) => {
  try {
    // ✅ IMPORTANT: Properly extract metadata with fallbacks
    const metadata = session.metadata || {};
    const bookingId = metadata.bookingId;
    const customerEmail = metadata.customerEmail;
    const serviceName = metadata.serviceName;
    const totalAmount = parseFloat(metadata.totalAmount || '0');
    const paymentType = metadata.paymentType || 'full'; // ✅ Default to 'full' if missing
    const isDeposit = paymentType === 'deposit';
    const isBalancePayment = paymentType === 'balance';

    console.log('🔄 Processing payment:', { 
      bookingId, 
      paymentType, 
      isDeposit, 
      isBalancePayment,
      sessionId: session.id
    });

    // ✅ Validate required fields
    if (!bookingId) {
      throw new Error('Missing bookingId in session metadata');
    }

    let paymentHistory;

    if (isBalancePayment) {
      // Handle balance payment
      console.log('💵 Processing BALANCE payment');
      
      paymentHistory = await PaymentHistory.findById(metadata.originalPaymentId);
      if (!paymentHistory) {
        throw new Error(`Original payment not found: ${metadata.originalPaymentId}`);
      }

      // Update payment history for balance payment
      paymentHistory.amountPaid = totalAmount;
      paymentHistory.amountDue = 0;
      paymentHistory.paymentStatus = 'paid';
      paymentHistory.paymentType = 'full';
      paymentHistory.stripePaymentIntentId = session.payment_intent;
      paymentHistory.paymentConfirmedAt = new Date();

      // Update receipt information
      if (session.payment_intent) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
            expand: ['charges.data']
          });

          if (paymentIntent.charges?.data?.length > 0) {
            const charge = paymentIntent.charges.data[0];
            paymentHistory.receiptUrl = charge.receipt_url;
            paymentHistory.receiptNumber = charge.receipt_number;
            paymentHistory.stripeChargeId = charge.id;
          }
        } catch (error) {
          console.log('⚠️ Could not retrieve receipt details for balance payment:', error.message);
        }
      }

      await paymentHistory.save();

      // Update booking
      await Booking.findByIdAndUpdate(bookingId, {
        paid: 'paid',
        paymentStatus: 'paid',
        paymentType: 'full',
        amountPaid: totalAmount,
        amountDue: 0,
        paymentConfirmedAt: new Date(),
        status: 'confirmed',
        updatedAt: new Date()
      });

      console.log('✅ Balance payment completed for booking:', bookingId);

    } else {
      // Handle new payment (full or deposit)
      console.log(isDeposit ? '💰 Processing DEPOSIT payment' : '💳 Processing FULL payment');
      
      const firstName = metadata.firstName;
      const lastName = metadata.lastName;
      const phone = metadata.phone;
      const dateOfEvent = metadata.dateOfEvent;
      const startTime = metadata.startTime;
      const durationHours = metadata.durationHours;
      const location = metadata.location;
      const numberOfStaff = metadata.numberOfStaff;
      
      // ✅ CORRECT AMOUNT CALCULATION
      const depositAmount = parseFloat(metadata.depositAmount || '0');
      const amountDue = parseFloat(metadata.amountDue || '0');
      
      const amountPaid = isDeposit ? depositAmount : totalAmount;
      const paymentStatus = isDeposit ? 'deposit_paid' : 'paid';

      console.log('💰 Payment details:', {
        isDeposit,
        totalAmount,
        depositAmount,
        amountPaid,
        amountDue,
        paymentStatus
      });

      // Get receipt information
      let receiptUrl = null;
      let receiptNumber = null;
      let stripeChargeId = null;

      if (session.payment_intent) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
            expand: ['charges.data']
          });

          if (paymentIntent.charges?.data?.length > 0) {
            const charge = paymentIntent.charges.data[0];
            receiptUrl = charge.receipt_url;
            receiptNumber = charge.receipt_number;
            stripeChargeId = charge.id;
          }
        } catch (error) {
          console.log('⚠️ Could not retrieve receipt details:', error.message);
        }
      }

      // Create payment history
      paymentHistory = new PaymentHistory({
        bookingId: bookingId,
        customerEmail: customerEmail,
        serviceName: serviceName,
        totalAmount: totalAmount,
        paymentType: paymentType, // ✅ 'deposit' or 'full'
        depositAmount: isDeposit ? depositAmount : 0,
        amountDue: amountDue,
        amountPaid: amountPaid,
        currency: session.currency || 'usd',
        paymentMethodType: "card",
        paymentMethod: "credit_card",
        paymentStatus: paymentStatus,
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
        serviceDuration: `${durationHours} hours`,
        serviceLocation: location,
        numberOfStaff: parseInt(numberOfStaff) || 1,
        taxAmount: 0,
        discountAmount: 0,
        serviceFee: 0,
        notes: isDeposit 
          ? `Deposit payment of $${depositAmount} received. Balance due: $${amountDue}` 
          : "Full payment processed successfully via Stripe",
        isActive: true,
        adminVerified: false
      });

      await paymentHistory.save();

      // Update booking status
      const updateData = {
        paid: paymentStatus,
        paymentStatus: paymentStatus,
        paymentType: paymentType, // ✅ 'deposit' or 'full'
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        receiptUrl: receiptUrl,
        receiptNumber: receiptNumber,
        paidAt: new Date(),
        amountPaid: amountPaid,
        amountDue: amountDue,
        depositAmount: isDeposit ? depositAmount : 0,
        currency: session.currency || 'usd',
        paymentMethod: 'card',
        status: isDeposit ? 'deposit_paid' : 'confirmed',
        updatedAt: new Date()
      };

      const updatedBooking = await Booking.findOneAndUpdate(
        { _id: bookingId },
        { $set: updateData },
        { new: true }
      );

      if (!updatedBooking) {
        throw new Error(`Booking not found with ID: ${bookingId}`);
      }

      console.log('✅ Booking updated:', {
        bookingId: updatedBooking._id,
        paymentType: updatedBooking.paymentType,
        paymentStatus: updatedBooking.paymentStatus,
        amountPaid: updatedBooking.amountPaid,
        amountDue: updatedBooking.amountDue
      });

      // Update user's serviceTaken count only for full payments
      if (!isDeposit) {
        await User.updateOne(
          { email: customerEmail },
          { 
            $inc: { serviceTaken: 1 },
            $set: { lastServiceDate: new Date() }
          }
        );
        console.log('👤 User service count updated');
      }
    }

    // Send appropriate email based on payment type
    await sendPaymentConfirmationEmail(session, paymentHistory);

    console.log(`🎉 Successfully processed ${isBalancePayment ? 'balance' : paymentType} payment for booking: ${bookingId}`);
    
    return {
      success: true,
      bookingId: bookingId,
      paymentHistoryId: paymentHistory._id,
      receiptUrl: paymentHistory.receiptUrl,
      amount: paymentHistory.amountPaid,
      paymentType: paymentType,
      isDeposit: isDeposit
    };

  } catch (error) {
    console.error('❌ Error handling successful payment:', error);
    
    // Send detailed error email
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
          <p><strong>Payment Type:</strong> ${session?.metadata?.paymentType}</p>
          <p><strong>Amount:</strong> ${session?.amount_total ? (session.amount_total / 100) : 'N/A'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Stack:</strong> ${error.stack}</p>
        </div>
      `
    });
    
    throw error;
  }
};
// Send appropriate confirmation email
const sendPaymentConfirmationEmail = async (session, paymentHistory) => {
  const isDeposit = paymentHistory.paymentType === 'deposit';
  const isBalancePayment = session.metadata.paymentType === 'balance';
  
  let subject, html;

  if (isBalancePayment) {
    subject = `Balance Paid - ${paymentHistory.serviceName} Booking Complete!`;
    html = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #4CAF50; border-radius: 12px;">
        <h1 style="color: #4CAF50;">Balance Payment Successful! 🎉</h1>
        <p style="font-size:16px; margin:20px 0;">
          Thank you for completing your payment! Your booking for <strong>${paymentHistory.serviceName}</strong> is now fully confirmed.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
          <h3 style="color: #333; margin-bottom: 15px;">Payment Details</h3>
          <p><strong>Amount Paid:</strong> $${paymentHistory.amountPaid} ${paymentHistory.currency}</p>
          <p><strong>Total Service Cost:</strong> $${paymentHistory.totalAmount}</p>
          <p><strong>Payment Status:</strong> Fully Paid ✅</p>
          ${paymentHistory.receiptUrl ? `
            <p><strong>Receipt:</strong> <a href="${paymentHistory.receiptUrl}" target="_blank" style="color: #4CAF50; text-decoration: none; font-weight: bold;">View Your Receipt</a></p>
          ` : ''}
        </div>

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #2e7d32; font-weight: bold;">
            ✅ Your booking is now fully confirmed and ready!
          </p>
        </div>
      </div>
    `;
  } else if (isDeposit) {
    subject = `Deposit Received - ${paymentHistory.serviceName} Booking`;
    html = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #FF9800; border-radius: 12px;">
        <h1 style="color: #FF9800;">Deposit Received! 🎉</h1>
        <p style="font-size:16px; margin:20px 0;">
          Thank you for your deposit! Your booking for <strong>${paymentHistory.serviceName}</strong> is temporarily confirmed.
        </p>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
          <h3 style="color: #856404; margin-bottom: 15px;">Payment Details</h3>
          <p><strong>Deposit Paid:</strong> $${paymentHistory.depositAmount}</p>
          <p><strong>Total Service Cost:</strong> $${paymentHistory.totalAmount}</p>
          <p><strong>Balance Due:</strong> $${paymentHistory.amountDue}</p>
          <p><strong>Payment Status:</strong> Deposit Paid ⚠️</p>
          <p style="color: #856404; font-weight: bold;">
            Please pay the remaining balance before your event date.
          </p>
          ${paymentHistory.receiptUrl ? `
            <p><strong>Deposit Receipt:</strong> <a href="${paymentHistory.receiptUrl}" target="_blank" style="color: #FF9800; text-decoration: none; font-weight: bold;">View Deposit Receipt</a></p>
          ` : ''}
        </div>

        <div style="background: #e6f7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0066cc; font-weight: bold;">
            ℹ️ Your booking will be fully confirmed once the balance is paid.
          </p>
        </div>
      </div>
    `;
  } else {
    subject = `Payment Successful - ${paymentHistory.serviceName} Booking Confirmed!`;
    html = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #4CAF50; border-radius: 12px;">
        <h1 style="color: #4CAF50;">Payment Successful - Booking Confirmed! 🎉</h1>
        <p style="font-size:16px; margin:20px 0;">
          Thank you for your payment! Your booking for <strong>${paymentHistory.serviceName}</strong> has been confirmed.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
          <h3 style="color: #333; margin-bottom: 15px;">Payment Details</h3>
          <p><strong>Amount Paid:</strong> $${paymentHistory.amountPaid} ${paymentHistory.currency}</p>
          <p><strong>Payment Status:</strong> Fully Paid ✅</p>
          ${paymentHistory.receiptUrl ? `
            <p><strong>Receipt:</strong> <a href="${paymentHistory.receiptUrl}" target="_blank" style="color: #4CAF50; text-decoration: none; font-weight: bold;">View Your Receipt</a></p>
          ` : ''}
        </div>
      </div>
    `;
  }

  await transporter.sendMail({
    from: '"Hunky Butler Service" <bannah76769@gmail.com>',
    to: paymentHistory.customerEmail,
    subject: subject,
    html: html,
  });

  console.log(`📧 ${isBalancePayment ? 'Balance' : isDeposit ? 'Deposit' : 'Payment'} confirmation email sent to: ${paymentHistory.customerEmail}`);
};
// Handle successful payment


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
    const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalAmount : 0;

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
    const weeklyEarnings = weeklyEarningsResult.length > 0 ? weeklyEarningsResult[0].weeklyAmount : 0;

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
    const monthlyEarnings = monthlyEarningsResult.length > 0 ? monthlyEarningsResult[0].monthlyAmount : 0;

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