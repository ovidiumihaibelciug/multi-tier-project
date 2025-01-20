import axios from "axios";

/**
 * Fetches a user from the NestJS backend.
 * @param identifier The user's email or username.
 * @returns The user object or null if not found.
 */
export async function getUserFromDb(identifier: string) {
  console.log("getUserFromDB");
  try {
    const response = await axios.post(
      "http://localhost:3001/users/find",
      { identifier },
      { withCredentials: true }
    );

    console.log("response?.data123: ", response?.data);

    if (response?.data) {
      axios.interceptors.request.use(async (config) => {
        config.headers["X-User-ID"] = response?.data?.id;

        return config;
      });
    }

    return response.data;
  } catch (error) {
    return null;
  }
}
