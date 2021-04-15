import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = null;

  private closeSubscription: Subscription;
  private storeSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.errorMessage = authState.authError;
    });
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }

    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm): void {
    if (authForm.invalid) {
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({email, password}));
    } else {
      this.store.dispatch(new AuthActions.SignupStart({email, password}));
    }

    authForm.reset();
  }

  onHandleError(): void {
    this.store.dispatch(new AuthActions.ClearError());
  }
}
