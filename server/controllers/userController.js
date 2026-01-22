import cloudinary from "../Lib/cloudinary.js"
import { generateUserToken } from "../Lib/utils.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"

// user signup
export const signup = async (req,res) =>{
    const {fullName , email , password , bio } = req.body
    try{
        if (!fullName || !email || !password || !bio){
            return res.json({success:false , message:"missing details"})
        }
        const user = await User.findOne({email})

        if(user){
            return res.json({success:false , message:"user already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        
        const newUser = await User.create({
            fullName,email,password:hashedPassword,bio
        })

        const token = generateUserToken(newUser._id)
        res.json({success:true,userData:newUser,token,message:"Account created successfully"})
    }catch(e){
        console.log(e.message)
        res.json({success:false,message:e.message})
    }
}

// user login
export const login = async (req,res) =>{
    const {email,password} = req.body;
    try{
        if (!email || !password){
            return res.json({success:false , message:"missing details"})
        }
        const userData = await User.findOne({email})
        const isPasswordCorrect = await bcrypt.compare(password,userData.password)

        if (!isPasswordCorrect){
            return res.json({success:false , message:"invalid Credentials"})
        }
        const token = generateUserToken(userData._id)
        res.json({success:true,userData,token,message:"Login successfully"})
    }catch(e){
        console.log(e.message)
        res.json({success:false,message:e.message})
    }
}

// controller to check the if user is authenticated or not
export const checkAuth = async (req,res) =>{
    res.json({success:true,user:req.user});
}

// controller to update user profile details
export const updateProfile = async (req, res) => {

  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id; // ✅ FIX

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
