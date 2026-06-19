import BASE_URL from "../config";

export const sendOtpAPI = async (phone) => {
  const res = await fetch(`${BASE_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  return res.json();
};

export const verifyOtpAPI = async (phone, otp) => {
  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });

  return res.json();
};
