const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  business_name: String,
  name: String,
  email: String,
  phone: String,
  gst: String,
  fssai: String,
  business_type: String,
  monthly_volume: String,

  // 🔥 IMPORTANT FLAGS
  is_profile_submitted: {
    type: Boolean,
    default: false,
  },
  is_profile_approved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
