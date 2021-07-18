const User = require("./model_user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const jwtKey = process.env.JWT_SECRET_KEY||"my_secret_key"
const jwtExpirySeconds = process.env.JWT_EXPIRES_IN ||400

/**
 *
 * @param {ObjectId} id
 * @returns
 */

const getToken = (id) => {

    console.log("seconds",jwtExpirySeconds)
  return jwt.sign({ id }, jwtKey, {
    expiresIn: jwtExpirySeconds,
  });
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.login = async (req, res, next) => {
  try {
    console.log("login here--")
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   res.status(400).json({
    //     status: "error",
    //     message: errors.array()[0].msg,
    //   });
    // }
    

    console.log("email=", req.body.email)
    console.log("email=", req.body)

    const user = await User.findOne({ email: req.body.Email }).select(
      "+password"
    );
    if (
      !user ||
      !(await user.verifyPassword(req.body.Password, user.password))
    ) {
      res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }
    console.log("user",user)

    const token = getToken(user._id);
    res.status(201).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    //TODO
  }
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log("here1")
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: "error",
        message: errors.array()[0].msg,
      });
    }
    console.log("here2")
    
    const user = await User.create(req.body);
    console.log("here3- user", user)
    const token = getToken(user._id);
    console.log("here4")
    res.status(201).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error"
      
    });
  }
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
exports.serachUser = async (req, res, next) => {
  try {
    const regex = new RegExp(req.query.q);
    const users = await User.find({
      email: {
        $regex: regex,
        $options: "si",
      },
    });
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    //TODO: Handle Error
  }
};
