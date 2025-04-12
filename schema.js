const joi = require("joi");

module.exports.ListingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.string().required().min(0),
        image: joi.object({
            url: joi.string().allow("", null),     // allow empty if optional
            filename: joi.string().allow("", null) // in case you include it later
        }).allow(null), // allow null if the whole image object is not passed
    }).required(),
});




module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),
        comment: joi.string().required(),
    }).required()
})