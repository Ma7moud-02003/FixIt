import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideSweetAlert2 } from "@sweetalert2/ngx-sweetalert2";
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Core/Interceptors/authInterCeptor';
import { showErrorAlerts } from './Core/Interceptors/errorsAlerts';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),provideHttpClient(withFetch(),withInterceptors([authInterceptor,showErrorAlerts])),
    provideRouter(routes, withInMemoryScrolling({
  anchorScrolling: 'enabled'
})),
      provideSweetAlert2({
            // Optional configuration
            fireOnInit: false,
            dismissOnDestroy: true,
        }),
       providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false
    }
  }
})
  ]
};
