// api/authentication/sign-up.ts
import { Auth } from "src/core/auth";
import { RequestOptions, HttpMethod, Endpoint, request } from "../utils";

interface SignUpRequestBody {
  email: string;
  password: string;
}

export const createUser = async (
  auth: Auth,
  email: string,
  password: string,
): Promise<void> => {
  const endpoint = Endpoint.SIGNUP;
  const method = HttpMethod.POST;

  const requestBody: SignUpRequestBody = { email, password };

  const requestOptions: RequestOptions = {
    auth,
    endpoint,
    method,
    request_body: { ...requestBody },
  };

  await request(requestOptions);
};
