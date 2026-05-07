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
import { Favourite } from '../../Core/Services/-favourite';
import { Alerts } from '../../Shared/Alerts/alerts';
import { MyFavorite } from '../my-favorite/my-favorite';
import { FavoriteModel } from '../../Shared/Models/favorite';
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
    this.getMyFavourites();
  }

  viewedWorkerData() {
    this.subs.add(
      this._user.viewWorkerProfile(this.workerId()).pipe(
        finalize(() => this.loading.set(false))).subscribe({
          next: (res) => {
            console.log(res.data);
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



     private workersCache = new Map<string, any[]>();


      getWorkerReviews()
      {
        const key='reaviews'+this.workerId();
        if(this.workersCache.has(key))
        {
          this.workerReviwes.set(this.workersCache.get(key)!);
          return;
        }
        if(!this.workerReviwes().length)
  {       
this.subs.add(
  this._review.getAllReviewsForUser(this.workerId()).subscribe({
    next:(res:any)=>{
console.log(res);
this.workerReviwes.set(res.data);
this.workersCache.set(key,res.data);
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
      const key='portfolio'+this.workerId();
      if(this.workersCache.has(key))
      {
        this.workerPortfolios.set(this.workersCache.get(key)!);
        return;
      }
    if(!this.workerPortfolios().length)
    {
this.subs.add(
  this._portfolio.getPortfoliosForUser(this.workerId()).subscribe({
    next:(res)=>{
      this.workerPortfolios.set(res.data);
      this.workersCache.set(key,res.data);
console.log(res);
    }
  })
)}
else
  console.log('existed');
  
  }
  // favourite section
  private _favourite=inject(Favourite);
  private alerts=inject(Alerts);
 
  //Favorite section
  


   workers=signal<FavoriteModel[]>([]);

 addToFavourite() {
    if (!this.workerId()) return;
    this.subs.add(
      this._favourite.addToFavourite(this.workerId()).subscribe({
        next: () => {
          const newFavorite: FavoriteModel = {
            workerId: this.workerId(),
            fullName: this.viewdWorkerData().fullName || '',
            jobTitle: this.viewdWorkerData().jobTitle || '',
            categoryName: this.viewdWorkerData().categoryName || '',
            description: this.viewdWorkerData().description || '',
          } as FavoriteModel;
          this.workers.update(workers => [...workers, newFavorite]);
this.alerts.sucsess('تمت الاضافه الى المفضله ❤️');
        }}))
  }

    getMyFavourites()  {
   this.subs.add(
    this._favourite.getFavourites().subscribe({
      next:(res)=>{
        this.workers.set(res.data);
        console.log(res);
      }
    })
   )
  }
  checkIfWorkerIsFavourite(workerId:string):boolean{
    return this.workers().some(worker=>worker.workerId===workerId);
  }
   
  removeFromFavourite() {
    if (!this.workerId()) return;
    this.subs.add(
      this._favourite.removeFromFavourite(this.workerId()).subscribe({
        next: () => {
          this.alerts.sucsess('تمت الازالة من المفضلة 💔');
          this.workers.update(workers => workers.filter(worker => worker.workerId !== this.workerId()));
        }}))
  }


  ngOnDestroy(): void {
  this.subs.unsubscribe();
  }
}
