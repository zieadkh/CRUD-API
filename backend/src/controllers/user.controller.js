import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    const {username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({message : "All fiels are important!"});
    }
    const existing = await User.findOne({email: email.toLowerCase()});
    if (existing) {
      return res.status(400).json({message: "user already exist!"});
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      loggedIn: false
    });

    res.status(201).json({
      message: "User registered",
      user: {id: user._id, email: user.email, username: user.username}
    });
  } catch (error) {
    res.status(500).json({message: "internal server Error", error: error.message});
  }
};

const loginUser = async (req, res) => {
  try {


    const { email, password } = req.body;
    const user = await User.findOne({
      email: email.toLowerCase()
    });


    if (!user) return res.status(400).json({
      message: "User not found"
    });

    const isMatch =  await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({
      message: "invalid credentials"
    });

    res.status(200).json({
      message: "User loggedin",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    })

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


const logoutuser = async (req ,res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      email
    });
    if (!user) return res.status(404).json({
      message: "User not found!"
    });
    res.status(200).json({
      message: "Lotout successful"
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error", error
    }); 
  }
}

export {
  registerUser,
  loginUser,
  logoutuser
};

