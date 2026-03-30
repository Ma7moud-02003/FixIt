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


   ngOnInit(): void {
   this.role.set(this.auth.getRole()||'')
   this.router.paramMap.subscribe({
     next:(res)=>{
       this.workerId.set(res.get('workerId')||'')
 if(this.workerId()&&this.role()==UserRole.Clien_Role)
  this.getWorkerPortfolioForClient();
 else if(this.role()==UserRole.Worker_Role)
   this.getMyPortfolios();
     }
   })
}


  getMyPortfolios()
  {
    this.subs.add(
this._portfolio.getAllPortfolios().subscribe({
  next:(res)=>{
 this.myPortfolio.set(res.data.portfoliosList);
 console.log(this.myPortfolio());
 
  }
})
    )
  }

   getWorkerPortfolioForClient()
  {
    this.subs.add(
this._portfolio.getPortfoliosForUser(this.workerId()).subscribe({
  next:(res)=>{
 const data=res.data;
 this.myPortfolio.set(data.portfoliosList);
 const workerData={workerImgUrl:data.workerImgUrl,workerName:data.workerName}
 this.workerData.set({...workerData}); 
  }
})
    )
  }
  routForEditing(work:PortfolioModel)
  {
if(this.role()==UserRole.Worker_Role)
    this.rout.navigate(['/dashboared/addPortfolio'],{state:{work}});
  else 
    return;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
