const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Profile = Schema(
  {
    user_id:{
        type: String,
        required: true,
        unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Profile", Profile);