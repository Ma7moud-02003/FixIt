import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
interface ReviewModel{
  rate:number,
  comment:string
}
@Injectable({
  providedIn: 'root',
})
export class Review {
    private http=inject(HttpClient);
  endPoint=signal<string>('Review');
  addReview(review:ReviewModel,serviceId:string)
  {
return this.http.post(`${environment.apiUrl}/${this.endPoint()}/AddReview/${serviceId}`,review);
  }

  

  getAllRevies(pageNum:number=1,pageSize:number=5)
  {
return this.http.get(`${environment.apiUrl}/${this.endPoint()}/AllReviews?PageNum=${pageNum}&PageSize=${pageSize}`);
  }
   getAllReviewsForUser(workerId:string,pageNum:number=1,pageSize:number=5)
  {
return this.http.get(`${environment.apiUrl}/${this.endPoint()}/AllReviewsByWorkerId/${workerId}?PageNum=${pageNum}&PageSize=${pageSize}`);
  }

  deleteReview(reviewId:string)
  {
    return  this.http.delete(`${environment.apiUrl}/${this.endPoint()}/DeleteReview/${reviewId}`)
  }
}
