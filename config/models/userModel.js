import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true,'Email is required'],
    unique: true
  },
  name: {
    type: String,
    required: [true,'First Name is required'],
  },
  password: {
    type: String,
    required: true
  },
 
});

UserSchema.pre('save', async function(next) {
  const user = this;
  if(!user.isModified('password'))
  next();
  try {
    const saltRound = 10;
    this.password = await bcrypt.hash(this.password,saltRound);
  } catch (error) {
    next(error);
  }
  
 
})

export const User = mongoose.model("User", UserSchema); 