import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink,RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
    navItems = [
    { label: 'الرئيسية',        icon: 'grid'       },
    { label: 'المستخدمين',      icon: 'users',  active: true },
    { label: 'العمال',           icon: 'briefcase'  },
    { label: 'التصنيفات',        icon: 'table'      },
    { label: 'طلبات الخدمة',    icon: 'clipboard'  },
    { label: 'المدفوعات',        icon: 'credit-card'},
    { label: 'التقييمات',        icon: 'star'       },
    { label: 'مراقبة المحادثات', icon: 'message'    },
  ];
}
