import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  description: { type: String, required: true },
  included: [{ type: String }], // Array of strings for what's included
  faqs: [faqSchema], // Array of FAQ objects
  banner: { type: String }, // URL of banner image
  date: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

// module.exports = mongoose.model('Service', serviceSchema);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
