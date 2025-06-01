export interface UserData {
  userId: string;
  email: string;
  emailVerified: boolean;
  accessToken: string;
  refreshToken: string;
}

export class User {
  protected _id: string;
  protected _email: string;
  protected _emailVerified: boolean;
  protected _accessToken: string;
  protected _refreshToken: string;

  constructor(data: UserData) {
    this._id = data.userId;
    this._email = data.email;
    this._emailVerified = data.emailVerified;
    this._accessToken = data.accessToken;
    this._refreshToken = data.refreshToken;
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get emailVerified(): boolean {
    return this._emailVerified;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }
}
