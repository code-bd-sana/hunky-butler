import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Square SDK ইম্পোর্ট
const { Client, Environment } = require('square');
const crypto = require('crypto');

import nodemailer from 'nodemailer';
import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import { storeNotification } from '../utils/utils.js';
import PaymentHistory from '../models/payment.model.js';
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

// Environment variables চেক
if (!process.env.SQUARE_ACCESS_TOKEN) {
  console.error('❌ SQUARE_ACCESS_TOKEN environment variable is missing');
  throw new Error('SQUARE_ACCESS_TOKEN is required');
}

if (!process.env.SQUARE_LOCATION_ID) {
  console.error('❌ SQUARE_LOCATION_ID environment variable is missing');
  throw new Error('SQUARE_LOCATION_ID is required');
}

console.log('✅ Environment variables check passed');

// Square client initialization
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox
});

console.log('✅ Square client initialized successfully');

// API instances
const { paymentsApi, ordersApi, checkoutApi, locationsApi } = squareClient;

// Verify APIs are properly initialized
console.log('Orders API available:', !!ordersApi);
console.log('Payments API available:', !!paymentsApi);
console.log('Checkout API available:', !!checkoutApi);

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

// Utility function for error handling
const handleSquareError = (error, context) => {
  console.error(`❌ Square Error in ${context}:`, {
    message: error.message,
    status: error.statusCode,
    errors: error.errors,
    stack: error.stack
  });
  
  return {
    success: false,
    message: `Square API error in ${context}`,
    error: error.message,
    details: error.errors
  };
};

// Create Square Payment Link for Existing Booking - COMPLETELY FIXED
export const createCheckoutSessionExistngBooking = async (req, res) => {
  try {
    const { id, successUrl, cancelUrl } = req.body;

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

    console.log('🔄 Processing existing booking:', savedBooking._id);
    console.log('📊 Current payment status:', savedBooking.paymentStatus);

    const price = savedBooking?.paymentStatus === 'deposit_paid' 
      ? savedBooking.price - 20 
      : savedBooking?.price;

    // Use the correct location ID
    const validLocationId = process.env.SQUARE_LOCATION_ID;

    // Create SIMPLE line items
    const simpleLineItems = [
      {
        name: `${savedBooking.serviceName} Service - Balance Payment`,
        quantity: '1',
        basePriceMoney: {
          amount: Math.round(price * 100), // Convert to cents
          currency: 'USD',
        },
        note: `Balance payment for butler service - ${savedBooking.durationHours} hours with ${savedBooking.numberOfStaff} staff members`,
      }
    ];

    // Convert date to string for Square metadata
    const serviceDateString = savedBooking.dateOfEvent 
      ? new Date(savedBooking.dateOfEvent).toISOString().split('T')[0]
      : '';

    // Create Square Order with proper metadata
    const orderResponse = await ordersApi.createOrder({
      order: {
        locationId: validLocationId,
        lineItems: simpleLineItems,
        metadata: {
          // Essential fields only (max 10) - ALL MUST BE STRINGS
          bookingId: savedBooking._id.toString(),
          customerEmail: savedBooking.email || '',
          customerName: `${savedBooking?.firstName || ''} ${savedBooking?.lastName || ''}`.trim(),
          serviceName: savedBooking.serviceName || '',
          totalAmount: savedBooking.price.toString(), // Original total amount
          paymentType: 'balance',
          amountDue: price.toString(), // Current amount due
          serviceDate: serviceDateString,
          serviceTime: savedBooking.startTime || '',
          serviceDuration: `${savedBooking.durationHours || ''}h`,
        },
      },
      idempotencyKey: crypto.randomUUID(),
    });

    console.log('✅ Square order created:', orderResponse.result.order.id);

    // Create Square Payment Link
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

    console.log('✅ Square payment link created for existing booking:', paymentLinkResponse.result.paymentLink.id);

    res.status(200).json({
      success: true,
      paymentLinkId: paymentLinkResponse.result.paymentLink.id,
      checkoutUrl: paymentLinkResponse.result.paymentLink.url,
      orderId: orderResponse.result.order.id,
      bookingId: savedBooking._id,
      message: 'Payment link created successfully',
    });

  } catch (error) {
    console.error('❌ Error creating payment link for existing booking:', error);
    
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`Square Error: ${err.code} - ${err.detail}`);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating payment link',
      error: error.message,
      details: error.errors
    });
  }
};

// Create Square Payment Link for New Booking - COMPLETELY FIXED
export const createCheckoutSession = async (req, res) => {
  try {
    const { bookingData, successUrl, cancelUrl, paymentType = 'full' } = req.body;

    console.log('🔄 Creating payment link for booking data:', bookingData);
    console.log('💰 Payment type:', paymentType);

    if (!bookingData || !successUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingData, successUrl',
      });
    }

    // Use the correct location ID from environment
    const validLocationId = process.env.SQUARE_LOCATION_ID;
    console.log('📍 Using location ID:', validLocationId);

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
    const amountDue = isDeposit ? totalAmount - depositAmount : 0;

    console.log('💳 Payment calculation:', {
      totalAmount,
      depositAmount,
      amountToCharge,
      amountDue,
      isDeposit
    });

    // Create booking first
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
      createdAt: new Date(),
    });

    const savedBooking = await newBooking.save();
    console.log('✅ Booking created with ID:', savedBooking._id);
    console.log('📊 Booking payment status:', savedBooking.paymentStatus);

    // Create SIMPLE line items
    const simpleLineItems = [
      {
        name: isDeposit 
          ? `${bookingData.serviceName} Service - Deposit` 
          : `${bookingData.serviceName} Service Booking`,
        quantity: '1',
        basePriceMoney: {
          amount: Math.round(amountToCharge * 100), // Convert to cents
          currency: 'USD',
        },
        note: isDeposit
          ? `Deposit for ${bookingData.durationHours} hours with ${bookingData.numberOfStaff} staff members (Balance: $${amountDue})`
          : `Butler service for ${bookingData.durationHours} hours with ${bookingData.numberOfStaff} staff members`,
      }
    ];

    // Convert date to string for Square metadata
    const serviceDateString = bookingData.dateOfEvent 
      ? new Date(bookingData.dateOfEvent).toISOString().split('T')[0]
      : '';

    // Create Square Order
    const orderResponse = await ordersApi.createOrder({
      order: {
        locationId: validLocationId,
        lineItems: simpleLineItems,
        metadata: {
          // Essential fields only (max 10) - ALL MUST BE STRINGS
          bookingId: savedBooking._id.toString(),
          customerEmail: bookingData.email || '',
          customerName: `${bookingData.firstName || ''} ${bookingData?.lastName || ''}`.trim(),
          serviceName: bookingData.serviceName || '',
          totalAmount: totalAmount.toString(),
          paymentType: paymentType,
          depositAmount: depositAmount.toString(),
          amountDue: amountDue.toString(),
          serviceDate: serviceDateString,
          serviceTime: bookingData.startTime || '',
     
        },
      },
      idempotencyKey: crypto.randomUUID(),
    });

    console.log('✅ Square order created:', orderResponse.result.order.id);

    // Create Square Payment Link
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

    console.log('✅ Square payment link created:', paymentLinkResponse.result.paymentLink.id);

    res.status(200).json({
      success: true,
      paymentLinkId: paymentLinkResponse.result.paymentLink.id,
      checkoutUrl: paymentLinkResponse.result.paymentLink.url,
      orderId: orderResponse.result.order.id,
      bookingId: savedBooking._id,
      paymentType: paymentType,
      amountCharged: amountToCharge,
      amountDue: amountDue,
      message: 'Payment link created successfully',
    });

  } catch (error) {
    console.error('❌ Error creating payment link:', error);
    
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`Square Error: ${err.code} - ${err.detail}`);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating payment link',
      error: error.message,
      details: error.errors
    });
  }
};

// Handle Square Webhook - COMPLETELY FIXED
export const handleSquareWebhook = async (req, res) => {
  console.log('🔔 Webhook received - Headers:', req.headers);
  console.log('🔔 Webhook received - Body:', JSON.stringify(req.body, null, 2));

  const signature = req.headers['x-square-hmac-sha256'];
  const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  try {
    // Verify webhook signature
    if (webhookSignatureKey && signature) {
      const hmac = crypto.createHmac('sha256', webhookSignatureKey);
      const payload = JSON.stringify(req.body);
      hmac.update(payload);
      const hash = hmac.digest('base64');

      if (hash !== signature) {
        console.log('❌ Webhook signature verification failed');
        console.log('Expected:', hash);
        console.log('Received:', signature);
        return res.status(401).send('Unauthorized');
      }
      console.log('✅ Webhook signature verified');
    }

    const event = req.body;
    console.log('🎯 Processing event type:', event.type);

    switch (event.type) {
      case 'payment.updated':
        console.log('💰 Payment updated event received');
        const paymentStatus = event.data?.object?.payment?.status;
        console.log('📊 Payment status:', paymentStatus);
        
        if (paymentStatus === 'COMPLETED') {
          console.log('✅ Processing COMPLETED payment');
          await handleSuccessfulPayment(event.data.object.payment);
        } else if (paymentStatus === 'FAILED') {
          console.log('❌ Processing FAILED payment');
          await handleFailedPayment(event.data.object.payment);
        } else {
          console.log('ℹ️ Other payment status:', paymentStatus);
        }
        break;

      case 'payment_link.updated':
        console.log('🔗 Payment link updated:', event.data?.object?.paymentLink?.id);
        break;

      default:
        console.log(`📢 Unhandled event type: ${event.type}`);
    }

    res.json({ received: true, handled: true, eventType: event.type });

  } catch (error) {
    console.error('❌ Error handling webhook event:', error);
    
    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: "rakib.fbinternational@gmail.com",
      subject: "❌ Webhook Processing Error",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff; border: 2px solid #f44336; border-radius: 8px;">
          <h2 style="color: #f44336;">Webhook Processing Error</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Event Type:</strong> ${event?.type}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    res.status(500).json({
      received: true,
      handled: false,
      error: error.message,
    });
  }
};

// Handle successful payment - COMPLETELY FIXED
const handleSuccessfulPayment = async (payment) => {
  try {
    console.log('🔄 Starting payment processing for:', payment.id);
    console.log('📋 Payment details:', {
      id: payment.id,
      orderId: payment.orderId,
      status: payment.status,
      amount: payment.amountMoney?.amount ? payment.amountMoney.amount / 100 : 0,
      currency: payment.amountMoney?.currency
    });
    
    if (!payment.orderId) {
      throw new Error('No order ID found in payment');
    }

    // Retrieve order details
    const orderResponse = await ordersApi.retrieveOrder(payment.orderId);
    const metadata = orderResponse.result.order.metadata || {};

    console.log('📋 Order metadata:', metadata);

    const bookingId = metadata.bookingId;
    const customerEmail = metadata.customerEmail;
    const serviceName = metadata.serviceName;
    const totalAmount = parseFloat(metadata.totalAmount || '0');
    const paymentType = metadata.paymentType || 'full';
    const isDeposit = paymentType === 'deposit';
    const isBalancePayment = paymentType === 'balance';

    console.log('🔍 Payment analysis:', {
      bookingId,
      paymentType,
      isDeposit,
      isBalancePayment,
      totalAmount
    });

    if (!bookingId) {
      throw new Error('Missing bookingId in order metadata');
    }

    let paymentHistory;
    let updatedBooking;

    if (isBalancePayment) {
      console.log('💵 Processing BALANCE payment');

      // Find existing payment history for this booking
      paymentHistory = await PaymentHistory.findOne({ bookingId: bookingId });
      if (!paymentHistory) {
        throw new Error(`Payment history not found for booking: ${bookingId}`);
      }

      // Update payment history for balance payment
      paymentHistory.amountPaid = totalAmount;
      paymentHistory.amountDue = 0;
      paymentHistory.paymentStatus = 'paid';
      paymentHistory.paymentType = 'full';
      paymentHistory.squarePaymentId = payment.id;
      paymentHistory.paymentConfirmedAt = new Date();
      paymentHistory.receiptUrl = payment.receiptUrl || null;
      paymentHistory.notes = `Balance payment completed. Total amount: $${totalAmount}`;

      await paymentHistory.save();
      console.log('✅ Payment history updated for balance payment');

      // Update booking
      updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paid: 'paid',
          paymentStatus: 'paid',
          paymentType: 'full',
          amountPaid: totalAmount,
          amountDue: 0,
          paymentConfirmedAt: new Date(),
          status: 'confirmed',
          updatedAt: new Date(),
        },
        { new: true }
      );

    } else {
      console.log(isDeposit ? '💰 Processing DEPOSIT payment' : '💳 Processing FULL payment');

      const firstName = metadata.firstName || '';
      const lastName = metadata.lastName || '';
      const phone = metadata.phone || '';
      const serviceDate = metadata.serviceDate || '';
      const serviceTime = metadata.serviceTime || '';
      const serviceDuration = metadata.serviceDuration || '';
      const numberOfStaff = metadata.numberOfStaff || '1';

      const depositAmount = parseFloat(metadata.depositAmount || '0');
      const amountDue = parseFloat(metadata.amountDue || '0');
      const amountPaid = isDeposit ? depositAmount : totalAmount;
      const paymentStatus = isDeposit ? 'deposit_paid' : 'paid';

      console.log('💰 Payment calculation:', {
        isDeposit,
        totalAmount,
        depositAmount,
        amountPaid,
        amountDue,
        paymentStatus,
      });

      // Create new payment history
      paymentHistory = new PaymentHistory({
        bookingId: bookingId,
        customerEmail: customerEmail,
        serviceName: serviceName,
        totalAmount: totalAmount,
        paymentType: paymentType,
        depositAmount: isDeposit ? depositAmount : 0,
        amountDue: amountDue,
        amountPaid: amountPaid,
        currency: 'USD',
        paymentMethodType: "card",
        paymentMethod: "credit_card",
        paymentStatus: paymentStatus,
        squarePaymentId: payment.id,
        squareOrderId: payment.orderId,
        receiptUrl: payment.receiptUrl || null,
        paidAt: new Date(),
        paymentConfirmedAt: new Date(),
        customerName: `${firstName} ${lastName}`.trim(),
        customerPhone: phone,
        serviceTime: serviceTime,
        serviceDuration: serviceDuration,
        serviceLocation: metadata.location || '',
        numberOfStaff: parseInt(numberOfStaff) || 1,
        taxAmount: 0,
        discountAmount: 0,
        serviceFee: 0,
        notes: isDeposit
          ? `Deposit payment of $${depositAmount} received. Balance due: $${amountDue}`
          : "Full payment processed successfully via Square",
        isActive: true,
        adminVerified: false,
      });

      await paymentHistory.save();
      console.log('✅ New payment history created');

      // Update booking
      const updateData = {
        paid: paymentStatus,
        paymentStatus: paymentStatus,
        paymentType: paymentType,
        squarePaymentId: payment.id,
        squareOrderId: payment.orderId,
        receiptUrl: payment.receiptUrl || null,
        paidAt: new Date(),
        amountPaid: amountPaid,
        amountDue: amountDue,
        depositAmount: isDeposit ? depositAmount : 0,
        currency: 'USD',
        paymentMethod: 'card',
        status: isDeposit ? 'deposit_paid' : 'confirmed',
        updatedAt: new Date(),
      };

      updatedBooking = await Booking.findOneAndUpdate(
        { _id: bookingId },
        { $set: updateData },
        { new: true }
      );
    }

    if (!updatedBooking) {
      throw new Error(`Booking not found with ID: ${bookingId}`);
    }

    console.log('✅ Booking updated successfully:', {
      bookingId: updatedBooking._id,
      paymentType: updatedBooking.paymentType,
      paymentStatus: updatedBooking.paymentStatus,
      amountPaid: updatedBooking.amountPaid,
      amountDue: updatedBooking.amountDue,
      paid: updatedBooking.paid
    });

    // Update user service count for full payments
    if (!isDeposit && !isBalancePayment) {
      await User.updateOne(
        { email: customerEmail },
        {
          $inc: { serviceTaken: 1 },
          $set: { lastServiceDate: new Date() },
        }
      );
      console.log('👤 User service count updated');
    }

    // Send confirmation email
    await sendPaymentConfirmationEmail(payment, paymentHistory, metadata);

    console.log(`🎉 Successfully processed ${isBalancePayment ? 'balance' : paymentType} payment for booking: ${bookingId}`);

    return {
      success: true,
      bookingId: bookingId,
      paymentHistoryId: paymentHistory._id,
      receiptUrl: paymentHistory.receiptUrl,
      amount: paymentHistory.amountPaid,
      paymentType: paymentType,
      isDeposit: isDeposit,
    };

  } catch (error) {
    console.error('❌ Error handling successful payment:', error);
    
    await transporter.sendMail({
      from: '"Hunky Butler Service" <bannah76769@gmail.com>',
      to: "rakib.fbinternational@gmail.com",
      subject: "❌ Payment Processing Error",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff; border: 2px solid #f44336; border-radius: 8px;">
          <h2 style="color: #f44336;">Payment Processing Error</h2>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Payment ID:</strong> ${payment?.id}</p>
          <p><strong>Order ID:</strong> ${payment?.orderId}</p>
          <p><strong>Amount:</strong> ${payment?.amountMoney ? (payment.amountMoney.amount / 100) : 'N/A'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    throw error;
  }
};

// Send payment confirmation email
const sendPaymentConfirmationEmail = async (payment, paymentHistory, metadata) => {
  try {
    const isDeposit = paymentHistory.paymentType === 'deposit';
    const isBalancePayment = metadata.paymentType === 'balance';

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

// Handle failed payment
const handleFailedPayment = async (payment) => {
  try {
    console.log('❌ Processing failed payment:', payment.id);

    const orderResponse = await ordersApi.retrieveOrder(payment.orderId);
    const metadata = orderResponse.result.order.metadata || {};
    const bookingId = metadata.bookingId;

    console.log(`Processing failed payment for booking: ${bookingId}`);

    await Booking.findByIdAndUpdate(bookingId, {
      $set: {
        paymentStatus: 'failed',
        updatedAt: new Date(),
      },
    });

    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #f44336; border-radius: 12px;">
        <h1 style="color: #f44336;">Payment Failed</h1>
        <p style="font-size:16px; margin:20px 0;">
          We encountered an issue processing your payment for <strong>${metadata.serviceName}</strong>.
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
      subject: "Payment Failed",
      html: customerEmailHtml,
    });

    console.log(`✅ Successfully handled failed payment for booking ${bookingId}`);

  } catch (error) {
    console.error('❌ Error handling failed payment:', error);
    throw error;
  }
};

// Test webhook manually
export const testWebhookManually = async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    // Get payment details
    const paymentResponse = await paymentsApi.getPayment(paymentId);
    const payment = paymentResponse.result.payment;

    console.log('🧪 Manual webhook test for payment:', paymentId);
    console.log('Payment status:', payment.status);

    if (payment.status === 'COMPLETED') {
      await handleSuccessfulPayment(payment);
      return res.json({
        success: true,
        message: 'Payment processed successfully',
        paymentId: payment.id
      });
    } else {
      return res.json({
        success: false,
        message: `Payment status is ${payment.status}, not COMPLETED`
      });
    }

  } catch (error) {
    console.error('❌ Manual webhook test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Manual webhook test failed',
      error: error.message
    });
  }
};

// Verify payment status
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
      const order = orderResponse.result.order;
      
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

    const booking = await Booking.findById(metadata.bookingId);

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
        paid: booking.paid,
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

// Get Square locations
export const getSquareLocations = async (req, res) => {
  try {
    const { locationsApi } = squareClient;
    const result = await locationsApi.listLocations();
    
    console.log('Available Square Locations:');
    result.result.locations.forEach(location => {
      console.log('📍 Location:', {
        id: location.id,
        name: location.name,
        address: location.address,
        status: location.status,
        capabilities: location.capabilities
      });
    });

    res.status(200).json({
      success: true,
      locations: result.result.locations
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message
    });
  }
};

// Other existing functions remain the same...
export const allPaymentHistory = async (req, res) => {
  try {
    const skip = req.query.skip;
    const limit = req.query.limit;
    const payments = await PaymentHistory.find().sort({createdAt: -1}).skip(skip).limit(limit).populate('butler');
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

export const paymentHistoryForButler = async (req, res) => {
  try {
    const id = req.params.id;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;

    const history = await PaymentHistory.find({
      "butler.id": new mongoose.Types.ObjectId(id),
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const historyCount = await PaymentHistory.countDocuments({
      "butler.id": new mongoose.Types.ObjectId(id),
    });

    const totalEarningsResult = await Booking.aggregate([
      {
        $match: {
          "butler.id": new mongoose.Types.ObjectId(id),
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$butlerFee" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalAmount : 0;
    const totalTransactions = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalTransactions : 0;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyEarningsResult = await Booking.aggregate([
      {
        $match: {
          "butler.id": new mongoose.Types.ObjectId(id),
          status: 'completed',
          updatedAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: null,
          weeklyAmount: { $sum: "$butlerFee" },
          weeklyTransactions: { $sum: 1 },
        },
      },
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
          updatedAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          monthlyAmount: { $sum: "$butlerFee" },
          monthlyTransactions: { $sum: 1 },
        },
      },
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
          transactions: totalTransactions,
        },
        weekly: {
          amount: weeklyEarnings,
          transactions: weeklyTransactions,
        },
        monthly: {
          amount: monthlyEarnings,
          transactions: monthlyTransactions,
        },
      },
      currentPage: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(historyCount / limit),
    });
  } catch (error) {
    console.log("Error in paymentHistoryForButler:", error);
    res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};