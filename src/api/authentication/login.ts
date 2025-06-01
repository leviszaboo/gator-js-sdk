// api/authentication/login.ts
import { Auth } from "src";
import { User } from "src";
import { RequestOptions, HttpMethod, Endpoint, request } from "../utils";

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponse {
  userId: string;
  email: string;
  emailVerified: boolean;
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async (
  auth: Auth,
  email: string,
  password: string,
): Promise<User> => {
  const endpoint = Endpoint.LOGIN;
  const method = HttpMethod.POST;

  const requestBody: LoginRequestBody = { email, password };

  const requestOptions: RequestOptions = {
    auth,
    endpoint,
    method,
    request_body: { ...requestBody },
  };

  const userData = await request<LoginResponse>(requestOptions);

  const user = new User(userData);

  auth._setAuthState(user);
  auth._startTokenValidation();

  return user;
};
