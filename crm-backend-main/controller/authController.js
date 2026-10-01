const bcrypt = require("bcrypt");
const User = require("../models/userModel"); 
const jwt = require("jsonwebtoken");
const SECRET_TOKEN = process.env.JWT_SECRET;


exports.verifytoken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Please login to access this route",
      });
    }

    const jwtToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(jwtToken, SECRET_TOKEN);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (ex) {
    console.error(ex);
    return res.status(401).json({
      message: ex.message,
    });
  }
};


exports.login = async(req,res) =>
{
    const {email, password} = req.body;
    if(!email || !password)
    {
         return res.status(400).json({
             message: "Email and password are required",
         });
    };
    const  users = await User.findOne({email})
  if(!users)
  {
        return res.status(404).json(
                {
                        message: "user not found"
                }
        )
  }
const checkpass = await bcrypt.compare(password , users.password);
  if (!checkpass) {
    return res.status(401).json({
      message: "Incorrect password",
    });
  }

const accesstoken = jwt.sign(
{
    id: users.id,
    name: users.firstName + " " + users.lastName,
  
},
SECRET_TOKEN,
{
    expiresIn: 60*60,
}
)

  return res.status(200).json({ accesstoken,
     user: {

  id: users._id,
  firstName: users.firstName,
  lastName: users.lastName,
  email: users.email,
  role: users.role
  
        
      }, message: "User logged in successfully",} )
    
}

exports.register = async(req,res) => {
    try
    {
        // Only accept profile fields; role is never self-assigned (see scripts/make-admin.js)
        const { firstName, lastName, email, password } = req.body
        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        if (await User.findOne({ email })) {
            return res.status(409).json({ message: "Email is already registered" })
        }
        const hashedpass = await bcrypt.hash(password, 12)
        await User.create({ firstName, lastName, email, password: hashedpass })
        return res.status(201).json({
            message: "User Created Succesfully"
        })
    }
    catch(ex)
    {
        console.log(ex.message)
        return res.status(500).json({
            message: "EROOR IN User Creation"
        })
    }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id firstName lastName email");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching users",
    });
  }
};