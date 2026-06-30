import { Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  active?: boolean;
}
 
@Component({
  selector: 'app-bottom-nav',
  imports: [RouterModule],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.css',
})
export class BottomNav {
   navItems = input<NavItem[]>([
    { label: 'الرئيسية',  icon: 'grid',       route: '/admin/users',       active: true  },
    { label: 'المستخدمين', icon: 'users',      route: '/admin/users',      active: false },
    { label: 'العمال',    icon: 'briefcase',   route: '/admin/workers',    active: false },
    { label: 'الخدمات',   icon: 'clipboard',   route: '/admin/services',   active: false },
    { label: 'الدردشة',   icon: 'message',     route: '/admin/chats',       active: false },
    { label: 'التقارير',   icon: 'report',     route: '/admin/reports',       active: false },

  ]);
 
  /**
   * على الموبايل بنأخذ أول 5 عناصر فقط من الـ navItems
   * (النافبار السفلي محدود بـ 5-6 slots)
   */
  mobileNavItems = computed(() => this.navItems().slice(0, 5));
 
  /** تغيير العنصر النشط */
  setActive(selected: NavItem) {
    // نحدث الـ active في القائمة
    this.navItems().forEach(item => (item.active = false));
    selected.active = true;
  }
}
