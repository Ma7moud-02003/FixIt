import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Review } from '../../Core/Services/review';
import { Subscription } from 'rxjs';
import { ReviewModel } from '../../Shared/Models/review';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../Core/Services/auth';
import { UserRole } from '../../Shared/enums/role';
import { ReviewCard } from "../../Shared/Components/cards/review-card/review-card";
 
interface WorkerData
{
  imgUrl:string,
  workerName:string
}

@Component({
  selector: 'app-reviews',
  imports: [ReviewCard],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews implements OnInit,OnDestroy{
  Roles=UserRole;
  private _review=inject(Review);
  private subs=new Subscription();
  private router=inject(ActivatedRoute);
  private auth=inject(Auth);
  workerReviews=signal<ReviewModel[]>([]);
  workerData=signal<WorkerData>({} as WorkerData)

 workerId=signal<string>('');
 role=signal<string>('');

ngOnInit(): void {
  this.role.set(this.auth.getRole()||'')
  this.router.paramMap.subscribe({
    next:(res)=>{
this.workerId.set(res.get('workerId')||'')
if(this.workerId()&&this.role()==UserRole.Clien_Role)
  this.getAllWorkerReviewsForClient();
else if(this.role()==UserRole.Worker_Role)
  this.getAllWorkerReviews();
    }
  })
}

  getAllWorkerReviews()
  {
    console.log('for worker');

this.subs.add(
  this._review.getAllRevies().subscribe({
    next:(res:any)=>{
    this.workerReviews.set(res.data.reviews)
    console.log(this.workerReviews());  
    console.log(res);
    }
  })
)
  }

  
  getAllWorkerReviewsForClient()
  {
    console.log('for client');
    
this.subs.add(
  this._review.getAllReviewsForUser(this.workerId()).subscribe({
    next:(res:any)=>{
      const data=res.data;
      const workerData={
        imgUrl:data.imgUrl,
        workerName:data.workerName
      }
    this.workerReviews.set(data.reviews);
this.workerData.set(workerData)
    console.log(this.workerReviews());
    console.log(res);
    }
  })
)
  }
  filterBy=signal<string>('');
  filterdReview=computed(()=>{
  const reviews = this.workerReviews(); // Assuming this is also a signal
  const filter = this.filterBy();
    if(!this.filterBy())
      return [...reviews]
    else if(filter=='rate')
    return [...reviews].sort((a,b)=>b.rate-a.rate)
  else if(filter=='newest')
  return [...reviews].sort((a,b)=>  new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
else
return null;
  })

  getFilter(filter:string)
  {
this.filterBy.set(filter)
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
