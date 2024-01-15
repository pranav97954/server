const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  role: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// userSchema.statics.login = async function (email, password) {
//   const user = await this.findOne({ email });
//   if (user) {
//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//     throw Error("incorrect password");
//   }
//   throw Error("incorrect email");
// };
userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      
      if (auth) {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
      
      throw Error("incorrect password");
    }
    
    throw Error("incorrect email");
  } catch (error) {
    throw error;
  }
};
module.exports = mongoose.model("Users", userSchema);
