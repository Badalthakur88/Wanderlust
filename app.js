if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {isLoggedIn} = require("./middleware.js");


const port = 3000;

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(dbUrl);
}

//middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOption = {
    secret: "mysupersecretecode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOption));
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;  // Ensure req.user is available globally
    next();
});





app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/", (req, res) => {
//     res.send("root is working");
// });


app.use("/", listingRouter);
app.use("/", reviewRouter);
app.use("/", userRouter)


// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "goa",
//         country: "india",
//     });
//     await sampleListing.save();
//         console.log("sample was saved");
//         res.send("Successful testing");
// });

app.get("/", (req, res)=>{
    res.redirect("/listings");
})

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found"));
    // res.send(404, "page not found");
});

// Error handler middleware
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Somthing went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", { message, err });
    // res.status(statusCode).send(message);
});


app.listen(port, () => {
    console.log(`App is listning on port ${port}`);
});