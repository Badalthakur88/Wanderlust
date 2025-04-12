
const Review = require("../models/review");
const Listing = require("../models/listing");
const User = require('../models/user');  // Ensure the correct path


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/login");  // Redirect to the listings page after successful signup
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");  // Redirect back to signup if there's an error
    }
};

module.exports.renderLoginFOrm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect("/listings");  // Redirect to listings page after successful login
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);  // Pass any error to the next middleware
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");  // Redirect to homepage after logging out
    });
};