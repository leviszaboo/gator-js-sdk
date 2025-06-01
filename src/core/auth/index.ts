import {
  loginUser as _loginUser,
  logoutUser as _logoutUser,
  createUser as _createUser,
  revalidateToken as _revalidateToken,
} from "src/api";
import { Base, GatorConfig } from "../base";
import { User } from "../user";

type AuthStateListener = (user: User | null) => void;

export class Auth extends Base {
  protected currentUser: User | null = null;
  protected listeners: AuthStateListener[] = [];
  protected validationTimer: NodeJS.Timeout | null = null;

  constructor(config: GatorConfig) {
    super(config);
    this._loadAuthState();
  }

  get _config() {
    return this.gatorConfig;
  }

  private _loadAuthState(): void {
    const storedToken = localStorage.getItem("gator_auth_token");
    const storedUser = localStorage.getItem("gator_auth_user");

    if (storedToken && storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  private _saveAuthState(): void {
    if (this.currentUser) {
      localStorage.setItem("gator_auth_token", this.currentUser.accessToken);
      localStorage.setItem("gator_auth_user", JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem("gator_auth_token");
      localStorage.removeItem("gator_auth_user");
    }
  }

  private _notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.currentUser);
    });
  }

  private _updateAuthState(user: User | null): void {
    this.currentUser = user;
    this._saveAuthState();
    this._notifyListeners();
  }

  _startTokenValidation(): void {
    if (this.validationTimer) {
      clearInterval(this.validationTimer);
    }

    const interval = 5 * 60 * 1000;

    this.validationTimer = setInterval(async () => {
      if (
        this.currentUser &&
        this.currentUser.accessToken &&
        this.currentUser.refreshToken
      ) {
        await _revalidateToken(this, this.currentUser);
      }
    }, interval);
  }

  _stopTokenValidation(): void {
    if (this.validationTimer) {
      clearInterval(this.validationTimer);
      this.validationTimer = null;
    }
  }

  _setAuthState(user: User | null): void {
    this._updateAuthState(user);
  }

  createUser(email: string, password: string) {
    return _createUser(this, email, password);
  }

  loginUser(email: string, password: string) {
    return _loginUser(this, email, password);
  }

  logoutUser() {
    return _logoutUser(this, this.currentUser);
  }

  revalidateToken() {
    return _revalidateToken(this, this.currentUser);
  }

  onAuthStateChanged(callBack: AuthStateListener) {
    this.listeners.push(callBack);
    callBack(this.currentUser);

    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener != callBack,
      );
    };
  }
}
