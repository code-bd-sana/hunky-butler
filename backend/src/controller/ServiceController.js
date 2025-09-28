// import Service from "../models/Service.js";  // ✅ works now

// import Service from "../models/service.js";
import Service from "../models/service.js";

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single service by ID
export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const service = await Service.findOne({ slug });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new service
export const createService = async (req, res) => {
  try {
    const { name, description, includes, faqs, bannerUrl } = req.body;

    const newService = new Service({
      name: name, // match your schema fields
      description,
      included: includes,
      faqs: faqs.map((f) => ({ question: f.q, answer: f.a })), // map frontend FAQ to schema
      banner: bannerUrl,
      price: 0, // or add a price input in frontend
      status: "active",
    });

    const savedService = await newService.save(); // <-- actually saves to DB

    res.status(201).json({ message: "Service created", service: savedService });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// // Update a service
// export const updateService = async (req, res) => {
//   try {
//     const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedService) return res.status(404).json({ message: "Service not found" });
//     res.status(200).json(updatedService);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// // Delete a service
// export const deleteService = async (req, res) => {
//   try {
//     const deletedService = await Service.findByIdAndDelete(req.params.id);
//     if (!deletedService) return res.status(404).json({ message: "Service not found" });
//     res.status(200).json({ message: "Service deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
