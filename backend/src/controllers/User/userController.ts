import User from "../../models/User/userModel";
import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import Token from "../../models/token";
import { v4 as uuid } from "uuid";
import { sendEmail } from "../../utils/setEmail";

import { customAlphabet } from "nanoid";
import ReservationDate from "../../models/Reservations/ReservedDated";
import Driver from "../../models/Drivers/Driver";
import Business from "../../models/business";
import AdminUser from "../../models/adminUser";

export const addNewUser = async (req: Request, res: Response) => {
  let { userName, userEmail, userPwd } = req.body;
  userEmail = userEmail.toLowerCase();
  const customId = customAlphabet("1234567890", 4);
  let userId = customId();
  userId = "U" + userId;
  try {
    if (userPwd == "") {
      return res.status(400).json({ error: "Password is reqired" });
    }

    const email = await User.findOne({ userEmail });
    if (email) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const driverEmail = await Driver.findOne({ driverEmail: userEmail });
    if (driverEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const businessEmail = await Business.findOne({ primaryEmail: userEmail });
    if (businessEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const adminEmail = await AdminUser.findOne({ adminEmail: userEmail });
    if (adminEmail) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcryptjs.genSalt(5);
    let hashedPassword = await bcryptjs.hash(userPwd, salt);
    let clientUser = new User({
      userName,
      userEmail,
      userPwd: hashedPassword,
      userId: userId,
    });
    clientUser = await clientUser.save();

    if (!clientUser) {
      hashedPassword = "";
      return res.status(400).json({ error: "Failed to save the User" });
    }
    let token = new Token({
      token: uuid(),
      userId: clientUser._id,
    });
    token = await token.save();
    if (!token) {
      return res.status(400).json({ error: "Token not generated" });
    }
    const url = `${process.env.FRONTEND_URL}/verifyemail/${token.token}`;
    const api = `${process.env.Backend_URL}`;

    sendEmail({
      from: "beta.toursewa@gmail.com",
      to: clientUser.userEmail,
      subject: "Account Verification Link",
      text: `Verify your Business Email to Login\n\n
    ${api}/verifyuseremail/${token.token}`,
      html: `<div style="font-family: Arial, sans-serif; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 75%; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: left; margin-bottom: 20px;">
            <img src='https://tourbackend-rdtk.onrender.com/public/uploads/logo.png' className="" />
          </div>
          <div style="text-align: left;">
            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Verify your Email address</h1>
            <p style="font-size: 14px; margin-bottom: 20px;">
              To continue on Toursewa with your account, please verify that
              this is your email address.
            </p>
            <a href='${url}' style="display: inline-block; background-color: #e6310b; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Click to verify</a>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">
              This link will expire in 24 hours
            </p>
          </div>
        </div>
      </div> `,
    });

    hashedPassword = "";
    return res
      .status(200)
      .json({ message: "Verifying link is sent to Your Email" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifyUserEmail = async (req: Request, res: Response) => {
  const token = req.params.token;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token Expired" });
    }
    const userId = await User.findOne({ _id: data.userId });
    if (!userId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    }
    if (userId.isVerified) {
      return res.status(400).json({ error: "Email Already verified" });
    }
    userId.isVerified = true;
    userId.save().then((user) => {
      if (!user) {
        return res.status(400).json({ error: "Failed to Verify" });
      } else {
        return res.status(200).json({ message: "Email Verified" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    await User.find().then((data) => {
      if (data.length > 0) {
        return res.send(data);
      } else {
        return res.status(400).json({ error: "Not Found" });
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserstById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const client = await User.findById(id);
    if (!client) {
      return res.status(200).json({ error: "Failed to get the Profile" });
    } else {
      return res.send(client);
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const changePwd = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { newPwd, userPwd } = req.body;
  try {
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(400).json({ error: "Failed" });
    }
    const isPwd = await bcryptjs.compare(userPwd, userData.userPwd);
    if (!isPwd) {
      return res.status(400).json({ error: "Incorrect Old Password" });
    }
    const salt = await bcryptjs.genSalt(5);
    let hashedPwd = await bcryptjs.hash(newPwd, salt);
    const newData = await User.findByIdAndUpdate(
      id,
      {
        userPwd: hashedPwd,
      },
      { new: true }
    );
    if (!newData) {
      return res.status(400).json({ error: "Failed to Change" });
    } else {
      return res.status(200).json({ message: "Password Changed" });
    }
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateProfileById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { userName, userEmail } = req.body;
  try {
    let userImage: string | null = req.body.userImage || null;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files["userImage"]) {
        userImage = files["userImage"][0]?.path;
      }
    } else if (req.body.userImage) {
      userImage = req.body.userImage;
    } else if (req.body.userImage === "") {
      userImage = null;
    }

    const data = await User.findByIdAndUpdate(
      id,
      {
        userName,
        userEmail,
        userImage,
      },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ error: "Failed To Update" });
    } else {
      return res.status(200).json({ message: "Sucessfully Updated" });
    }
  } catch (error: any) {
    return res.status(200).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deleteClient = await User.findByIdAndDelete(id);
    if (!deleteClient) {
      return res.status(404).json({ error: "Failed to delete" });
    }
    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const resetPwd = async (req: Request, res: Response) => {
  const token = req.params.token;
  const newPwd = req.body.userPwd;
  try {
    const data = await Token.findOne({ token });
    if (!data) {
      return res.status(404).json({ error: "Token not found" });
    }
    const userId = await User.findOne({ _id: data.userId });
    if (!userId) {
      return res.status(404).json({ error: "Token and Email not matched" });
    }
    const isOldPwd = await bcryptjs.compare(newPwd, userId.userPwd);
    if (isOldPwd) {
      return res.status(400).json({ error: "Password Previously Used" });
    } else {
      const salt = await bcryptjs.genSalt(5);
      let hashedPwd = await bcryptjs.hash(newPwd, salt);
      userId.userPwd = hashedPwd;
      userId.save();

      await Token.deleteOne({ _id: data._id });

      return res.status(201).json({ message: "Reset Successful" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyReservations = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const myReservation = await ReservationDate.find({ bookedBy: id });
    if (!myReservation) {
      return res.status(404).json({ error: "NO Reservation" });
    } else {
      return res.send(myReservation);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
