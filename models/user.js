const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    givenName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    address: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
    },
    info: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    phone: {
      type: Number,
      max: 9999999999,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    tokens: [{type: Object}],
    bookings: [{type: Object}],
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema)