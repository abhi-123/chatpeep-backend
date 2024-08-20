import express from "express";
import { User } from "../config/models/userModel.js";
import { Conversation } from "../config/models/conversationModel.js";

//import user from '../controllers/user';
//import { encode, decode } from '../middlewares/jwt';
import { ERROR_MESSAGES } from "../constants.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", async (req, res) => {
  // Use router.route() for chaining
  return res.status(200).json({
    success: true,
    data: "Welcome to Chatpeep!",
  });
});
router.post("/signup", async (req, res) => {
  // Use router.route() for chaining
  try {
    const userDetails = req.body;
    //	userDetails.profiles[0].avatar = `Avatar_0${Math.floor(Math.random() * 7) + 1}.png`;
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return res.status(200).json({
        success: false,
        message: "Email Already Exist!",
        data: userExist,
      });

    const userCreated = await User.create(userDetails);
    return res.status(201).json({
      success: true,
      message: "User Succesfully Created!",
      data: userCreated,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/signin", async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email }).collation({
      locale: "en",
      strength: 2,
    });

    if (!user)
      return res.status(200).json({
        success: false,
        message: "User Not Found!",
        data: null,
      });
    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password)
      return res.status(200).json({
        success: false,
        message: "Invalid Credentials!",
        data: null,
      });
    console.log(user);
    return res.status(200).json({
      success: true,
      message: "Successfully Login!",
      data: user,
      token: await user.generateToken(),
    });
  } catch (error) {
    console.log(error);
  }
});
router.post("/saveconversation", async (req, res) => {
  // Use router.route() for chaining
  try {
    const conversationDetails = req.body;
    //	userDetails.profiles[0].avatar = `Avatar_0${Math.floor(Math.random() * 7) + 1}.png`;
    const convoAlreadyExist = await User.findOne({
      email: conversationDetails.user,
    }).collation({
      locale: "en",
      strength: 2,
    });
    const ConversationData = convoAlreadyExist
      ? await Conversation.findOneAndUpdate(
          { user: conversationDetails.user },
          { conversation: conversationDetails.conversation }
        ).collation({
          locale: "en",
          strength: 2,
        })
      : await Conversation.create(conversationDetails);
    const ToggleUserData = await User.findOneAndUpdate(
      { email: conversationDetails.user },
      { savedSession: true }
    ).collation({
      locale: "en",
      strength: 2,
    });
    return res.status(201).json({
      success: true,
      message: "conversation Succesfully Saved!",
      data: ConversationData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/loadconversation", async (req, res, next) => {
  console.log(req.body.email, "in load conversation");
  try {
    const coversation = await Conversation.findOne({
      user: req.body.email,
    }).collation({
      locale: "en",
      strength: 2,
    });
    console.log(coversation);
    return res.status(200).json({
      success: true,
      message: "Successfully Conversation Loaded!",
      data: coversation,
    });
  } catch (error) {
    console.log(error);
  }
});

// router.post('/signup', user.onCreateUser);
// router.post('/signin', encode, async (req, res, next) => {
// 	const userDetails = await User.getUserById(req.userId);
// 	return res.status(200).json({
// 		success: true,
// 		authorization: req.authToken,
// 		data: { userDetails }
// 	});
// });
// router.post('/users/checkAvailability', user.onCheckAvailability);
// router.post('/users/upsertProfile', decode, user.onUpsertProfile);
// router.post('/users/deleteProfile', decode, user.onDeleteProfile);

export default router;
