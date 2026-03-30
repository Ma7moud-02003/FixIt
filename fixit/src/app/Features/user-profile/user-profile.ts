import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { User } from '../../Core/Services/user';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {  ViewWorkerModel } from '../../Shared/Models/viewWorker';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { Protfolio } from '../../Core/Services/protfolio';
import { Review } from '../../Core/Services/review';
import { ReviewModel } from '../../Shared/Models/review';
import { ReviewCard } from "../../Shared/Components/cards/review-card/review-card";
import { PortfolioModel } from '../../Shared/Models/portfolio';
@Component({
  selector: 'app-user-profile',
  imports: [ButtonModule, StepperModule, ReviewCard, RouterLink],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit,OnDestroy {
  viewdWorkerData=signal<ViewWorkerModel>({} as ViewWorkerModel)
  loading = signal<boolean>(true);
  private _user = inject(User);
  private subs = new Subscription();
  private router = inject(ActivatedRoute);
  workerId = signal<string>('');
  ngOnInit(): void {
    this.subs.add(
      this.router.paramMap.subscribe({
        next: (res) => {
          const id = res.get('workerId');
          this.workerId.set(id || '');
          if (this.workerId())
          {
            this.viewedWorkerData();
            this.getWorkerPortfolios();
          }
          
          else
            this.loading.set(false)
        }
      })
    )
  }

  viewedWorkerData() {
    this.subs.add(
      this._user.viewWorkerProfile(this.workerId()).pipe(
        finalize(() => this.loading.set(false))).subscribe({
          next: (res) => {
            this.viewdWorkerData.set(res.data);
            console.log(this.viewdWorkerData());
          
          }
        }))
  }
   private _portfolio=inject(Protfolio);
   private _review=inject(Review);

   cureentValue=signal<number>(1);
   
   changeStep(e:number)
   {
    console.log('ddddddddddd');
    
    this.cureentValue.set(e)
    if(this.cureentValue()==1)
      this.getWorkerPortfolios();
    else if(this.cureentValue()==2)
      this.getWorkerReviews();
   }



      getWorkerReviews()
      {
 if(!this.workerReviwes().length)
  {       
this.subs.add(
  this._review.getAllReviewsForUser(this.workerId()).subscribe({
    next:(res:any)=>{
console.log(res);
this.workerReviwes.set(res.data.reviews)
    }
  })
)}
else
console.log('existed');

      }


workerPortfolios=signal<PortfolioModel[]>([]);
workerReviwes=signal<ReviewModel[]>([]);
  getWorkerPortfolios()
  {
    if(!this.workerPortfolios().length)
    {
this.subs.add(
  this._portfolio.getPortfoliosForUser(this.workerId()).subscribe({
    next:(res)=>{
      this.workerPortfolios.set(res.data.portfoliosList)
console.log(res);
    }
  })
)}
else
  console.log('existed');
  
  }
  ngOnDestroy(): void {
  this.subs.unsubscribe();
  }
}
