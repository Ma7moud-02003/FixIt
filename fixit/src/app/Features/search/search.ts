import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { User } from '../../Core/Services/user';
import { WorkerCard } from "../../Shared/Components/cards/worker-card/worker-card";
import { categories } from '../../Shared/Models/categorys';
interface Catog {
  name: string
  selected: boolean
}
interface City {
  name: string
  selected: boolean
}

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, WorkerCard],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  ngOnInit(): void {
    this.getAllWorkers();
  }
  private subs = new Subscription();
  private user = inject(User);
  showLoading = signal<boolean>(true);
  categories = signal<Catog[]>(categories)

  egyptGovernorates = signal<City[]>([
    { name: 'القاهرة', selected: false },
    { name: 'الجيزة', selected: false },
    { name: 'الإسكندرية', selected: false },
    { name: 'الشرقية', selected: false },
    { name: 'الدقهلية', selected: false },
    { name: 'الغربية', selected: false },
    { name: 'المنوفية', selected: false },
    { name: 'القليوبية', selected: false },
    { name: 'البحيرة', selected: false },
    { name: 'كفر الشيخ', selected: false },
    { name: 'الفيوم', selected: false },
    { name: 'بني سويف', selected: false },
    { name: 'المنيا', selected: false },
    { name: 'أسيوط', selected: false },
    { name: 'سوهاج', selected: false },
    { name: 'قنا', selected: false },
    { name: 'الأقصر', selected: false },
    { name: 'أسوان', selected: false },
    { name: 'الإسماعيلية', selected: false },
    { name: 'السويس', selected: false },
    { name: 'بورسعيد', selected: false },
    { name: 'دمياط', selected: false }
  ]);

  allWorkers = signal<any[]>([])
  getAllWorkers() {
    this.subs.add(
      this.user.getWorkers().pipe(
        finalize(() => {
          this.showLoading.set(false);
        })).subscribe({
          next: (res) => {
            this.allWorkers.set(res.data)
            console.log(res);

          }
        })
    )
  }
}
