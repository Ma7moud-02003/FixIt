import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Notifi } from '../../Core/Services/-notifi';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TopNav } from '../../Shared/Components/top-nav/top-nav';
import { NotificationModel } from '../../Shared/Models/notof';
import { Router } from '@angular/router';
import { Auth } from '../../Core/Services/auth';
import { UserRole } from '../../Shared/enums/role';

interface Notification {
  id: string;
  type: 'message' | 'user' | 'alert' | 'system';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  category: 'today' | 'earlier';
}
enum NotifType{
  SERVICE='Service',
  WALLETE='Wallete',
  CHAT='Chat',
  SYSTEM='System'
}
export type NotificationFilter = 'all' | 'unread' | 'read';
@Component({
  selector: 'app-notifications',
  imports: [CommonModule, TopNav],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})

export class Notifications implements OnInit, OnDestroy {

  notifsType=NotifType;
  private _notifi = inject(Notifi);
  private subs = new Subscription();
  allNotifs = signal<NotificationModel[]>([]);
  ngOnInit(): void {
    this.getMyNotificatons();
  }
  getMyNotificatons() {
    this.subs.add(this._notifi.getMyFavorite().subscribe({
      next: (res: any) => {
        this.allNotifs.set(res.data)
        console.log(this.allNotifs());
        
      }

    }))
  }

  // static data for testing
  activeFilter = signal<NotificationFilter>('all');

  // 2. Create a cleaner array for the template
  readonly filters: NotificationFilter[] = ['all', 'unread', 'read'];

  // 3. Create a method to handle the update
  setFilter(filter: NotificationFilter) {
    this.activeFilter.set(filter);
  }

 filteredNotifications = computed(() => {
  const filter = this.activeFilter();
  const all = this.allNotifs();

  if (filter === 'unread') return all.filter(n => !n.isRead);
  if (filter === 'read') return all.filter(n => n.isRead);

  return [...all].sort((a, b) => {
    // الأول: غير المقروء
    if (a.isRead !== b.isRead) {
      return Number(a.isRead) - Number(b.isRead);
      // false (0) هيبقى قبل true (1)
    }

    // الثاني: الأحدث
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
});

  todayNotifications = computed(() =>
    this.filteredNotifications().filter(n => new Date(n.createdAt) <= new Date())
  );

  earlierNotifications = computed(() =>
    this.filteredNotifications().filter(n => new Date(n.createdAt) >= new Date())
  );

  // Actions
  markAllAsRead() {
    this.allNotifs.update(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  }

  markAsRead(id: string) {
    this.allNotifs.update(prev =>
      prev.map(n => n.notificationId.toString() === id ? { ...n, isRead: true } : n)
    );
   this.subs.add(this._notifi.readNotification(+id).subscribe({
      next:()=>{
        console.log('readed');
   
        
      }
    }))
  }

  private _auth=inject(Auth);
  private rout=inject(Router);
  role=signal<string>('');
  routeTo(type:string,id:string)
  {
    this.role.set(this._auth.getRole()||'')
switch (type)
{
  case NotifType.SERVICE:
    if(this.role()&&this.role()==UserRole.Worker_Role)
    {
this.rout.navigate(['/dashboared/ser_details',id]);
    }
    else if(this.role()&&this.role()==UserRole.Clien_Role)
this.rout.navigate(['/mainLayout/ser_details',id]);
    break;
    case NotifType.CHAT :
      this.rout.navigate(['/chat'])
}

  }



  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}