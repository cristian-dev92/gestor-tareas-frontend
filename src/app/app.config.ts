import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient,withInterceptorsFromDi,HTTP_INTERCEPTORS} from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    ),

    provideHttpClient(withInterceptorsFromDi()),

    // 🚀 Añadimos las animaciones y la configuración de los Toastrs aquí
    provideAnimations(),
    provideToastr({
      timeOut: 3500,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true
    }),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
function provideAnimations(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

function provideToastr(arg0: { timeOut: number; positionClass: string; preventDuplicates: boolean; progressBar: boolean; closeButton: boolean; }): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

