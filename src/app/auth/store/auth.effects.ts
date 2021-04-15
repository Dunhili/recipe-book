import { Actions, Effect, ofType } from '@ngrx/effects';

import * as AuthActions from './auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
  const action = {email, userId, token, expirationDate};
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess(action);
};

const handleError = (errorResponse: any) => {
    let errorMessage = 'An unknown error occurred!';

    if (!errorResponse.error || !errorResponse.error.error) {
      return of(new AuthActions.AuthenticateFail(errorMessage));
    }

    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS': errorMessage = 'This email already exists.'; break;
      case 'EMAIL_NOT_FOUND': errorMessage = 'This email was not found.'; break;
      case 'INVALID_PASSWORD': errorMessage = 'The entered password was incorrect.'; break;
      case 'USER_DISABLED': errorMessage = 'User account has been disabled.'; break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
};

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey;
  loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey;

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(this.signUpUrl,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
        catchError(errorResponse => handleError(errorResponse))
      );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(this.loginUrl,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken)),
        catchError(errorResponse => handleError(errorResponse))
      );
    })
  );

  @Effect()
  autoLogin = this.actions$
    .pipe(ofType(AuthActions.AUTO_LOGIN),
      map(() => {
    const userData: {
      email: string;
      id: string;
      token: string;
      tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return { type: 'DUMMY' };
    }

    if (userData.token) {
      return new AuthActions.AuthenticateSuccess({
        email: userData.email,
        userId: userData.id,
        token: userData.token,
        expirationDate: new Date(+userData.tokenExpirationDate)
      });
    }

    return { type: 'DUMMY' };
  }));

  @Effect({dispatch: false})
  authRedirect = this.actions$
    .pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
      tap(() => {
    this.router.navigate(['/']);
  }));

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
    localStorage.removeItem('userData');
  }));

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}
}
