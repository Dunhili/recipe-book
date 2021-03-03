import { NgModule } from '@angular/core';
import { DataStorageService } from './shared/data-storage.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth.interceptor.service';

@NgModule({
  providers: [
    DataStorageService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ]
})
export class CoreModule {

}
