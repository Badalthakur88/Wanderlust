const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {reviewSchema } = require("../schema.js"); // ✅ Corrected import
const ExpressError = require("../utils/ExpressError");

const reviewController = require("../controllers/reviews.js");


const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};



//Review
//Post rout
router.post("/listings/:id/reviews", validateReview, wrapAsync( reviewController.createReview ));


//delete review rout
router.delete("/listings/:id/reviews/:reviewId", wrapAsync(reviewController.destroyReview ));

module.exports = router;