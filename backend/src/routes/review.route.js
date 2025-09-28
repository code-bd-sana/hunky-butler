import { Router } from "express";
import { addReview, deleteReview, getAllReview, getButlerReview, getSingleReview } from "../controller/review.controller.js";

const router = Router();


router.post('/', addReview);
router.get('/:id', getButlerReview);
router.get('/single/:id',  getSingleReview);
router.get('/all/review', getAllReview);
router.delete("/delete/:id", deleteReview);


export default router;