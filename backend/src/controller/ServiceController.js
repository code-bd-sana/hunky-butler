// import Service from "../models/Service.js";  // ✅ works now

// import Service from "../models/service.js";
import Service from '../models/service.js'


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
// export const getServiceById = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) return res.status(404).json({ message: "Service not found" });
//     res.status(200).json(service);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// Create a new service
// export const createService = async (req, res) => {
//   try {
//     const newService = new Service(req.body);
//     const savedService = await newService.save();
//     res.status(201).json(savedService);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

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
