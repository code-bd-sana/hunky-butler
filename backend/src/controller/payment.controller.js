import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client, Environment } = require('square');
const crypto = require('crypto');

import nodemailer from 'nodemailer';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import PaymentHistory from '../models/payment.model.js';
import OrderMapping from '../models/OrderMapping.model.js'; // Create this model
import dotenv from "dotenv";

dotenv.config();

// Square client initialization
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox
});

console.log('✅ Square client initialized successfully');

// API instances
const { paymentsApi, ordersApi, checkoutApi } = squareClient;

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

// ==================== CREATE PAYMENT LINK FOR EXISTING BOOKING ====================
export const createCheckoutSessionExistngBooking = async (req, res) => {
  try {
    const { id, successUrl } = req.body;

    if (!id || !successUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: id, successUrl',
      });
    }

    const savedBooking = await Booking.findOne({ _id: id });
    if (!savedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    console.log('🔄 Processing existing booking:', savedBooking._id.toString());

    const price = savedBooking?.paymentStatus === 'deposit_paid' 
      ? savedBooking.price - 20 
      : savedBooking?.price;

    const validLocationId = process.env.SQUARE_LOCATION_ID;

    // Simple line items
    const simpleLineItems = [
      {
        name: `${savedBooking.serviceName} Service - Balance Payment`,
        quantity: '1',
        basePriceMoney: {
          amount: Math.round(price * 100),
          currency: 'USD',
        },
        note: `Balance payment for ${savedBooking.durationHours} hours with ${savedBooking.numberOfStaff} staff`,
      }
    ];

    // SIMPLE metadata - ONLY bookingId
    const metadata = {
      bid: savedBooking._id.toString(),
    };

    console.log('📋 Metadata to send:', metadata);

    // Create Square Order with verification
    const orderResponse = await ordersApi.createOrder({
      order: {
        locationId: validLocationId,
        lineItems: simpleLineItems,
        metadata: metadata,
      },
      idempotencyKey: crypto.randomUUID(),
    });

    console.log('✅ Square order created:', orderResponse.result.order.id);

    // Verify metadata was saved
    const verifyOrder = await ordersApi.retrieveOrder(orderResponse.result.order.id);
    const savedMetadata = verifyOrder.result.order.metadata;
    console.log('📋 Metadata received from Square:', savedMetadata);

    // Store mapping as fallback
    await OrderMapping.findOneAndUpdate(
      { squareOrderId: orderResponse.result.order.id },
      {
        squareOrderId: orderResponse.result.order.id,
        bookingId: savedBooking._id,
        customerEmail: savedBooking.email
      },
      { upsert: true, new: true }
    );
    console.log('✅ Order mapping stored as fallback');

    // Create Payment Link
    const paymentLinkResponse = await checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: validLocationId,
        lineItems: simpleLineItems,
      },
      checkoutOptions: {
        redirectUrl: successUrl,
        askForShippingAddress: false,
      },
      prePopulatedData: {
        buyerEmail: savedBooking.email,
        buyerPhone: savedBooking.phone || '',
      },
    });

    console.log('✅ Payment link created');

    res.status(200).json({
      success: true,
      paymentLinkId: paymentLinkResponse.result.paymentLink.id,
      checkoutUrl: paymentLinkResponse.result.paymentLink.url,
      orderId: orderResponse.result.order.id,
      bookingId: savedBooking._id,
      message: 'Payment link created successfully',
    });

  } catch (error) {
    console.error('❌ Error creating payment link:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment link',
      error: error.message,
    });
  }
};

// ==================== CREATE PAYMENT LINK FOR NEW BOOKING ====================
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingData, successUrl, paymentType = 'full' } = req.body;

    console.log('🔄 Creating payment link for new booking');
    console.log('💰 Payment type:', paymentType);

    if (!bookingData || !successUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingData, successUrl',
      });
    }

    const validLocationId = process.env.SQUARE_LOCATION_ID;
    if (!validLocationId) {
      return res.status(500).json({
        success: false,
        message: 'Square location ID not configured'
      });
    }

    const totalAmount = bookingData.price;
    const depositAmount = 20;
    const isDeposit = paymentType === 'deposit';
    const amountToCharge = isDeposit ? depositAmount : totalAmount;

    // Create booking first
    const newBooking = new Booking({
      ...bookingData,
      paymentType: paymentType,
      depositAmount: isDeposit ? depositAmount : 0,
      amountDue: isDeposit ? totalAmount - depositAmount : 0,
      amountPaid: isDeposit ? depositAmount : 0,
      paymentStatus: isDeposit ? 'deposit_paid' : 'pending',
      totalAmount: totalAmount,
    });

    const savedBooking = await newBooking.save();
    console.log('✅ Booking created with ID:', savedBooking._id.toString());

    // Simple line items
    const simpleLineItems = [
      {
        name: isDeposit 
          ? `${bookingData.serviceName} Service - Deposit` 
          : `${bookingData.serviceName} Service Booking`,
        quantity: '1',
        basePriceMoney: {
          amount: Math.round(amountToCharge * 100),
          currency: 'USD',
        },
        note: isDeposit
          ? `Deposit for ${bookingData.durationHours} hours`
          : `Service for ${bookingData.durationHours} hours`,
      }
    ];

    // SIMPLE metadata - ONLY bookingId
    const metadata = {
      bid: savedBooking._id.toString(),
    };

    console.log('📋 Metadata to send:', metadata);

    // Create Square Order
    const orderResponse = await ordersApi.createOrder({
      order: {
        locationId: validLocationId,
        lineItems: simpleLineItems,
        metadata: metadata,
      },
      idempotencyKey: crypto.randomUUID(),
    });

    console.log('✅ Square order created:', orderResponse.result.order.id);

    // Verify metadata was saved
    const verifyOrder = await ordersApi.retrieveOrder(orderResponse.result.order.id);
    const savedMetadata = verifyOrder.result.order.metadata;
    console.log('📋 Metadata received from Square:', savedMetadata);

    // Store mapping as fallback
    await OrderMapping.findOneAndUpdate(
      { squareOrderId: orderResponse.result.order.id },
      {
        squareOrderId: orderResponse.result.order.id,
        bookingId: savedBooking._id,
        customerEmail: bookingData.email
      },
      { upsert: true, new: true }
    );
    console.log('✅ Order mapping stored as fallback');

    // Create Payment Link
    const paymentLinkResponse = await checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: validLocationId,
        lineItems: simpleLineItems,
      },
      checkoutOptions: {
        redirectUrl: successUrl,
        askForShippingAddress: false,
      },
      prePopulatedData: {
        buyerEmail: bookingData.email,
        buyerPhone: bookingData.phone || '',
      },
    });

    console.log('✅ Payment link created');

    res.status(200).json({
      success: true,
      paymentLinkId: paymentLinkResponse.result.paymentLink.id,
      checkoutUrl: paymentLinkResponse.result.paymentLink.url,
      orderId: orderResponse.result.order.id,
      bookingId: savedBooking._id,
      paymentType: paymentType,
      amountCharged: amountToCharge,
      amountDue: isDeposit ? totalAmount - depositAmount : 0,
      message: 'Payment link created successfully',
    });

  } catch (error) {
    console.error('❌ Error creating payment link:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment link',
      error: error.message,
    });
  }
};

// ==================== HANDLE SQUARE WEBHOOK ====================
export const handleSquareWebhook = async (req, res) => {
  console.log('🔔🔔🔔 WEBHOOK RECEIVED!');
  
  const signature = req.headers['x-square-hmac-sha256'];
  const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  try {
    // Verify webhook signature
    if (webhookSignatureKey && signature) {
      const hmac = crypto.createHmac('sha256', webhookSignatureKey);
      const payload = req.body.toString();
      hmac.update(payload);
      const hash = hmac.digest('base64');

      if (hash !== signature) {
        console.log('❌ Webhook signature verification FAILED');
        return res.status(401).send('Unauthorized');
      }
      console.log('✅ Webhook signature verified');
    }

    // Parse JSON body
    let event;
    try {
      event = JSON.parse(req.body);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return res.status(400).json({ error: 'Invalid JSON' });
    }

    console.log('🎯 Event Type:', event.type);

    if (event.type === 'payment.updated') {
      console.log('💰 PAYMENT.UPDATED EVENT DETECTED');
      const paymentData = event.data?.object?.payment;
      
      if (!paymentData) {
        console.error('❌ No payment data found');
        return res.status(400).json({ error: 'No payment data' });
      }

      console.log('📊 Payment Status:', paymentData.status);
      console.log('📊 Payment ID:', paymentData.id);
      
      if (paymentData.status === 'COMPLETED') {
        console.log('✅✅✅ PROCESSING COMPLETED PAYMENT');
        await handleSuccessfulPayment(paymentData);
      } else if (paymentData.status === 'FAILED') {
        console.log('❌❌❌ PROCESSING FAILED PAYMENT');
        await handleFailedPayment(paymentData);
      }
    }

    console.log('✅ Webhook processing completed');
    res.json({ 
      received: true, 
      handled: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('❌ WEBHOOK PROCESSING ERROR:', error.message);
    res.status(500).json({
      received: true,
      handled: false,
      error: error.message,
    });
  }
};

// ==================== HANDLE SUCCESSFUL PAYMENT ====================
const handleSuccessfulPayment = async (payment) => {
  try {
    console.log('🔄🔄🔄 STARTING PAYMENT PROCESSING');
    
    const orderId = payment.orderId || payment.order_id;
    console.log('🔍 Order ID:', orderId);
    
    if (!orderId) {
      throw new Error('No order ID found in payment');
    }

    // Retrieve order from Square
    console.log('🔍 Retrieving order from Square...');
    const orderResponse = await ordersApi.retrieveOrder(orderId);
    const order = orderResponse.result.order;
    const metadata = order.metadata || {};

    console.log('📋 Order metadata received:', metadata);

    let bookingId;

    // METHOD 1: Try to get bookingId from metadata
    if (metadata.bid) {
      bookingId = metadata.bid;
      console.log('✅ Found bookingId in metadata:', bookingId);
    } 
    // METHOD 2: Emergency fallback - check database mapping
    else {
      console.log('❌ No metadata found, using database fallback');
      const mapping = await OrderMapping.findOne({ squareOrderId: orderId });
      if (mapping) {
        bookingId = mapping.bookingId.toString();
        console.log('✅ Found bookingId in fallback mapping:', bookingId);
      } else {
        // METHOD 3: Last resort - find by customer email from payment
        try {
          const paymentDetails = await paymentsApi.getPayment(payment.id);
          const buyerEmail = paymentDetails.result.payment?.buyer_email_address;
          
          if (buyerEmail) {
            const recentBooking = await Booking.findOne({
              email: buyerEmail,
              $or: [
                { paymentStatus: 'pending' },
                { paymentStatus: 'deposit_paid' }
              ]
            }).sort({ createdAt: -1 });
            
            if (recentBooking) {
              bookingId = recentBooking._id.toString();
              console.log('✅ Found bookingId by email:', bookingId);
              
              // Store this mapping for future
              await OrderMapping.findOneAndUpdate(
                { squareOrderId: orderId },
                {
                  squareOrderId: orderId,
                  bookingId: recentBooking._id,
                  customerEmail: buyerEmail
                },
                { upsert: true, new: true }
              );
            }
          }
        } catch (emailError) {
          console.error('❌ Error finding by email:', emailError.message);
        }
      }
    }

    if (!bookingId) {
      console.error('❌ CRITICAL: COULD NOT FIND BOOKING ID AFTER ALL ATTEMPTS');
      console.error('📋 Available data:', {
        orderId: orderId,
        paymentId: payment.id,
        amount: payment.amountMoney?.amount / 100
      });
      throw new Error('Cannot process payment - booking ID not found');
    }

    console.log('🔍 Final booking ID:', bookingId);

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error(`Booking not found: ${bookingId}`);
    }

    console.log('✅ Found booking:', {
      id: booking._id.toString(),
      paymentStatus: booking.paymentStatus,
      paymentType: booking.paymentType,
      price: booking.price
    });

    // Determine payment type and update logic
    const isBalancePayment = booking.paymentStatus === 'deposit_paid';
    const isDeposit = booking.paymentType === 'deposit' && booking.paymentStatus === 'pending';
    
    let amountPaid = 0;
    let paymentStatus = '';
    let paymentType = '';

    if (isBalancePayment) {
      // Balance payment - pay remaining amount
      amountPaid = booking.price; // Full amount for balance payment
      paymentStatus = 'paid';
      paymentType = 'full';
    } else if (isDeposit) {
      // Deposit payment
      amountPaid = 20;
      paymentStatus = 'deposit_paid';
      paymentType = 'deposit';
    } else {
      // Full payment
      amountPaid = booking.price;
      paymentStatus = 'paid';
      paymentType = 'full';
    }

    console.log('💰 Payment processing:', {
      isBalancePayment,
      isDeposit,
      amountPaid,
      paymentStatus,
      paymentType
    });

    // Create payment history
    const paymentHistory = new PaymentHistory({
      bookingId: bookingId,
      customerEmail: booking.email,
      serviceName: booking.serviceName,
      totalAmount: booking.price,
      paymentType: paymentType,
      depositAmount: isDeposit ? 20 : 0,
      amountDue: isDeposit ? booking.price - 20 : 0,
      amountPaid: amountPaid,
      currency: 'USD',
      paymentMethodType: "card",
      paymentMethod: "credit_card",
      paymentStatus: paymentStatus,
      squarePaymentId: payment.id,
      squareOrderId: orderId,
      receiptUrl: payment.receipt_url || null,
      paidAt: new Date(),
      paymentConfirmedAt: new Date(),
      customerName: `${booking.firstName || ''} ${booking.lastName || ''}`.trim(),
      customerPhone: booking.phone,
      serviceTime: booking.startTime,
      serviceDuration: booking.durationHours,
      serviceLocation: booking.location,
      numberOfStaff: booking.numberOfStaff,
      notes: isBalancePayment 
        ? 'Balance payment completed' 
        : isDeposit 
          ? 'Deposit payment received' 
          : 'Full payment completed',
      isActive: true,
      adminVerified: false,
    });

    await paymentHistory.save();
    console.log('✅ Payment history created');

    // Update booking
    const updateData = {
      paymentStatus: paymentStatus,
      paymentType: paymentType,
      squarePaymentId: payment.id,
      squareOrderId: orderId,
      receiptUrl: payment.receipt_url || null,
      paidAt: new Date(),
      amountPaid: amountPaid,
      amountDue: isDeposit ? booking.price - 20 : 0,
      depositAmount: isDeposit ? 20 : 0,
      status: paymentStatus === 'paid' ? 'confirmed' : 'deposit_paid',
      updatedAt: new Date(),
    };

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    );

    if (!updatedBooking) {
      throw new Error(`Booking update failed for ID: ${bookingId}`);
    }

    console.log('✅✅✅ BOOKING UPDATED SUCCESSFULLY');

    // Update user service count for full payments
    if (paymentStatus === 'paid') {
      await User.updateOne(
        { email: booking.email },
        {
          $inc: { serviceTaken: 1 },
          $set: { lastServiceDate: new Date() },
        }
      );
      console.log('👤 User service count updated');
    }

    // Send confirmation email
    await sendPaymentConfirmationEmail(paymentHistory, {
      isBalancePayment,
      isDeposit
    });

    console.log(`🎉🎉🎉 SUCCESSFULLY PROCESSED PAYMENT FOR BOOKING: ${bookingId}`);

    return {
      success: true,
      bookingId: bookingId,
      paymentHistoryId: paymentHistory._id.toString(),
    };

  } catch (error) {
    console.error('❌❌❌ ERROR IN PAYMENT PROCESSING:', error.message);
    throw error;
  }
};

// ==================== SEND PAYMENT CONFIRMATION EMAIL ====================
const sendPaymentConfirmationEmail = async (paymentHistory, options) => {
  try {
    const { isBalancePayment, isDeposit } = options;

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

  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
  }
};

// ==================== HANDLE FAILED PAYMENT ====================
const handleFailedPayment = async (payment) => {
  try {
    console.log('❌ Processing failed payment:', payment.id);

    const orderId = payment.orderId || payment.order_id;
    
    if (orderId) {
      try {
        const orderResponse = await ordersApi.retrieveOrder(orderId);
        const metadata = orderResponse.result.order.metadata || {};
        let bookingId = metadata.bid;

        // If no metadata, try database mapping
        if (!bookingId) {
          const mapping = await OrderMapping.findOne({ squareOrderId: orderId });
          if (mapping) {
            bookingId = mapping.bookingId.toString();
          }
        }

        if (bookingId) {
          console.log(`❌ Processing failed payment for booking: ${bookingId}`);
          await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: 'failed',
            updatedAt: new Date(),
          });
          console.log(`✅ Booking marked as failed: ${bookingId}`);
        }
      } catch (orderError) {
        console.error('❌ Error retrieving order for failed payment:', orderError.message);
      }
    }

  } catch (error) {
    console.error('❌ Error handling failed payment:', error);
  }
};

// ==================== VERIFY PAYMENT ====================
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    if (!paymentId && !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Either paymentId or orderId is required',
      });
    }

    let payment;
    if (paymentId) {
      const paymentResponse = await paymentsApi.getPayment(paymentId);
      payment = paymentResponse.result.payment;
    } else {
      const orderResponse = await ordersApi.retrieveOrder(orderId);
      const paymentsResponse = await paymentsApi.listPayments(undefined, undefined, undefined, undefined, orderId);
      payment = paymentsResponse.result.payments?.[0];
    }

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    const orderResponse = await ordersApi.retrieveOrder(payment.orderId);
    const metadata = orderResponse.result.order.metadata || {};
    const booking = await Booking.findById(metadata.bid);

    res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amountMoney?.amount / 100,
        currency: payment.amountMoney?.currency,
        orderId: payment.orderId,
        receiptUrl: payment.receiptUrl,
        createdAt: payment.createdAt,
      },
      booking: booking ? {
        id: booking._id,
        paymentStatus: booking.paymentStatus,
        serviceName: booking.serviceName,
        price: booking.price,
      } : null,
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message,
    });
  }
};

// ==================== PAYMENT HISTORY FUNCTIONS ====================
export const allPaymentHistory = async (req, res) => {
  try {
    const skip = req.query.skip;
    const limit = req.query.limit;
    const payments = await PaymentHistory.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('butler.id');
    const paymentsCount = await PaymentHistory.countDocuments();
    res.status(200).json({
      message: "Success",
      data: payments,
      count: paymentsCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Something went wrong!',
      error,
    });
  }
};

export const paymentHistoryForCustomer = async (req, res) => {
  try {
    const email = req.params.email;
    const skip = req.query.skip;
    const limit = req.query.limit;
    const history = await PaymentHistory.find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const historyCount = await PaymentHistory.countDocuments({ customerEmail: email });
    const paidPayments = await PaymentHistory.find({
      customerEmail: email,
      paymentStatus: 'paid',
    }).select('amountPaid');

    const totalOutGoing = paidPayments.reduce((sum, payment) => {
      return sum + (payment.amountPaid || 0);
    }, 0);

    res.status(200).json({
      message: "Success",
      data: history,
      count: historyCount,
      totalOutGoing,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

export const paymentHistoryForButler = async(req, res) => {
  try {
    const id = req.params.id;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;

    const history = await PaymentHistory.find({ 
      "butler.id": id 
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const historyCount = await PaymentHistory.countDocuments({ 
      "butler.id": id 
    });

    res.status(200).json({
      message: "Success",
      data: history,
      count: historyCount,
    });
    
  } catch (error) {
    console.log("Error in paymentHistoryForButler:", error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message
    });
  }
};