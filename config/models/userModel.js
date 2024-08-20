import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "First Name is required"],
  },
  password: {
    type: String,
    required: true,
  },
  savedSession: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) next();
  try {
    const saltRound = 10;
    this.password = await bcrypt.hash(this.password, saltRound);
  } catch (error) {
    next(error);
  }
});
UserSchema.methods.generateToken = async function () {
  try {
    // return jwt.sign({
    //   userId : this._id.toString(),
    //   email : this.email
    // },process.env.JWT_SECRET_KEY)

    return jwt.sign({ foo: "bar" }, "shhhhh");
  } catch (error) {
    console.log(error);
  }
};

export const User = mongoose.model("User", UserSchema);
