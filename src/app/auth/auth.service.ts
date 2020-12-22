import { Injectable } from '@angular/core';
import { Observable, Subject, combineLatest,BehaviorSubject } from 'rxjs';


import { auth as authConf } from '../conf/auth.conf';
import {
  AuthEvent,
  AUTH_EVENT_BEFORE_LOGIN,
  AUTH_EVENT_AFTER_LOGIN,
  AUTH_EVENT_BEFORE_SESSION_EXPIRATION,
  AUTH_EVENT_SESSION_EXPIRATION,
  AUTH_EVENT_SESSION_START,
  AuthLoginReturn
} from '@dia/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  public auth = authConf;
  private sessionTimeout: number;
  private lastActivityTime: number;
  public userSession = new BehaviorSubject({});

  checkLogin() {
    return false;
  }

  async doAuth() {
    await this.auth.init().then(() => {
      this.checkSession();
    }); // instantiate the library object

    this.auth.subscribe((event: AuthEvent) => {
      if (event.type === AUTH_EVENT_BEFORE_LOGIN) {
        document.body.style.overflow = 'hidden'; // TODO implement nicely
      } else if (event.type === AUTH_EVENT_AFTER_LOGIN) {
        this.checkSession();
      } else if (event.type === AUTH_EVENT_BEFORE_SESSION_EXPIRATION) {
        this.handleBeforeLogout();
      } else if (event.type === AUTH_EVENT_SESSION_EXPIRATION) {
        this.doLogout();
      }
    });
  }

  checkSession(loggedOut = false) {
    combineLatest([this.auth.getSession(), this.auth.getLoginReturn()]).subscribe(
      async ([session, loginResult]) => {
        if ((session || loginResult) && !loggedOut) { 
          this.userSession.next(session);
          this.sessionTimeout = session.expiresAt;
        } else {
          this.doLogin();
        }
      },
      (err) => {
        this.doLogin();
        throw err;
      }
    );
  }

  private handleBeforeLogout() {
    const nowTime: number = new Date().getTime();
    const sessionIdleTime: number = nowTime - this.lastActivityTime;

    if (sessionIdleTime <= this.sessionTimeout) {
      this.auth.refreshSession().then(({ expiresAt }) => {
        this.lastActivityTime = 0;
        this.sessionTimeout = expiresAt;
      });
    }
  }

  public doLogout(): void {
    this.auth.logout().then((st) => {
        document.location.reload();
    });
}

  async doLogin() {
    await this.auth.loginIframe({
      state: 'something to preserve',
      reason: null,
    });
  }

  public logOut(): void {
    this.auth.logout();
  }

  public keepAlive() {
    this.lastActivityTime = new Date().getTime();
  }
}
