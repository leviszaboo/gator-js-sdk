// api/authentication/login.ts
import { Auth } from "src/core/auth";
import { RequestOptions, HttpMethod, Endpoint, request } from "../index"; // Adjust the import path as needed

interface LoginRequestBody {
  email: string;
  password: string;
}

export const loginUser = async (
  auth: Auth,
  email: string,
  password: string,
): Promise<Response | void> => {
  const endpoint = Endpoint.LOGIN;
  const method = HttpMethod.POST;

  const requestBody: LoginRequestBody = { email, password };

  const requestOptions: RequestOptions = {
    auth,
    endpoint,
    method,
    request_body: { ...requestBody },
  };

  try {
    const response = await request(requestOptions);
    return response;
  } catch (error) {
    throw error;
  }
};
