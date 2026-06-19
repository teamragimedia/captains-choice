import { sendOtpAPI, verifyOtpAPI } from "./api";

export const sendOtp = async (phone) => {
  return await sendOtpAPI(phone);
};

export const verifyOtp = async (phone, otp) => {
  return await verifyOtpAPI(phone, otp);
};
