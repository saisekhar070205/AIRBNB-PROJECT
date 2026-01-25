if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ----------------- VIEW ENGINE -----------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ----------------- MIDDLEWARE -----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ----------------- MONGODB CONNECTION -----------------
const dbUrl = process.env.ATLASDB_URL;
console.log("DB URL:", process.env.ATLASDB_URL);


mongoose
  .connect(dbUrl) // Removed deprecated options
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.log("❌ MongoDB connection error:");
    console.log(err.message);
  });

// ----------------- SESSION STORE -----------------
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "thisshouldbeasecret",
  },
  touchAfter: 24 * 3600, // 24 hours
});

store.on("error", (err) => {
  console.log("❌ ERROR in Mongo Session Store:", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "thisshouldbeasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ----------------- PASSPORT AUTH -----------------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ----------------- FLASH & CURRENT USER -----------------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null; // Now available in all EJS templates
  next();
});

// ----------------- ROUTES -----------------
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ----------------- ERROR HANDLER -----------------
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  if (res.headersSent) {
    return next(err);
  }
  res.status(status).render("error.ejs", { message });
});

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
