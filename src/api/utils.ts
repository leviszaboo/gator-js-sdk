import { Auth } from "src/core/auth";

export function replaceParams(
  url: string,
  params: Record<string, string | number>,
): string {
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value.toString());
  });
  return url;
}

export const enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const enum Endpoint {
  LOGIN = "/users/login",
  SIGNUP = "/users/sign-up",
  DELETE_USER = "/users/:userId/delete",
  UPDATE_EMAIL = "/users/:userId/update-email",
  UPDATE_PASSWORD = "/users/:userId/update-password",
  SEND_VERIFICATION_EMAIL = "/users/:userId/send-verification-email",
  REISSUE_TOKEN = "/tokens/reissue-token",
  INVALIDATE_TOKEN = "/tokens/invalidate-token",
}

export const enum HttpHeader {
  CONTENT_TYPE = "Content-Type",
  API_KEY = "X-Gator-Api-Key",
  APP_ID = "X-Gator-App-Id",
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  auth: Auth;
  endpoint: Endpoint;
  request_body?: Record<string, string | number>;
  params?: Record<string, string | number>;
  method?: HttpMethod;
}

class GatorResponseError extends Error {
  statusCode: number;
  statusText: string;
  error: Record<string, any>;
  constructor(
    statusCode: number,
    statusText: string,
    error: Record<string, any>,
  ) {
    super();
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.error = error;
  }
}

export async function request<T = any>({
  auth,
  endpoint,
  request_body = {},
  params = {},
  method = HttpMethod.GET,
  headers = {},
  ...options
}: RequestOptions): Promise<T> {
  const { gatorAppId, gatorAuthApiKey, gatorAuthApiUrl } = auth._config;
  const url = new URL(gatorAuthApiUrl + replaceParams(endpoint, params));
  const includeBody =
    (method === HttpMethod.POST || method === HttpMethod.PUT) && !!request_body;

  const requestHeaders = {
    [HttpHeader.API_KEY]: gatorAuthApiKey,
    [HttpHeader.APP_ID]: gatorAppId,
    [HttpHeader.CONTENT_TYPE]: "application/json",
    ...(includeBody && { [HttpHeader.CONTENT_TYPE]: "application/json" }),
    ...headers,
  };

  const response = await fetch(url.toString(), {
    method,
    headers: requestHeaders,
    body: includeBody ? JSON.stringify(request_body) : undefined,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();

    throw new GatorResponseError(response.status, response.statusText, error);
  }

  return response.json() as Promise<T>;
}
