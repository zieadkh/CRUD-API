import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema (
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 1,
      maxLenght:30
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLenght: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next ();
  this.password = await bcrypt.hash(this.password, 10)
  
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);

