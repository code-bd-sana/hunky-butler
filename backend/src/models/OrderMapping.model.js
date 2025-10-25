// models/OrderMapping.model.js
import mongoose from 'mongoose';

const orderMappingSchema = new mongoose.Schema({
  squareOrderId: {
    type: String,
    required: true,
    unique: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Booking'
  },
  customerEmail: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OrderMapping = mongoose.model('OrderMapping', orderMappingSchema);
export default OrderMapping;