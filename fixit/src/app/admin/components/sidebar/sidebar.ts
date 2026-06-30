import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink,RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
    navItems = [
    
    { label: 'المستخدمين',      icon: 'users',  active: false, rout:'/admin/users' },
    { label: 'العمال',           icon: 'briefcase',  rout:'/admin/workers' },
    { label: 'التصنيفات',        icon: 'table' , active:false , rout:'/admin/catogs'   },
    { label: 'طلبات الخدمة',    icon: 'clipboard',  rout:'/admin/services'  },
    { label: 'المدفوعات',        icon: 'credit-card',  rout:'/admin/payments'},
    { label: 'التقييمات',        icon: 'star'   , rout:'/admin/reviews' },
    { label: 'مراقبة المحادثات', icon: 'message' ,  rout:'/admin/chats' },
    { label: 'الابلاغات ', icon: 'reports' ,  rout:'/admin/reports' },

    { label: 'الملف الشخصي ', icon: 'profile' ,  rout:'/admin/profile' },

  ];
   
  private rout=inject(Router);
  index=signal<number>(-1);
  routTo(router:string,index:number)
  {
this.rout.navigate([router]);
this.index.set(index);
  }
}
