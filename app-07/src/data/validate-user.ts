import axios, { AxiosError } from "axios";

export const validateUser = async (email: string) => {
  try {
    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/lumora/validate-admin/",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data.status;
  } catch (err) {
    return false;
  }
};
