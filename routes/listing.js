const express=require("express");

const router=express.Router();

const wrapAsync=require("../utils/wrapasync.js");

const Listing=require("../models/listing.js");

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const multer  = require('multer')

const {storage}=require("../cloudconfig.js");
const upload = multer({storage})



const listingController=require("../controllers/listing.js");
const { renderEditForm } = require("../controllers/listing.js");
const { destroyListing } = require("../controllers/listing.js");

//index and create routes
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,
   
    upload.single("listing[image][url]"),
     validateListing,
    wrapAsync(listingController.createListing)
  );
 

  //new route

router.get("/new",isLoggedIn,listingController.renderNewForm);


//Edit route

router.get("/:id/edit",isLoggedIn,
  isOwner,wrapAsync(renderEditForm));



  //show and update and delete

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,
  isOwner,
  upload.single("listing[image][url]"),
  validateListing,
  wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
  );











module.exports=router;

