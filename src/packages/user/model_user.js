const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Schema for storing user
 *  * First Name - user first name
 *  * Last Name - user last name
 *  * Email - user email
 *  * Password - user password
 */
const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

schema.methods.verifyPassword = async function (
  canidatePassword,
  userPassword
) {
  return await bcrypt.compare(canidatePassword, userPassword);
};

const Model_user = mongoose.model("Model_user", schema);

module.exports = Model_user;
