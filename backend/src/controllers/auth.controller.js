import User from "../models/user.model.js";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";


export async function signup(req, res) {
  console.log("SIGNUP BODY:", req.body);

  try {
    const { fullname, email, password } = req.body;

    // 1️⃣ Validate input
    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    // 2️⃣ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This email already exists" });
    }

    // 3️⃣ Generate DiceBear avatar
    const avatar = createAvatar(adventurer, {
      seed: fullname,
      size: 128,
    }).toString();

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create & save user
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      avatar,
    });

    try {
        await upsertStreamUser({
        id:newUser._id.toString(),
        name:newUser.fullname,
        email:newUser.email,
        avatar:newUser.avatar || "",
    });
    console.log("Stream user upserted successfully for {newUser.email}");
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }

    // 6️⃣ Generate JWT
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7️⃣ Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 8️⃣ Send response
    res.status(201).json({
        
      id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      avatar: newUser.avatar,
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"Please provide email and password"});
    }

    const user= await User.findOne({email});
    if(!user) return res.status(401).json({message:"Invalid email or password"});

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
if (!isPasswordCorrect) {
  return res.status(401).json({ message: "Invalid email or password" });
}

         const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7️⃣ Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
   res.status(200).json({ success: true, user });

   console.log("matchPassword:", typeof user.matchPassword);

}
   catch (error) {
     console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }

  
}

export async function logout(req, res) {
 res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
  console.log("ONBOARD BODY:", req.body);

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { fullname, bio, nativelanguage, learninglanguage, location } = req.body;

    const missingFields = [];
    if (!fullname) missingFields.push("fullname");
    if (!bio) missingFields.push("bio");
    if (!nativelanguage) missingFields.push("nativelanguage");
    if (!learninglanguage) missingFields.push("learninglanguage");
    if (!location) missingFields.push("location");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Please fill all required fields",
        missingFields,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullname, bio, nativelanguage, learninglanguage, location , isOnboarded: true },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }


   try {
     await upsertStreamUser({
         id:updatedUser._id.toString(),
         name:updatedUser.fullname,
         email:updatedUser.email,
         
     });
     console.log(`Stream user updated after onboarding for ${updatedUser.fullname}`);
        
   } catch (streamError) {
     console.error("Error upserting Stream user:", streamError.message);
   }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in onboard controller:", error.message);
    res.status(500).json({ message: error.message });
  }
}
