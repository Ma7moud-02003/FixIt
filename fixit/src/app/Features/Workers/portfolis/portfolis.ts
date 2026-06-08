import { Component, computed, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Protfolio } from '../../../Core/Services/protfolio';
import { ProtfolioCard } from "../../../Shared/Components/cards/protfolio-card/protfolio-card";
import { PortfolioModel } from '../../../Shared/Models/portfolio';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../Core/Services/auth';
import { UserRole } from '../../../Shared/enums/role';

interface WorkerData{
  workerImgUrl:string,
  workerName:string
}

@Component({
  selector: 'app-portfolis',
  imports: [ProtfolioCard, RouterLink],
  templateUrl: './portfolis.html',
  styleUrl: './portfolis.css',
})
export class Portfolis implements OnInit,OnDestroy{
  Roles=UserRole;
  private subs=new Subscription();
  private _portfolio=inject(Protfolio);
  private rout=inject(Router);
  private auth=inject(Auth);
  private router=inject(ActivatedRoute);
  role=signal<string>('');
  workerId=signal<string>('');

filterdPortfolio=computed(()=>{
  return this.myPortfolio().sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
})

myPortfolio=signal<PortfolioModel[]>([]);

workerData=signal<WorkerData>({} as WorkerData);
myId=signal<string>('');


   ngOnInit(): void {
    this.myId.set(this.auth.getUserId())
   this.role.set(this.auth.getRole()||'')
   this.router.paramMap.subscribe({
     next:(res)=>{
       this.workerId.set(res.get('workerId')||'')
 if(this.workerId())
  this.getWorkerPortfolioForClient();
 else if (this.ifMe()) 
   this.getMyPortfolios();
  else
    this.myPortfolio.set([]);
     }
     
   })
}


  getMyPortfolios()
  {
    this.subs.add(
this._portfolio.getAllPortfolios().subscribe({
  next:(res)=>{
 this.myPortfolio.set(res.data);
 console.log(this.myPortfolio());
 
  }
})
    )
  }

  ifMe():boolean{
      if ((this.role() === UserRole.Worker_Role&&this.myId()==this.workerId())||(this.role()===UserRole.Worker_Role&&!this.workerId())) return true;
      else return false;
  }
   getWorkerPortfolioForClient()
  {
    this.subs.add(
this._portfolio.getPortfoliosForUser(this.workerId()).subscribe({
  next:(res)=>{
 const data=res.data;
 console.log(res);
 
 this.myPortfolio.set(data);
 const workerData={workerImgUrl:data.workerImgUrl,workerName:data.workerName}
 this.workerData.set({...workerData}); 
  }
})
    )
  }

  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
