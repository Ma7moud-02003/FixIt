import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Protfolio {
  private http=inject(HttpClient);
  endPoint=signal<string>('Portfolio');
  
  addPortfoio(portfolio:FormData)
  {
   return this.http.post(`${environment.apiUrl}/${this.endPoint()}/AddPortfolio`,portfolio);
  }
  getAllPortfolios():Observable<any>
  {
   return  this.http.get(`${environment.apiUrl}/${this.endPoint()}/AllPortfoliosByUserId`)
  }

  deletePortfolio(portfoioId:string)
  {
    return this.http.delete(`${environment.apiUrl}/${this.endPoint()}/DeletePortfolio/${portfoioId}`);
  }

    getPortfoliosForUser(workerId:string):Observable<any>
  {
   return  this.http.get(`${environment.apiUrl}/${this.endPoint()}/AllPortfoliosByWorkerId/${workerId}`);
  }

  editePortfolio(portfolio:FormData,portfolioId:string)
  {
   return this.http.put(`${environment.apiUrl}/${this.endPoint()}/EditePortfolio/${portfolioId}`,portfolio);
  }

  getSinglePortfolio(Title:string,Describtion:string,ImgUrl:string)
  {
    const data= {
  Title,Describtion,ImgUrl
}
return data;
  }

}
