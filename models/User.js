const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require("md5");
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Invalid Email Address"],
    require: "Please supply an email address"
  },
  name: {
    type: String,
    required: "Please supply a name",
    trim: true
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  hearts: [{ type: mongoose.Schema.ObjectId, ref: "Store" }],
  username: {
    type: String
  }
});

userSchema.virtual("gravatar").get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  usernameUnique: false
});
userSchema.plugin(mongodbErrorHandler, {
  usernameField: "email",
  usernameUnique: false
}); // or usernameField

module.exports = mongoose.model("User", userSchema);
