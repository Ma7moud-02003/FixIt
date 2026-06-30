
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ClientServices } from '../../services/client-services';
import { Subscription } from 'rxjs';
import { UserRole } from '../../../Shared/enums/role';
import { Alerts } from '../../../Shared/Alerts/alerts';
import { ClinetDetails } from "../clients-details/clinets";
import { WorkerService } from '../../services/worker-service';
export type UserRolee = UserRole;
export type UserStatus = true|false;
export interface IClient {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: 'client' | 'worker' | string; // حددتها كـ 'client' بناءً على الداتا
  imgUrl: string | null;
  isActive: boolean;
  isBlocked: boolean;
  
  // الإحصائيات والقوائم
  favorites: any[]; // يمكنك تغيير any لـ Interface الخاص بـ Favorite
  notifications: any[];
  messages: any[];
  reviews: any[];
  
  // العلاقات (Chat Rooms)
  clientChatRooms: any[];
  workerChatRooms: any[];
  
  // التقارير والطلبات
  sentReports: any[];
  receivedReports: any[];
  sentRequests: any[];

  // التواريخ والحماية
  passwordHash: string;
  createdAt: string | Date;
  updatedAt: string | Date | null;
  lastLogin: string | Date | null;
}
@Component({
  selector: 'app-clinets',
  imports: [CommonModule, ClinetDetails],
  templateUrl: './clinets.html',
  styleUrl: './clinets.css',
})
export class Clinets implements OnInit,OnDestroy{
 
  userRole=UserRole;
  private _clients=inject(ClientServices)
  private _workers=inject(WorkerService)

  private subs=new Subscription();
  searchQuery = signal('');
  currentPage  = signal(1);
  readonly pageSize = 10;
 private cache = new Map<number, any>();


   ngOnInit(): void {
   this.getAllUsers();
   this.getAllWorkers()
  }

// تأكد إنك معرف الكاش فوق كـ Map
// private cache = new Map<number, IClient[]>();


getAllUsers() {
  const page = this.currentPage();

  // 1. شيك على الكاش أولاً
  if (this.cache.has(page)) {
    console.log(`Loading page ${page} from cache...`);
    this.allUsers.set(this.cache.get(page)!);
    return; // وقف تنفيذ الدالة هنا مش محتاجين نكلم السيرفر
  }

  // 2. لو مش موجود في الكاش، كلم السيرفر
  this.subs.add(
    this._clients.getUsers(page, 10).subscribe({
      next: (clients) => {
        // تحديث الـ Signals
        this.totalUsers.set(clients.totalCount);
        this.totalPages.set(clients.totalPage);
        this.allUsers.set(clients.data);
        console.log(clients);
        
        // حفظ الداتا في الكاش برقم الصفحة
        this.cache.set(page, clients.data);
        
        console.log(`Page ${page} fetched from server and cached.`);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    })
  );
}

getAllWorkers()
{
  this._workers.getWorkers().subscribe({
    next:(res)=>{
console.log(res);

    }
  })
}
getNext(){
this.currentPage.set(this.currentPage()+1);
this.getAllUsers();
}

getPrevious(){
this.currentPage.set(this.currentPage()-1);
if(this.currentPage()>0)
this.getAllUsers();
}

  allUsers = signal<IClient[]>([]);
 
  // ── Derived ───────────────────────────────────────────────────────────────
  filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.allUsers().filter(u =>
      u.fullName?.includes(q) || u.email.toLowerCase().includes(q)
    );
  });
 
  totalUsers   = signal<number>(0);
  onlineUsers  = computed(()=>{
    return this.allUsers().filter((m)=>{
     
    })
  });
  newUsers     = signal<number>(0);
  totalPages=signal<number>(0)
  pagedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  });
 
  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );
 
  // ── Nav items ─────────────────────────────────────────────────────────────

 
  // ── Actions ───────────────────────────────────────────────────────────────
  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    this.currentPage.set(1);
  }
 
  
  private alerts=inject(Alerts);
  deleteUser(id: string) {
this.alerts.confirmDelete('هل انت متاكد').then((res)=>{
  if(res.isConfirmed)
    this.subs.add(this._clients.deletUser(id).subscribe({
  next:()=>{
    this.alerts.sucsess('تم حذف المستخدم')
      this.allUsers.update(users => users.filter(u => u.userId !== id));
  }}))

})
  }
 
  blockUser(id:string)
  {
    this.alerts.confirmWarning('سيتم حظر المستخدم').then((res)=>{
    if(res.isConfirmed)
    {
      this.subs.add(
        this._clients.blockUser(id).subscribe({
          next:()=>{
            this.alerts.sucsess('تم حظر المستخدم ')
          }
        })
      )
    }
    })
  }
 
 
  // ── Helpers ───────────────────────────────────────────────────────────────
roleBadgeClass(role: string): string {
  switch (role) {
    case 'client':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'worker':
      return 'bg-sky-100 text-sky-700 border border-sky-200';
    case 'admin':
      return 'bg-violet-100 text-violet-700 border border-violet-200';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'; // حالة احتياطية لأي دور آخر
  }
}
 
  statusClass(status: UserStatus): string {
    switch(status)
    {
      case true:
        return 'text-emerald-600'
       
        case false :
        return 'text-rose-500 font-semibold'
       
    }
    
    
  }
 
  statusDot(status: UserStatus): string {
    switch(status)
    {
      case true:
        return 'bg-emerald-500' 
        case false :
        return  'bg-rose-500'
       
    }
  }

  user=signal<IClient>({} as IClient);
  openDetails=signal<boolean>(false);
  getOpenDetails(user:IClient)
  {
    this.openDetails.set(!this.openDetails());
    if(this.openDetails())
   this.user.set(user);

   }





  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }



  
}
