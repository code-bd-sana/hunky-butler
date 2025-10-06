import mongoose from "mongoose";
const locationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    tagline: { type: String },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;
