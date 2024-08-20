import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const ConversationSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "User is required"],
      unique: true,
    },
    conversation: {
      type: Array,
    },
  },
  { timestamps: true }
);

// ConversationSchema.pre('save', async function(next) {
//   const user = this;
//   if(!user.isModified('password'))
//   next();
//   try {
//     const saltRound = 10;
//     this.password = await bcrypt.hash(this.password,saltRound);
//   } catch (error) {
//     next(error);
//   }

// })
// UserSchema.methods.generateToken = async function() {
// try {
//   // return jwt.sign({
//   //   userId : this._id.toString(),
//   //   email : this.email
//   // },process.env.JWT_SECRET_KEY)

//   return jwt.sign({ foo: 'bar' }, 'shhhhh');

// } catch (error) {
//   console.log(error);
// }
// }

export const Conversation = mongoose.model("Conversation", ConversationSchema);
