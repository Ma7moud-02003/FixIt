import { Alerts } from './../../../Shared/Alerts/alerts';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../../Core/Services/reports';
import { Subscription, finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TopNav } from "../../../Shared/Components/top-nav/top-nav";
import { Location } from '@angular/common';
interface ReportErrors {
  title: string | null;
  description: string | null;
  reportType: number | null;
}

interface ReportType {
  value: string;
  label: string;
}
@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule, TopNav],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit, OnDestroy {
  title = signal('');
  type = signal('');
  description = signal('');
  isLoading = signal(false);
  isSuccess = signal(false);
  userId = signal<string>('');
  private router = inject(ActivatedRoute);

  readonly types = [
    { value: 1, label: 'تاخير عن الموعد' },
    { value: 2, label: 'سلوك غير لائق' },
    { value: 3, label: 'مطالبه مبالغ اضافيه ' },
    { value: 4, label: ' جودة العمل ضعيفه' },
    { value: 5, label: 'تم رفض الدفع بعد الانجاز' },
    { value: 6, label: ' بيانا غير صحيحه ' },
    { value: 7, label: 'اضرار في مكان العمل' },
    { value: 8, label: 'اخري' },
  ];

  get descLength() {
    return this.description().length;
  }

  get isValid() {
    return this.title().trim().length > 0
      && this.type() !== ''
      && this.description().trim().length > 0;
  }


  private _report = inject(ReportsService);
  private subs = new Subscription();

  ngOnInit(): void {
    this.subs.add(
      this.router.paramMap.subscribe({
        next: (res) => {
          console.log(res);
          const id = res.get('userId');
          this.userId.set(id || '');
        }
      })
    )
  }  

  private alerts=inject(Alerts);
 private location=inject(Location);
send(): void {
    console.log(this.userId());

    const report: any = { // Replace any with ReportErrors
      title: this.title(),
      description: this.description(),
      reportType: Number(this.type())
    }
    console.log(report);

    // Validation check (Logic as requested)
    if (!this.isValid || this.isLoading()) return;
    
    if (!this.userId()) return;

    this.isLoading.set(true);
    this.isSuccess.set(false);

    this.subs.add(
      this._report.sendReport(report, this.userId()!).pipe(
        finalize(() => {
          this.isLoading.set(false);
     
          this.title.set('');
          this.type.set('');
          this.description.set('');
        })
      ).subscribe({
        next: () => {
           this.isSuccess.set(true);
           setTimeout(()=>{
             this.location.back();
           },1000)
          this.alerts.sucsess('تم ارسال تقريريك بنجاح ');
        }
      })
    );}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }



}




