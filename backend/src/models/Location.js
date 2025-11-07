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

locationSchema.pre("save", async function (next) {
  if (!this.isModified("city")) return next();

  // base slug
  let slug = this.city
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

const Location = mongoose.model("Location", locationSchema);

export default Location;
