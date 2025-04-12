const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const userController = require("../controllers/users");

//signup
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

//login
router.get("/login", userController.renderLoginFOrm);

router.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);

//logout
router.get("/logout", userController.logout);

module.exports = router;
