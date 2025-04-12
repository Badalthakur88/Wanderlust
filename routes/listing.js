const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { ListingSchema} = require("../schema.js"); 
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})


const listingController = require("../controllers/listings.js");

const validateListing = (req, res, next)=>{
    let {error} = ListingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


//=====Index Rout========//
router.get("/listings", wrapAsync(listingController.index));

//=====New Rout========//
router.get("/listings/new", isLoggedIn, listingController.renderNewForm );

// Route to show a specific listing
router.get("/listings/:id", wrapAsync(listingController.showListing));




//=====Create Rout========//

// router.post("/listings", async(req, res)=>{
//     //let {title, description, image, price, country, location} = req.body;
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// });
router.post("/listings", upload.single("listing[image]"), isLoggedIn,  wrapAsync(listingController.createListing));
// router.post("/listings", upload.single("listing[image]"), (req, res) => {
//     res.send(req.file);
// });


//=====Edit Rout========//it give a form
router.get("/listings/:id/edit", isLoggedIn, wrapAsync( listingController.renderEditForm));

// //=====Update Rout========//
router.put("/listings/:id", upload.single("listing[image]"), isLoggedIn, validateListing, wrapAsync( listingController.updateListing));

//=====Delete Rout========//
router.delete("/listings/:id", isLoggedIn, wrapAsync(listingController.destroyListing));




  
  

module.exports = router;