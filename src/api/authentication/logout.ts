// api/authentication/login.ts
import { Auth } from "src/core/auth";
import { RequestOptions, HttpMethod, Endpoint, request } from "../utils";
import { User } from "src/core/user";

interface LogoutRequestBody {
  accessToken: string;
  refreshToken: string;
}

export const logoutUser = async (auth: Auth, user: User): Promise<void> => {
  if (!user || !user.accessToken || !user.refreshToken) {
    return; // No user or tokens to invalidate
  }

  const endpoint = Endpoint.INVALIDATE_TOKEN;
  const method = HttpMethod.POST;

  const requestBody: LogoutRequestBody = {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  };

  const requestOptions: RequestOptions = {
    auth,
    endpoint,
    method,
    request_body: { ...requestBody },
  };

  await request(requestOptions);

  auth._setAuthState(null);
  auth._stopTokenValidation();
};
