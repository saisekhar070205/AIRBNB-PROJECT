const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const Review=require("./review.js");

const listingSchema=new Schema({
  title:{
   type:String,
   required:true,
  },
  
  description:String,
   image: {
    filename:{
      type:String,
      default:"listingimage",
    } ,
    url: {
      type: String,
      default:"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
          : v,
    },
  },

  price:Number,
  location:String,
  country:String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
     },
 geometry:{
   type:{
     type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
 }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing=new mongoose.model("Listing",listingSchema);

module.exports=Listing;

  // image:{
  //   type:String,
  //   default:"https://unsplash.com/photos/mountain-reflection-in-calm-lake-at-sunrise-fT1d2SXi1R8",
  //   set: (v)=>
  //      v==="" 
  //     ? "https://unsplash.com/photos/mountain-reflection-in-calm-lake-at-sunrise-fT1d2SXi1R8"
  //     :v,
  // },