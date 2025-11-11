import axios from "axios";

export const sendOtp = async (otp, mobile) => {
    try {
        const apiUrl = `https://restapi.smscountry.com/v0.1/Accounts/${process?.env?.SMSCOUNTRY_API_KEY}/SMSes/`;
        const payload = {
            Text: `Hey foodie! Your IRAITCHI OTP is ${otp}. Valid for 10 mins. Taste freshness—seafood & meat direct from market! @iraitchi.com`,
            Number: `91${mobile}`, // ensure it's in correct format
            SenderId: "IRAITI",
            DRNotifyUrl: "https://www.iraitchi.com/verifyOtp",
            DRNotifyHttpMethod: "POST",
            Tool: "API",
          }
        const response = await axios.post(apiUrl, payload, {
            auth: {
              username: process?.env?.SMSCOUNTRY_API_KEY,
              password: process?.env?.SMSCOUNTRY_TOKEN,
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
          return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return false;
    }
};