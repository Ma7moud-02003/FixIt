import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ClientServices } from '../../services/client-services';
import { Subscription } from 'rxjs';
export type UserRole = 'عميل' | 'عامل' | 'أدمن';
export type UserStatus = 'متصل الآن' | 'نشط' | 'موقوف';
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  joinDate: string;
  status: UserStatus;
  online: boolean;
}
@Component({
  selector: 'app-clinets',
  imports: [CommonModule],
  templateUrl: './clinets.html',
  styleUrl: './clinets.css',
})
export class Clinets implements OnInit,OnDestroy{
 
  private _clients=inject(ClientServices)
  private subs=new Subscription();
  searchQuery = signal('');
  currentPage  = signal(1);
  readonly pageSize = 5;
 


   ngOnInit(): void {
   this.getAllUsers();
  }


getAllUsers()
{
this.subs.add(
  this._clients.getUsers(this.currentPage(),10).subscribe({

    next:(clients)=>{
this.allUsers.set(clients)
    }
  })
)
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

  allUsers = signal<User[]>([]);
 
  // ── Derived ───────────────────────────────────────────────────────────────
  filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.allUsers().filter(u =>
      u.name.includes(q) || u.email.toLowerCase().includes(q)
    );
  });
 
  totalUsers   = computed(() => this.allUsers().length);
  onlineUsers  = computed(() => this.allUsers().filter(u => u.online).length);
  newUsers     = computed(() => this.allUsers().filter(u => u.joinDate >= '2024-01-01').length);
  suspendedUsers = computed(() => this.allUsers().filter(u => u.status === 'موقوف').length);
 
  totalPages = computed(() =>
    Math.ceil(this.filteredUsers().length / this.pageSize)
  );
 
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
 
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
 
  deleteUser(id: number) {
    this.allUsers.update(users => users.filter(u => u.id !== id));
  }
 
  toggleSuspend(id: number) {
    this.allUsers.update(users =>
      users.map(u =>
        u.id === id
          ? { ...u, status: u.status === 'موقوف' ? 'نشط' : 'موقوف' as UserStatus }
          : u
      )
    );
  }
 
  // ── Helpers ───────────────────────────────────────────────────────────────
  roleBadgeClass(role: UserRole): string {
    return {
      'عميل': 'bg-amber-100 text-amber-700 border border-amber-200',
      'عامل': 'bg-sky-100 text-sky-700 border border-sky-200',
      'أدمن': 'bg-violet-100 text-violet-700 border border-violet-200',
    }[role];
  }
 
  statusClass(status: UserStatus): string {
    return {
      'متصل الآن': 'text-emerald-600',
      'نشط':       'text-slate-500',
      'موقوف':     'text-rose-500 font-semibold',
    }[status];
  }
 
  statusDot(status: UserStatus): string {
    return {
      'متصل الآن': 'bg-emerald-500',
      'نشط':       'bg-slate-400',
      'موقوف':     'bg-rose-500',
    }[status];
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }



  
}
