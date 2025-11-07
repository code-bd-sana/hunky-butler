import Location from "../models/Location.js";

// Get all locations
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get location by slug
export const getLocationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const location = await Location.findOne({ slug });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
