const mongoose = require("mongoose");

function connectDB() {
  try {
    const con = mongoose.connect("mongodb://0.0.0.0:27017/passport");
    if (con) {
      console.log("database is connected");
    }
  } catch (err) {
    console.log(err);
  }
}

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

const userModel = mongoose.model("User", userSchema);
module.exports = { userModel, connectDB };
