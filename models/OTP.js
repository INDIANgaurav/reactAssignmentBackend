const mongoose = require("mongoose");
const mailsender = require("../utls/mailSender");
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailsender(
      email,
      " Verification OTP -> ",
      otp
    );
    console.log(" otp  sent successfully", mailResponse);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
    console.log("New document saved to database");
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
