// api/authentication/login.ts
import { Auth } from "src";
import { User } from "src";
import { RequestOptions, HttpMethod, Endpoint, request } from "../utils";

interface RevalidateRequestBody {
  accessToken: string;
  refreshToken: string;
}

export const revalidateToken = async (
  auth: Auth,
  currentUser: User,
): Promise<void> => {
  const endpoint = Endpoint.REISSUE_TOKEN;
  const method = HttpMethod.POST;

  if (!currentUser || !currentUser.accessToken || !currentUser.refreshToken) {
    throw new Error("No valid user session found.");
  }

  const { accessToken, refreshToken } = currentUser;

  const requestBody: RevalidateRequestBody = { accessToken, refreshToken };

  const requestOptions: RequestOptions = {
    auth,
    endpoint,
    method,
    request_body: { ...requestBody },
  };

  await request(requestOptions);
};
