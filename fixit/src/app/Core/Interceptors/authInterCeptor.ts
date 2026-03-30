import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Auth } from "../Services/auth";

export function authInterceptor(req:HttpRequest<unknown>,next:HttpHandlerFn)
{
const auth=inject(Auth);
let token=auth.getUserToken();
if(token)
{
token=token.replace(/"/g,'');
const newReq=req.clone({
    headers:req.headers.set('Authorization',`Bearer ${token}`)
})
return next(newReq);
}
return next(req)
}