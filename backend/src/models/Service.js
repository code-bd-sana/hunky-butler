import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true }, // ✅ new field for URL
  description: { type: String, required: true },
  included: [{ type: String }], // Array of strings for what's included
  faqs: [faqSchema], // Array of FAQ objects
  banner: { type: String }, // URL of banner image
  date: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

serviceSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  // base slug
  let slug = this.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  // check duplicates
  let slugExists = await Service.findOne({ slug });
  let count = 1;

  while (slugExists) {
    slug = `${slug}-${count}`;
    slugExists = await Service.findOne({ slug });
    count++;
  }

  this.slug = slug;
  next();
});

// module.exports = mongoose.model('Service', serviceSchema);

const Service = mongoose.model("Service", serviceSchema);

export default Service;