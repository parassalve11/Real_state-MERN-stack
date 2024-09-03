
import bcryptjs from 'bcryptjs'
import User from "../models/user.model.js"
import { errorHandlar } from '../utils/error.js'
import Listing from '../models/listing.model.js'


export const test = (req,res) => {
    res.json({
        default:"Hello wolrd!"
    })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandlar(401, 'You can only update your own account!'));
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avtar: req.body.avtar,
          },
        },
        { new: true }
      );
  
      const { password, ...rest } = updatedUser._doc;
  
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };

  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandlar(401, 'You can only delete your own account!'));
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token');
      res.status(200).json('User has been deleted!');
    } catch (error) {
      next(error);
    }
  };


  export const getUserListing = async(req,res,next) =>{
    if(req.user.id === req.params.id){
      try {
        const listings = await Listing.find({ userRef : req.params.id });
        res.status(200).json(listings);

      } catch (error) {
        next(error)
      }

    }
    else{
     return next(errorHandlar(401,"You can Only view your Own listing!"))
    }

  } 
  
  export const deleteListing = async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id);

    if(!listing){
      return next(errorHandlar(404,"Listing not found!"))
    }
    if(req.user.id !== listing.userRef){
      return next(errorHandlar(401,"You can only delete Your own Listing1"))
    }
    try {
      await Listing.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been Deleted!!")
    } catch (error) {
      next(error)
    }

  }

  export const getUser = async(req,res,next)=> {
    const user = await User.findById(req.params.id);

    if(!user) return next(errorHandlar(404,"User id is Missing!"))
    const{password: pass , ...rest}= user._doc

    res.status(200).json(rest)
  }

 