import api, { frontURL } from "../api";
import { getAccessToken } from "../api/auth";

export const GenerateAccessToken = async () => {
  try {
    return await api.post(getAccessToken, null, { withCredentials: true });
  } catch (error) {
    return (window.location.href = `${frontURL}/error/serverError`);
  }
};
