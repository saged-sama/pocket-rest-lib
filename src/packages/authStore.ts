import { jwtDecode } from 'jwt-decode';

export default class AuthStore {
    public token: string | undefined;
    public model: any | undefined;
    public isValid: boolean = false;    
    public isAdmin: boolean = false;
    public storageKey: string = 'rest_auth';

    constructor() {
        this.token = ""
        this.model = {}
        this.isValid = false;
        this.isAdmin = false;
    }

    loadFromCookie(cookie: string, key?: string) {
        const rest_auth_cookie = cookie.split('; ').find(row => row.startsWith(`${ key ? key : this.storageKey}=`));

        if (!rest_auth_cookie) {
            this.token = undefined;
            this.model = undefined;
            this.isValid = false;
            return;
        }

        const cookieValue = rest_auth_cookie.split('=')[1];
        const { token, model } = JSON.parse(decodeURIComponent(cookieValue));
        this.token = token; 
        this.model = model;
        this.isValid = this.checkTokenValidity();
        this.save(token, model);
    }

    private getJwtExpiry(token: string): Date {
        const decoded = jwtDecode(token);
        return decoded.exp ? new Date(decoded.exp * 1000) : new Date(0);
    }

    private checkTokenValidity(): boolean {
        if (!this.token) return false;
        const exp = this.getJwtExpiry(this.token);
        return exp > new Date();
    }

    exportToCookie(options?: {
        expires?: string;
        path?: string;
        domain?: string;
        secure?: boolean;
        httpOnly?: boolean;
        maxAge?: number;
        sameSite?: 'Strict' | 'Lax' | 'None';
      }, key?: string): string | undefined {
        if (!this.token) return;
      
        let cookie = `${ key ? key : this.storageKey }=${encodeURIComponent(JSON.stringify({
            token: this.token,
            model: this.model,
        }))}`;
      
        if (options) {
          if (options.expires) {
            cookie += ` expires=${new Date(options.expires).toUTCString()};`;
          }
          else{
            cookie += ` expires=${this.getJwtExpiry(this.token).toUTCString()};`;
          }
          if (options.path) {
            cookie += ` path=${options.path};`;
          }
          if (options.domain) {
            cookie += ` domain=${options.domain};`;
          }
          if (options.secure) {
            cookie += ` secure;`;
          }
          if (options.httpOnly) {
            cookie += ` HttpOnly;`;
          }
          if (options.maxAge) {
            cookie += ` max-age=${options.maxAge};`;
          }
          if (options.sameSite) {
            cookie += ` SameSite=${options.sameSite};`;
          }
        }
      
        return cookie;
      }

    save(token: string, model: any) {
        this.token = token;
        this.model = model;
        localStorage?.setItem(this.storageKey, JSON.stringify({ token, model }));
    }

    clear() {
        this.token = undefined;
        this.model = undefined;
        this.isValid = false;
        this.isAdmin = false;
        localStorage?.removeItem(this.storageKey);
    }
}
