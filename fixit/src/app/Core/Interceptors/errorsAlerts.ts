import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Alerts } from "../../Shared/Alerts/alerts";

export function showErrorAlerts(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const alerts = inject(Alerts);
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = Object.values(error.error).flat()[0] || 'حدث خطأ ما يرجي المحاوله مره اخري ';
            console.log(message);
            
            if (typeof message === "number") {
message=error.error.message||error.error.Message;
            }
            console.log(message);
            
            alerts.error(message as string)
            return throwError(() => error);
        })
    )
}