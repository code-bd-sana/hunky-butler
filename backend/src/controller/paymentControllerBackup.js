import { Client, Environment } from 'square';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import { storeNotification } from '../utils/utils.js';
import PaymentHistory from '../models/payment.model.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

// Square client setup
const squareClient = new Client({
  environment: Environment.Sandbox, 
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

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

// Create Square Checkout Session for Existing Booking
export const createCheckoutSessionExistngBooking = async (req, res) => {
  try {
    const { id, successUrl, cancelUrl } = req.body;

    const savedBooking = await Booking.findOne({_id: id});
    console.log(savedBooking, "ami tomar saved booking");

    const price = savedBooking?.paymentStatus === 'deposit_paid' ? savedBooking.price - 20 : savedBooking?.price;

    // Create Square Checkout
    const { result } = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: `${savedBooking.serviceName} Service Booking`,
        priceMoney: {
          amount: Math.round(price * 100), // Convert to cents
          currency: 'USD'
        },
        locationId: process.env.SQUARE_LOCATION_ID
      },
      checkoutOptions: {
        redirectUrl: successUrl,
        // cancelUrl: cancelUrl // Square-এ cancelUrl directly support করে না
      },
      prePopulatedData: {
        buyerEmail: savedBooking.email,
        buyerPhoneNumber: savedBooking.phone
      },
      description: `Butler service for ${savedBooking.durationHours} hours with ${savedBooking.numberOfStaff} staff members`,
      metadata: {
        bookingId: savedBooking._id.toString(),
        customerEmail: savedBooking.email,
        firstName: savedBooking?.firstName,
        lastName: savedBooking?.lastName,
        serviceName: savedBooking.serviceName,
        totalAmount: price.toString()
      }
    });

    console.log(result, "Square Checkout Result");

    // Send response with both url and orderId
    res.status(200).json({
      success: true,
      checkoutUrl: result.paymentLink.url,
      orderId: result.paymentLink.orderId,
      bookingId: savedBooking._id,
      message: 'Square checkout session created successfully'
    });

  } catch (error) {
    console.error('Error creating Square checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
};

// Create Square Checkout Session for New Booking
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingData, successUrl, cancelUrl, paymentType = 'full' } = req.body;

    console.log('Creating Square checkout session for:', bookingData, 'Payment type:', paymentType);

    // Validate required fields
    if (!bookingData || !successUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingData, successUrl'
      });
    }

    // Calculate amounts based on payment type
    const totalAmount = bookingData.price;
    const depositAmount = 20; // $20 deposit
    const isDeposit = paymentType === 'deposit';
    const amountToCharge = isDeposit ? depositAmount : totalAmount;
    const amountDue = isDeposit ? totalAmount - depositAmount : 0;

    // Create booking first with pending status
    const newBooking = new Booking({
      ...bookingData,
      paymentType: paymentType,
      depositAmount: isDeposit ? depositAmount : 0,
      amountDue: amountDue,
      amountPaid: isDeposit ? depositAmount : 0,
      paid: isDeposit ? 'deposit_paid' : 'pending',
      paymentMethod: 'pay_now',
      paymentStatus: isDeposit ? 'deposit_paid' : 'pending',
      totalAmount: totalAmount,
      createdAt: new Date()
    });

    const savedBooking = await newBooking.save();
    console.log('Booking created with ID:', savedBooking._id, 'Payment type:', paymentType);

    // Create Square Checkout
    const { result } = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: isDeposit 
          ? `${bookingData.serviceName} Service - Deposit` 
          : `${bookingData.serviceName} Service Booking`,
        priceMoney: {
          amount: Math.round(amountToCharge * 100), // Convert to cents
          currency: 'USD'
        },
        locationId: process.env.SQUARE_LOCATION_ID
      },
      checkoutOptions: {
        redirectUrl: successUrl,
      },
      prePopulatedData: {
        buyerEmail: bookingData.email,
        buyerPhoneNumber: bookingData.phone
      },
      description: isDeposit
        ? `Deposit for ${bookingData.durationHours} hours with ${bookingData.numberOfStaff} staff members (Balance: $${amountDue})`
        : `Butler service for ${bookingData.durationHours} hours with ${bookingData.numberOfStaff} staff members`,
      metadata: {
        bookingId: savedBooking._id.toString(),
        customerEmail: bookingData.email,
        firstName: bookingData.firstName,
        lastName: bookingData?.lastName,
        serviceName: bookingData.serviceName,
        totalAmount: totalAmount.toString(),
        paymentType: paymentType,
        depositAmount: depositAmount.toString(),
        amountDue: amountDue.toString(),
        phone: bookingData.phone,
        dateOfEvent: bookingData.dateOfEvent,
        startTime: bookingData.startTime,
        durationHours: bookingData.durationHours.toString(),
        location: bookingData.location,
        numberOfStaff: bookingData.numberOfStaff.toString()
      }
    });

    console.log('Square session created:', result.paymentLink.id, 'for payment type:', paymentType);

    // Send response
    res.status(200).json({
      success: true,
      checkoutUrl: result.paymentLink.url,
      orderId: result.paymentLink.orderId,
      bookingId: savedBooking._id,
      paymentType: paymentType,
      amountCharged: amountToCharge,
      amountDue: amountDue,
      message: 'Square checkout session created successfully'
    });

  } catch (error) {
    console.error('Error creating Square checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
};

// Handle Square Webhook
export const handleSquareWebhook = async (req, res) => {
  const signature = req.headers['x-square-signature'];
  const body = req.body;

  try {
    // Verify webhook signature (Square-এর documentation অনুযায়ী implement করুন)
    // const isValid = verifySquareWebhook(signature, body);
    // if (!isValid) {
    //   return res.status(400).send('Invalid webhook signature');
    // }

    const eventType = body.type;
    console.log('🔔 Square Webhook received:', eventType);

    switch (eventType) {
      case 'payment.created':
        await handleSquarePaymentCreated(body);
        break;
        
      case 'payment.updated':
        await handleSquarePaymentUpdated(body);
        break;
        
      case 'refund.created':
        await handleSquareRefundCreated(body);
        break;
        
      default:
        console.log(`Unhandled Square event type: ${eventType}`);
    }

    res.json({ received: true, handled: true, eventType: eventType });
    
  } catch (error) {
    console.error('❌ Error handling Square webhook event:', error);
    
    // Send error email
    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: "rakib.fbinternational@gmail.com",
      subject: "❌ Square Webhook Processing Error",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff; border: 2px solid #f44336; border-radius: 8px;">
          <h2 style="color: #f44336;">Square Webhook Processing Error</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Event Type:</strong> ${body?.type}</p>
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

// Handle Square Payment Created Event
const handleSquarePaymentCreated = async (webhookBody) => {
  try {
    const payment = webhookBody.data.object.payment;
    const orderId = payment.orderId;

    console.log('🔄 Processing Square payment created:', payment.id, 'Order:', orderId);

    // Get payment details from Square
    const { result: { payment: fullPayment } } = await squareClient.paymentsApi.getPayment(payment.id);
    
    // Get metadata from payment note or custom fields
    const metadata = await getPaymentMetadata(fullPayment);
    
    await handleSuccessfulSquarePayment(fullPayment, metadata);

  } catch (error) {
    console.error('❌ Error handling Square payment created:', error);
    throw error;
  }
};

// Handle Square Payment Updated Event
const handleSquarePaymentUpdated = async (webhookBody) => {
  try {
    const payment = webhookBody.data.object.payment;
    
    if (payment.status === 'COMPLETED') {
      console.log('✅ Payment completed:', payment.id);
      const { result: { payment: fullPayment } } = await squareClient.paymentsApi.getPayment(payment.id);
      const metadata = await getPaymentMetadata(fullPayment);
      await handleSuccessfulSquarePayment(fullPayment, metadata);
    } else if (payment.status === 'FAILED') {
      console.log('❌ Payment failed:', payment.id);
      await handleFailedSquarePayment(payment);
    } else if (payment.status === 'CANCELED') {
      console.log('🚫 Payment canceled:', payment.id);
      await handleCanceledSquarePayment(payment);
    }

  } catch (error) {
    console.error('❌ Error handling Square payment updated:', error);
    throw error;
  }
};

// Get Payment Metadata from Square
const getPaymentMetadata = async (payment) => {
  try {
    // Square-এ metadata store করার বিভিন্ন way আছে
    // Option 1: Payment note-এ JSON store করা
    if (payment.note) {
      try {
        return JSON.parse(payment.note);
      } catch (e) {
        console.log('Note is not JSON, trying other methods');
      }
    }

    // Option 2: Order থেকে metadata fetch করা
    if (payment.orderId) {
      const { result: { order } } = await squareClient.ordersApi.retrieveOrder(payment.orderId);
      if (order.metadata) {
        return order.metadata;
      }
    }

    // Option 3: Custom fields থেকে
    return {
      bookingId: payment.metadata?.bookingId,
      customerEmail: payment.buyerEmailAddress,
      // অন্যান্য fields...
    };

  } catch (error) {
    console.error('Error getting payment metadata:', error);
    return {};
  }
};

// Handle Successful Square Payment
const handleSuccessfulSquarePayment = async (payment, metadata) => {
  try {
    const bookingId = metadata.bookingId;
    const customerEmail = metadata.customerEmail || payment.buyerEmailAddress;
    const serviceName = metadata.serviceName;
    const totalAmount = parseFloat(metadata.totalAmount || '0');
    const paymentType = metadata.paymentType || 'full';
    const isDeposit = paymentType === 'deposit';
    const isBalancePayment = paymentType === 'balance';

    console.log('🔄 Processing Square payment:', { 
      bookingId, 
      paymentType, 
      isDeposit, 
      isBalancePayment,
      paymentId: payment.id
    });

    if (!bookingId) {
      throw new Error('Missing bookingId in payment metadata');
    }

    let paymentHistory;

    if (isBalancePayment) {
      // Handle balance payment
      console.log('💵 Processing BALANCE payment with Square');
      
      paymentHistory = await PaymentHistory.findById(metadata.originalPaymentId);
      if (!paymentHistory) {
        throw new Error(`Original payment not found: ${metadata.originalPaymentId}`);
      }

      // Update payment history for balance payment
      paymentHistory.amountPaid = totalAmount;
      paymentHistory.amountDue = 0;
      paymentHistory.paymentStatus = 'paid';
      paymentHistory.paymentType = 'full';
      paymentHistory.squarePaymentId = payment.id;
      paymentHistory.paymentConfirmedAt = new Date();

      // Get receipt information
      paymentHistory.receiptUrl = payment.receiptUrl;
      paymentHistory.receiptNumber = payment.receiptNumber;

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

      console.log('✅ Square balance payment completed for booking:', bookingId);

    } else {
      // Handle new payment (full or deposit)
      console.log(isDeposit ? '💰 Processing DEPOSIT payment with Square' : '💳 Processing FULL payment with Square');
      
      const firstName = metadata.firstName;
      const lastName = metadata.lastName;
      const phone = metadata.phone;
      const dateOfEvent = metadata.dateOfEvent;
      const startTime = metadata.startTime;
      const durationHours = metadata.durationHours;
      const location = metadata.location;
      const numberOfStaff = metadata.numberOfStaff;
      
      // Amount calculation
      const depositAmount = parseFloat(metadata.depositAmount || '0');
      const amountDue = parseFloat(metadata.amountDue || '0');
      
      const amountPaid = isDeposit ? depositAmount : totalAmount;
      const paymentStatus = isDeposit ? 'deposit_paid' : 'paid';

      console.log('💰 Square payment details:', {
        isDeposit,
        totalAmount,
        depositAmount,
        amountPaid,
        amountDue,
        paymentStatus
      });

      // Create payment history
      paymentHistory = new PaymentHistory({
        bookingId: bookingId,
        customerEmail: customerEmail,
        serviceName: serviceName,
        totalAmount: totalAmount,
        paymentType: paymentType,
        depositAmount: isDeposit ? depositAmount : 0,
        amountDue: amountDue,
        amountPaid: amountPaid,
        currency: payment.totalMoney.currency || 'USD',
        paymentMethodType: payment.sourceType || "card",
        paymentMethod: "credit_card",
        paymentStatus: paymentStatus,
        squarePaymentId: payment.id,
        squareOrderId: payment.orderId,
        receiptUrl: payment.receiptUrl,
        receiptNumber: payment.receiptNumber,
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
          ? `Deposit payment of $${depositAmount} received via Square. Balance due: $${amountDue}` 
          : "Full payment processed successfully via Square",
        isActive: true,
        adminVerified: false
      });

      await paymentHistory.save();

      // Update booking status
      const updateData = {
        paid: paymentStatus,
        paymentStatus: paymentStatus,
        paymentType: paymentType,
        squarePaymentId: payment.id,
        squareOrderId: payment.orderId,
        receiptUrl: payment.receiptUrl,
        receiptNumber: payment.receiptNumber,
        paidAt: new Date(),
        amountPaid: amountPaid,
        amountDue: amountDue,
        depositAmount: isDeposit ? depositAmount : 0,
        currency: payment.totalMoney.currency || 'USD',
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

      console.log('✅ Booking updated with Square:', {
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

    // Send confirmation email
    await sendSquarePaymentConfirmationEmail(payment, paymentHistory);

    console.log(`🎉 Successfully processed ${isBalancePayment ? 'balance' : paymentType} payment with Square for booking: ${bookingId}`);
    
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
    console.error('❌ Error handling successful Square payment:', error);
    
    // Send detailed error email
    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: "rakib.fbinternational@gmail.com",
      subject: "❌ Square Payment Processing Error",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff; border: 2px solid #f44336; border-radius: 8px;">
          <h2 style="color: #f44336;">Square Payment Processing Error</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Payment ID:</strong> ${payment?.id}</p>
          <p><strong>Booking ID:</strong> ${metadata?.bookingId}</p>
          <p><strong>Payment Type:</strong> ${metadata?.paymentType}</p>
          <p><strong>Amount:</strong> ${payment?.totalMoney?.amount ? (payment.totalMoney.amount / 100) : 'N/A'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    });
    
    throw error;
  }
};

// Send Square Payment Confirmation Email
const sendSquarePaymentConfirmationEmail = async (payment, paymentHistory) => {
  const isDeposit = paymentHistory.paymentType === 'deposit';
  const isBalancePayment = paymentHistory.paymentType === 'balance';
  
  let subject, html;

  if (isBalancePayment) {
    subject = `Balance Paid - ${paymentHistory.serviceName} Booking Complete!`;
    html = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #4CAF50; border-radius: 12px;">
        <h1 style="color: #4CAF50;">Balance Payment Successful! 🎉</h1>
        <p style="font-size:16px; margin:20px 0;">
          Thank you for completing your payment via Square! Your booking for <strong>${paymentHistory.serviceName}</strong> is now fully confirmed.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
          <h3 style="color: #333; margin-bottom: 15px;">Payment Details</h3>
          <p><strong>Amount Paid:</strong> $${paymentHistory.amountPaid} ${paymentHistory.currency}</p>
          <p><strong>Total Service Cost:</strong> $${paymentHistory.totalAmount}</p>
          <p><strong>Payment Status:</strong> Fully Paid ✅</p>
          ${paymentHistory.receiptUrl ? `
            <p><strong>Receipt:</strong> <a href="${paymentHistory.receiptUrl}" target="_blank" style="color: #4CAF50; text-decoration: none; font-weight: bold;">View Your Square Receipt</a></p>
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
          Thank you for your deposit via Square! Your booking for <strong>${paymentHistory.serviceName}</strong> is temporarily confirmed.
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
            <p><strong>Deposit Receipt:</strong> <a href="${paymentHistory.receiptUrl}" target="_blank" style="color: #FF9800; text-decoration: none; font-weight: bold;">View Square Deposit Receipt</a></p>
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
          Thank you for your payment via Square! Your booking for <strong>${paymentHistory.serviceName}</strong> has been confirmed.
        </p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
          <h3 style="color: #333; margin-bottom: 15px;">Payment Details</h3>
          <p><strong>Amount Paid:</strong> $${paymentHistory.amountPaid} ${paymentHistory.currency}</p>
          <p><strong>Payment Status:</strong> Fully Paid ✅</p>
          ${paymentHistory.receiptUrl ? `
            <p><strong>Receipt:</strong> <a href="${paymentHistory.receiptUrl}" target="_blank" style="color: #4CAF50; text-decoration: none; font-weight: bold;">View Your Square Receipt</a></p>
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

  console.log(`📧 Square ${isBalancePayment ? 'Balance' : isDeposit ? 'Deposit' : 'Payment'} confirmation email sent to: ${paymentHistory.customerEmail}`);
};

// Handle Failed Square Payment
const handleFailedSquarePayment = async (payment) => {
  try {
    const metadata = await getPaymentMetadata(payment);
    const bookingId = metadata.bookingId;

    console.log(`Processing failed Square payment for booking: ${bookingId}`);

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

    // Send failure email
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #f44336; border-radius: 12px;">
        <h1 style="color: #f44336;">Payment Failed</h1>
        <p style="font-size:16px; margin:20px 0;">
          We encountered an issue processing your Square payment for <strong>${metadata.serviceName}</strong>.
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
      to: metadata.customerEmail,
      subject: "Square Payment Failed",
      html: customerEmailHtml,
    });

    console.log(`Successfully handled failed Square payment for booking ${bookingId}`);

  } catch (error) {
    console.error('Error handling failed Square payment:', error);
    throw error;
  }
};

// Handle Canceled Square Payment
const handleCanceledSquarePayment = async (payment) => {
  try {
    const metadata = await getPaymentMetadata(payment);
    const bookingId = metadata.bookingId;

    console.log(`Processing canceled Square payment for booking: ${bookingId}`);

    // Update booking status
    await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          paid: 'cancelled',
          paymentStatus: 'canceled',
          cancellationReason: 'Payment canceled by user',
          updatedAt: new Date()
        }
      }
    );

    console.log(`Successfully handled canceled Square payment for booking ${bookingId}`);

  } catch (error) {
    console.error('Error handling canceled Square payment:', error);
    throw error;
  }
};

// Handle Square Refund Created
const handleSquareRefundCreated = async (webhookBody) => {
  try {
    const refund = webhookBody.data.object.refund;
    console.log('Refund created:', refund.id);
    
    // Handle refund logic here
    // Update booking and payment history accordingly
    
  } catch (error) {
    console.error('Error handling Square refund:', error);
    throw error;
  }
};

// Verify Payment Status with Square
export const verifyPayment = async (req, res) => {
  try {
    const { orderId, bookingId, paymentId } = req.body;

    if (!orderId && !bookingId && !paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Either orderId, bookingId or paymentId is required'
      });
    }

    let payment;
    if (paymentId) {
      const { result } = await squareClient.paymentsApi.getPayment(paymentId);
      payment = result.payment;
    } else if (orderId) {
      // Find payment by order ID
      const { result: { payments } } = await squareClient.paymentsApi.listPayments(
        undefined,
        undefined,
        undefined,
        orderId
      );
      payment = payments[0];
    } else {
      // Find payment by booking ID (via metadata)
      const booking = await Booking.findById(bookingId);
      if (booking && booking.squarePaymentId) {
        const { result } = await squareClient.paymentsApi.getPayment(booking.squarePaymentId);
        payment = result.payment;
      }
    }

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Get booking details
    const booking = await Booking.findById(bookingId);

    res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.totalMoney.amount / 100,
        currency: payment.totalMoney.currency,
        buyerEmail: payment.buyerEmailAddress,
        createdAt: payment.createdAt
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
    console.error('Error verifying Square payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// Existing functions (unchanged)
export const allPaymentHistory = async(req, res)=>{
  try {
    const skip = req.query.skip;
    const limit = req.query.limit;
    const payments = await PaymentHistory.find().sort({createdAt: -1}).skip(skip).limit(limit).populate('butler.id');
    const paymentsCount = await PaymentHistory.countDocuments();
    res.status(200).json({
      message:"Success",
      data:payments,
      count:paymentsCount
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:'Something went wrong!',
      error
    });
  }
};

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
    });
  } catch (error) {
    res.status(500).json({
      message:"Something went wrong!"
    });
  }
};

export const paymentHistoryForButler = async(req, res) => {
  try {
    const id = req.params.id;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;

    // Get paginated history
    const history = await PaymentHistory.find({ 
      "butler.id": new mongoose.Types.ObjectId(id) 
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const historyCount = await PaymentHistory.countDocuments({ 
      "butler.id": new mongoose.Types.ObjectId(id) 
    });

    // Calculate earnings (same logic as before)
    const totalEarningsResult = await Booking.aggregate([
      { 
        $match: { 
          "butler.id": new mongoose.Types.ObjectId(id),
          status: 'completed'
        } 
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$butlerFee" },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalAmount : 0;
    const totalTransactions = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalTransactions : 0;

    // Weekly and monthly calculations (same as before)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyEarningsResult = await Booking.aggregate([
      { 
        $match: { 
          "butler.id": new mongoose.Types.ObjectId(id),
          status: 'completed',
          updatedAt: { $gte: startOfWeek }
        } 
      },
      {
        $group: {
          _id: null,
          weeklyAmount: { $sum: "$butlerFee" },
          weeklyTransactions: { $sum: 1 }
        }
      }
    ]);

    const weeklyEarnings = weeklyEarningsResult.length > 0 ? weeklyEarningsResult[0].weeklyAmount : 0;
    const weeklyTransactions = weeklyEarningsResult.length > 0 ? weeklyEarningsResult[0].weeklyTransactions : 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyEarningsResult = await Booking.aggregate([
      { 
        $match: { 
          "butler.id": new mongoose.Types.ObjectId(id),
          status: 'completed',
          updatedAt: { $gte: startOfMonth }
        } 
      },
      {
        $group: {
          _id: null,
          monthlyAmount: { $sum: "$butlerFee" },
          monthlyTransactions: { $sum: 1 }
        }
      }
    ]);

    const monthlyEarnings = monthlyEarningsResult.length > 0 ? monthlyEarningsResult[0].monthlyAmount : 0;
    const monthlyTransactions = monthlyEarningsResult.length > 0 ? monthlyEarningsResult[0].monthlyTransactions : 0;

    res.status(200).json({
      message: "Success",
      data: history,
      count: historyCount,
      earnings: {
        total: {
          amount: totalEarnings,
          transactions: totalTransactions
        },
        weekly: {
          amount: weeklyEarnings,
          transactions: weeklyTransactions
        },
        monthly: {
          amount: monthlyEarnings,
          transactions: monthlyTransactions
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
};