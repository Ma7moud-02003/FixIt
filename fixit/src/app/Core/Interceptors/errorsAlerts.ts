import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router"; // استيراد الـ Router للتوجيه
import { catchError, throwError } from "rxjs";
import { Alerts } from "../../Shared/Alerts/alerts";

export function showErrorAlerts(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const alerts = inject(Alerts);
    const router = inject(Router); // عمل inject للـ Router

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            
            // 1. التحقق لو الـ Token انتهى أو المستخدم غير مصرح له (401 Unauthorized)
            if (error.status === 401) {
                // مسح الـ LocalStorage بالكامل (أو امسح الـ token بس لو حابب)
                localStorage.clear(); 
                
                // توجيه المستخدم لصفحة اللوجين
                router.navigate(['/login']); 
                
                // إظهار رسالة تنبيه للمستخدم
                alerts.error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
                
                return throwError(() => error);
            }

            // 2. التعامل مع باقي الأخطاء التانية (الكود القديم بتاعك)
            let message = Object.values(error.error).flat()[0] || 'حدث خطأ ما يرجي المحاوله مره اخري ';
            console.log(message);
            
            if (typeof message === "number") {
                message = error.error.message || error.error.Message;
            }
            console.log(message);
            
            alerts.error(message as string);
            return throwError(() => error);
        })
    );
}