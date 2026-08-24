import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Client, Environment } = require('square');
const crypto = require('crypto');

import Booking from '../models/booking.model.js';
import User from '../models/user.model.js';
import PaymentHistory from '../models/payment.model.js';
import OrderMapping from '../models/OrderMapping.model.js'; 
import dotenv from "dotenv";
import { sendNotification } from '../utils/notification.js';

dotenv.config();

// Square client initialization
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'sandbox' || process.env.SQUARE_APPLICATION_ID?.startsWith('sandbox-') 
    ? Environment.Sandbox 
    : Environment.Production
});

console.log('✅ Square client initialized in', (process.env.SQUARE_ENVIRONMENT === 'sandbox' || process.env.SQUARE_APPLICATION_ID?.startsWith('sandbox-')) ? 'Sandbox' : 'Production', 'mode');

// API instances
const { paymentsApi, ordersApi, checkoutApi } = squareClient;

// ==================== CREATE PAYMENT LINK FOR EXISTING BOOKING ====================
export const createCheckoutSessionExistngBooking = async (req, res) => {
  try {
    const { id, successUrl, paymentType } = req.body;

    console.log('🔄 Creating payment link for existing booking:', id);
    console.log('💰 Requested payment type:', paymentType);

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

    let price = savedBooking.price;
    const isDepositAlreadyPaid = ['deposit_paid', 'DEPOSIT_PAID', 'PARTIALLY_PAID'].includes(savedBooking.paymentStatus);

    if (isDepositAlreadyPaid) {
      price = savedBooking.amountDue !== undefined ? savedBooking.amountDue : (savedBooking.price - 20);
    } else {
      const requestedType = paymentType || savedBooking.paymentType || 'full';
      if (requestedType === 'deposit' || requestedType === 'DEPOSIT') {
        price = 20;
        savedBooking.paymentType = 'DEPOSIT';
        savedBooking.depositAmount = 20;
        savedBooking.amountDue = savedBooking.price;
        savedBooking.remainingBalance = savedBooking.price;
        savedBooking.totalAmount = savedBooking.price;
      } else {
        price = savedBooking.price;
        savedBooking.paymentType = 'FULL_PAYMENT';
        savedBooking.depositAmount = 0;
        savedBooking.amountDue = savedBooking.price;
        savedBooking.remainingBalance = savedBooking.price;
        savedBooking.totalAmount = savedBooking.price;
      }
      await savedBooking.save();
      console.log('✅ Updated booking payment options in DB:', savedBooking._id.toString());
    }

    // Check if Square keys are placeholders (e.g. test mode on without keys)
    const isPlaceholder = !process.env.SQUARE_ACCESS_TOKEN ||
                          process.env.SQUARE_ACCESS_TOKEN.includes('your_sandbox_access_token') ||
                          process.env.SQUARE_LOCATION_ID?.includes('your_location_id');

    if (isPlaceholder) {
      console.log('⚠️ Using mock checkout link because Square Sandbox credentials are placeholders');
      const protocol = req.secure ? 'https' : 'http';
      const host = req.get('host');
      const backendUrl = `${protocol}://${host}`;
      const mockCheckoutUrl = `${backendUrl}/api/payment/mock-pay-success?bookingId=${savedBooking._id}&amount=${price}&paymentType=${savedBooking.paymentType}`;
      
      return res.status(200).json({
        success: true,
        paymentLinkId: 'mock_link_id_' + Date.now(),
        checkoutUrl: mockCheckoutUrl,
        message: 'Mock payment link created (using placeholders)',
      });
    }

    const validLocationId = process.env.SQUARE_LOCATION_ID;
    if (!validLocationId) {
      return res.status(500).json({
        success: false,
        message: 'Square location ID not configured'
      });
    }

    console.log('💰 Amount to charge:', price);

    const lineItems = [
      {
        name: isDepositAlreadyPaid 
          ? `${savedBooking.serviceName} Service - Balance Payment`
          : (savedBooking.paymentType === 'DEPOSIT' ? `${savedBooking.serviceName} Service - Deposit` : `${savedBooking.serviceName} Service Booking`),
        quantity: '1',
        basePriceMoney: {
          amount: Math.round(price * 100),
          currency: process.env.SQUARE_CURRENCY || 'GBP',
        },
        note: savedBooking._id.toString()
      }
    ];

    // Create Payment Link
    const paymentLinkResponse = await checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: validLocationId,
        lineItems: lineItems,
        referenceId: savedBooking._id.toString()
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

    console.log('✅ Payment link created successfully');

    res.status(200).json({
      success: true,
      paymentLinkId: paymentLinkResponse.result.paymentLink.id,
      checkoutUrl: paymentLinkResponse.result.paymentLink.url,
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
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bookingData, successUrl',
      });
    }

    const validLocationId = process.env.SQUARE_LOCATION_ID;
    if (!validLocationId) {
      console.log('❌ Square location ID not configured');
      return res.status(500).json({
        success: false,
        message: 'Square location ID not configured'
      });
    }

    const totalAmount = Number(bookingData.price);
    const depositAmount = 20;
    const isDeposit = paymentType === 'deposit';
    const amountToCharge = isDeposit ? depositAmount : totalAmount;

    console.log(`📊 Price: ${totalAmount}, Charging: ${amountToCharge}`);

    // Create booking first
    const newBooking = new Booking({
      ...bookingData,
      paymentType: paymentType,
      depositAmount: isDeposit ? depositAmount : 0,
      amountDue: totalAmount,
      remainingBalance: totalAmount,
      amountPaid: 0, 
      paymentStatus: 'pending',
      totalAmount: totalAmount,
      status: 'ongoing',
      paid: 'unpaid'
    });

    const savedBooking = await newBooking.save();
    console.log('✅ Booking created with ID:', savedBooking._id.toString());

    // SEND IMMEDIATE NOTIFICATION (Booking Received - Action Required)
    try {
      const immediateHtml = `
        <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
          <h1 style="color: #ff1673;">Booking Received! 🥂</h1>
          <p style="font-size:16px; margin:20px 0;">
            Hello ${bookingData.firstName}, we have received your booking for <strong>${bookingData.serviceName}</strong>.
          </p>
          <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; border-left: 4px solid #ff1673;">
            <p><strong>Service:</strong> ${bookingData.serviceName}</p>
            <p><strong>Total Price:</strong> £${totalAmount}</p>
            <p><strong>Payment Chosen:</strong> ${paymentType === 'deposit' ? 'Deposit (£20)' : 'Full Payment (£' + totalAmount + ')'}</p>
          </div>
          <p style="font-size:16px; color: #e11d48; font-weight: bold;">
            Action Required: Please complete your payment to secure your booking.
          </p>
          <p>If you haven't finished the checkout process, you can do so now using the button below:</p>
          <p style="margin-top: 25px;">
            <a href="https://www.hunkybutlerservice.co.uk/dashboard" style="background-color: #ff1673; color: white; padding: 14px 30px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">Complete Your Payment</a>
          </p>
        </div>
      `;

      await sendNotification({
        email: bookingData.email,
        phone: bookingData.phone,
        subject: "Booking Received - Complete Your Payment",
        message: `Hello ${bookingData.firstName}, we received your booking for ${bookingData.serviceName}. Please complete your payment at: https://www.hunkybutlerservice.co.uk/dashboard`,
        html: immediateHtml
      });
      console.log('✅ Immediate "Booking Received" notification sent');
    } catch (notifError) {
      console.error('⚠️ Failed to send immediate notification:', notifError.message);
    }

    // Check if Square keys are placeholders (e.g. test mode on without keys)
    const isPlaceholder = !process.env.SQUARE_ACCESS_TOKEN ||
                          process.env.SQUARE_ACCESS_TOKEN.includes('your_sandbox_access_token') ||
                          process.env.SQUARE_LOCATION_ID?.includes('your_location_id');

    if (isPlaceholder) {
      console.log('⚠️ Using mock checkout link because Square Sandbox credentials are placeholders');
      const protocol = req.secure ? 'https' : 'http';
      const host = req.get('host');
      const backendUrl = `${protocol}://${host}`;
      const mockCheckoutUrl = `${backendUrl}/api/payment/mock-pay-success?bookingId=${savedBooking._id}&amount=${amountToCharge}&paymentType=${savedBooking.paymentType}`;
      
      return res.status(200).json({
        success: true,
        paymentLinkId: 'mock_link_id_' + Date.now(),
        checkoutUrl: mockCheckoutUrl,
        orderId: 'mock_order_' + Date.now(),
        bookingId: savedBooking._id,
        paymentType: paymentType,
        amountCharged: amountToCharge,
        message: 'Mock payment link created (using placeholders)',
      });
    }

    // Simple line items
    const simpleLineItems = [
      {
        name: isDeposit 
          ? `${bookingData.serviceName} Service - Deposit` 
          : `${bookingData.serviceName} Service Booking`,
        quantity: '1',
        basePriceMoney: {
          amount: Math.round(amountToCharge * 100),
          currency: process.env.SQUARE_CURRENCY || 'GBP',
        },
        note: savedBooking._id.toString()
      }
    ];

    // Create Square Order
    const orderResponse = await ordersApi.createOrder({
      order: {
        locationId: validLocationId,
        lineItems: simpleLineItems,
        referenceId: savedBooking._id.toString()
      },
      idempotencyKey: crypto.randomUUID(),
    });

    console.log('✅ Square order created:', orderResponse.result.order.id);

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
    console.log('✅ Order mapping stored');

    // Create Payment Link
    const paymentLinkResponse = await checkoutApi.createPaymentLink({
      idempotencyKey: crypto.randomUUID(),
      order: {
        locationId: validLocationId,
        lineItems: simpleLineItems,
        referenceId: savedBooking._id.toString()
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
      message: 'Payment link created successfully',
    });

  } catch (error) {
    console.error('❌ ERROR IN CREATE CHECKOUT SESSION:', error);
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
  
  // Square sends the signature in this header. The previous value here was
  // 'x-square-hmac-sha256', which is not a header Square sends, so 'signature'
  // was always undefined and the verification below never ran - meaning the
  // endpoint accepted unsigned requests from anyone on the internet.
  const signature = req.headers['x-square-hmacsha256-signature'];
  const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  // Square builds the HMAC from the notification URL concatenated with the raw
  // request body, not from the body on its own. This must match the URL
  // registered in the Square Developer Console exactly.
  const notificationUrl =
    process.env.SQUARE_WEBHOOK_NOTIFICATION_URL ||
    'https://api.hunkybutlerservice.co.uk/api/webhook';

  try {
    if (!webhookSignatureKey) {
      console.error('SQUARE_WEBHOOK_SIGNATURE_KEY is not set - refusing webhook');
      return res.status(500).send('Webhook signature key not configured');
    }

    if (!signature) {
      console.log('Webhook rejected: no signature header present');
      return res.status(401).send('Unauthorized');
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSignatureKey)
      .update(notificationUrl + req.body.toString())
      .digest('base64');

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(signature);

    // Constant-time comparison. timingSafeEqual throws when the buffers differ
    // in length, so that is checked first.
    const signatureValid =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signatureValid) {
      console.log('Webhook signature verification FAILED');
      return res.status(401).send('Unauthorized');
    }

    console.log('Webhook signature verified');

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
const handleSuccessfulPayment = async (payment, passedBookingId = null) => {
  try {
    const orderId = payment.orderId || payment.order_id;
    console.log('🔍 Order ID:', orderId);
    
    if (!orderId) {
      throw new Error('No order ID found in payment');
    }

    let order = {};
    let bookingId = passedBookingId || payment.mockBookingId;

    if (orderId.startsWith('mock_order_')) {
      order = {
        referenceId: bookingId,
        lineItems: [{ note: bookingId }]
      };
    } else {
      // Retrieve order from Square
      console.log('🔍 Retrieving order from Square...');
      const orderResponse = await ordersApi.retrieveOrder(orderId);
      order = orderResponse.result.order;
    }

    console.log('📋 Order lineItems received:', order.lineItems?.[0]);

    if (!bookingId) {
      bookingId = order.referenceId || (order.lineItems && order.lineItems[0]?.note);
    }

    if (!bookingId) {
      console.error('❌ CRITICAL: COULD NOT FIND BOOKING ID AFTER ALL ATTEMPTS');
      throw new Error('Cannot process payment - booking ID not found');
    }

    console.log('🔍 Final booking ID:', bookingId);

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new Error(`Booking not found: ${bookingId}`);
    }

    // Idempotency check: prevent duplicate processing on webhook retries
    const existingPayment = await PaymentHistory.findOne({ squarePaymentId: payment.id });
    if (existingPayment) {
      console.log(`⚠️ Webhook duplicate: Payment ${payment.id} already processed. Skipping.`);
      return {
        success: true,
        bookingId: bookingId,
        paymentHistoryId: existingPayment._id.toString(),
      };
    }

    // Determine payment type and update logic
    const isInitialPending = !booking.paymentStatus || ['pending', 'unpaid'].includes(booking.paymentStatus);
    const isDepositAlreadyPaid = ['deposit_paid', 'DEPOSIT_PAID', 'PARTIALLY_PAID'].includes(booking.paymentStatus);
    
    const amountPaidInCents = Number(payment.amount_money?.amount || payment.amountMoney?.amount || 0);
    const amountPaid = amountPaidInCents / 100;
    
    let newPaymentStatus = '';
    let finalPaymentType = booking.paymentType;

    if (isInitialPending) {
      if (booking.paymentType === 'deposit' || booking.paymentType === 'DEPOSIT') {
        newPaymentStatus = 'DEPOSIT_PAID';
        finalPaymentType = 'DEPOSIT';
      } else {
        newPaymentStatus = 'FULLY_PAID';
        finalPaymentType = 'FULL_PAYMENT';
      }
    } else if (isDepositAlreadyPaid) {
      newPaymentStatus = 'FULLY_PAID';
      finalPaymentType = 'FULL_PAYMENT'; // Now it's fully paid
    } else {
      newPaymentStatus = 'FULLY_PAID';
      finalPaymentType = 'FULL_PAYMENT';
    }

    const calculatedDepositAmount = finalPaymentType === 'DEPOSIT' ? amountPaid : (booking.depositAmount || 0);
    const calculatedAmountDue = finalPaymentType === 'DEPOSIT' ? (booking.price - amountPaid) : 0;

    // Create payment history
    const paymentHistory = new PaymentHistory({
      bookingId: bookingId,
      customerEmail: booking.email,
      serviceName: booking.serviceName,
      totalAmount: booking.price,
      paymentType: finalPaymentType,
      depositAmount: calculatedDepositAmount,
      amountDue: calculatedAmountDue,
      remainingBalance: calculatedAmountDue,
      amountPaid: amountPaid,
      currency: process.env.SQUARE_CURRENCY || 'GBP',
      paymentMethodType: "card",
      paymentMethod: "credit_card",
      paymentStatus: newPaymentStatus,
      squarePaymentId: payment.id,
      squareOrderId: orderId,
      receiptUrl: payment.receipt_url || payment.receiptUrl || null,
      paidAt: new Date(),
      paymentConfirmedAt: new Date(),
      customerName: `${booking.firstName || ''} ${booking.lastName || ''}`.trim(),
      customerPhone: booking.phone,
      serviceTime: booking.startTime,
      serviceDuration: booking.durationHours,
      serviceLocation: booking.location,
      numberOfStaff: booking.numberOfStaff,
      notes: isDepositAlreadyPaid 
        ? 'Balance payment completed' 
        : newPaymentStatus === 'DEPOSIT_PAID'
          ? 'Deposit payment received' 
          : 'Full payment completed',
      isActive: true,
      adminVerified: false,
      butler: booking.butler || [],
    });

    await paymentHistory.save();

    // Update booking
    const updateData = {
      paymentStatus: newPaymentStatus,
      paymentType: finalPaymentType,
      squarePaymentId: payment.id,
      squareOrderId: orderId,
      receiptUrl: payment.receipt_url || payment.receiptUrl || null,
      amountPaid: (booking.amountPaid || 0) + amountPaid,
      amountDue: calculatedAmountDue,
      remainingBalance: calculatedAmountDue,
      depositAmount: calculatedDepositAmount,
      totalAmount: booking.price,
      paid: newPaymentStatus === 'FULLY_PAID' ? 'paid' : 'pending',
    };

    await Booking.findByIdAndUpdate(bookingId, updateData, { new: true });

    // Update user service count for full payments
    if (newPaymentStatus === 'FULLY_PAID') {
      await User.updateOne(
        { email: booking.email },
        {
          $inc: { serviceTaken: 1 },
          $set: { lastServiceDate: new Date() },
        }
      );
    }

    // Send confirmation notification (Email + SMS)
    await sendPaymentConfirmationNotification(paymentHistory, {
      isBalancePayment: isDepositAlreadyPaid,
      isDeposit: newPaymentStatus === 'DEPOSIT_PAID'
    });

    return {
      success: true,
      bookingId: bookingId,
      paymentHistoryId: paymentHistory._id.toString(),
    };

  } catch (error) {
    console.error('❌ ERROR IN PAYMENT PROCESSING:', error.message);
    throw error;
  }
};

// ==================== SEND PAYMENT CONFIRMATION NOTIFICATION ====================
const sendPaymentConfirmationNotification = async (paymentHistory, options) => {
  try {
    const { isBalancePayment, isDeposit } = options;

    let subject, html, smsMsg;

    if (isBalancePayment) {
      subject = `Balance Paid - ${paymentHistory.serviceName} Booking Fully Confirmed!`;
      smsMsg = `Hunky Butler: Balance payment successful! Your booking for ${paymentHistory.serviceName} is now fully confirmed. Thank you!`;
      html = `
        <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
          <h1 style="color: #ff1673;">Final Payment Received! 🎉</h1>
          <p style="font-size:16px; margin:20px 0;">
            Thank you for completing your payment! Your booking for <strong>${paymentHistory.serviceName}</strong> is now fully confirmed and secured.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; border-left: 4px solid #ff1673;">
            <p><strong>Amount Paid:</strong> £${paymentHistory.amountPaid} ${paymentHistory.currency}</p>
            <p><strong>Total Price:</strong> £${paymentHistory.totalAmount}</p>
            <p><strong>Status:</strong> Fully Paid ✅</p>
          </div>
          <p>We look forward to making your event unforgettable!</p>
        </div>
      `;
    } else if (isDeposit) {
      subject = `Deposit Received - ${paymentHistory.serviceName} Booking`;
      smsMsg = `Hunky Butler: Deposit received! Your booking for ${paymentHistory.serviceName} is secured. Please pay the remaining balance of £${paymentHistory.amountDue} before the event.`;
      html = `
        <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
          <h1 style="color: #ff1673;">Deposit Received! 🎉</h1>
          <p style="font-size:16px; margin:20px 0;">
            Thank you for your deposit! Your booking for <strong>${paymentHistory.serviceName}</strong> is temporarily confirmed and your date is secured.
          </p>
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; border-left: 4px solid #ff1673;">
            <p><strong>Deposit Paid:</strong> £${paymentHistory.depositAmount}</p>
            <p style="color: #ff1673; font-size: 18px;"><strong>Remaining Balance: £${paymentHistory.amountDue}</strong></p>
            <p><strong>Status:</strong> Deposit Paid ⚠️</p>
          </div>
          <p>Please ensure the remaining balance is paid before the event to fully confirm your booking.</p>
          <p style="margin-top: 20px;">
            <a href="https://www.hunkybutlerservice.co.uk/dashboard" style="background-color: #ff1673; color: white; padding: 12px 25px; text-decoration: none; border-radius: 9999px; font-weight: bold;">View Your Dashboard</a>
          </p>
        </div>
      `;
    } else {
      subject = `Payment Successful - ${paymentHistory.serviceName} Booking Confirmed!`;
      smsMsg = `Hunky Butler: Full payment successful! Your booking for ${paymentHistory.serviceName} has been fully confirmed.`;
      html = `
        <div style="font-family: Arial, sans-serif; background: #fff; color: #3D3D3D; padding: 30px; text-align: center; border: 2px solid #ff1673; border-radius: 12px;">
          <h1 style="color: #ff1673;">Payment Successful - Booking Confirmed! 🎉</h1>
          <p style="font-size:16px; margin:20px 0;">
            Thank you for your payment! Your booking for <strong>${paymentHistory.serviceName}</strong> has been fully confirmed.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left; border-left: 4px solid #ff1673;">
            <p><strong>Amount Paid:</strong> £${paymentHistory.amountPaid} ${paymentHistory.currency}</p>
            <p><strong>Status:</strong> Fully Paid ✅</p>
          </div>
          <p>We look forward to seeing you at the event!</p>
        </div>
      `;
    }

    await sendNotification({
      email: paymentHistory.customerEmail,
      phone: paymentHistory.customerPhone,
      subject: subject,
      message: smsMsg,
      html: html,
      smsMessage: smsMsg
    });

    console.log(`✅ ${isBalancePayment ? 'Balance' : isDeposit ? 'Deposit' : 'Payment'} confirmation notification sent to: ${paymentHistory.customerEmail}`);

  } catch (error) {
    console.error('❌ Error sending confirmation notification:', error);
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
        let bookingId = orderResponse.result.order.lineItems[0].note;

        if (bookingId) {
          await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: 'failed',
            updatedAt: new Date(),
          });
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
    const order = orderResponse.result.order || {};
    const booking = await Booking.findById(order.lineItems?.[0]?.note);

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
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const payments = await PaymentHistory.find().sort({createdAt: -1}).skip(skip).limit(limit).populate('butler.id');
    const paymentsCount = await PaymentHistory.countDocuments();
    res.status(200).json({
      message: "Success",
      data: payments,
      count: paymentsCount,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!',
      error: error.message,
    });
  }
};

export const paymentHistoryForCustomer = async (req, res) => {
  try {
    const email = req.params.email;

    if (req.user && req.user.role !== "admin") {
      if (req.user.email !== email) {
        return res.status(403).json({
          message: "Forbidden: You can only view your own payment history.",
        });
      }
    }

    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
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

    if (req.user && req.user.role !== "admin") {
      if (req.user.id !== id && req.user._id?.toString() !== id) {
        return res.status(403).json({
          message: "Forbidden: You can only view your own payment history.",
        });
      }
    }

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


// ==================== MOCK PAYMENT SUCCESS FOR SANDBOX PLACEHOLDERS ====================
export const mockPaySuccess = async (req, res) => {
  try {
    const { bookingId, amount, paymentType } = req.query;

    console.log('🔔 SIMULATING SUCCESSFUL CHECKOUT FOR:', bookingId);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    const mockPaymentId = 'mock_pay_' + crypto.randomUUID().substring(0, 8);
    const mockOrderId = 'mock_order_' + crypto.randomUUID().substring(0, 8);

    const mockPaymentPayload = {
      id: mockPaymentId,
      orderId: mockOrderId,
      amountMoney: {
        amount: Math.round(Number(amount) * 100),
        currency: 'GBP'
      }
    };

    await handleSuccessfulPayment(mockPaymentPayload, bookingId);

    // Get the frontend origin URL dynamically
    const referer = req.headers.referer || req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:3000';
    let frontendOrigin = 'http://localhost:3000';
    try {
      if (referer) {
        const parsedUrl = new URL(referer);
        frontendOrigin = parsedUrl.origin;
      }
    } catch (e) {
      console.log('Using default frontend URL due to parser error');
    }

    const redirectUrl = `${frontendOrigin}/booking/success?session_id=${mockPaymentId}`;
    console.log('🔄 Redirecting user to frontend success page:', redirectUrl);
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Error in mock payment simulation:', error);
    res.status(500).send('Simulation failed: ' + error.message);
  }
};
